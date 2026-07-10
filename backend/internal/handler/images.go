package handler

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"io"
	"net/http"
	"regexp"
	"strconv"
	"strings"

	"imagine_backend/internal/db"
	"imagine_backend/internal/models"
	"imagine_backend/internal/storage"

	"github.com/gin-gonic/gin"
	"github.com/minio/minio-go/v7"
)

const maxImageBytes = 5 << 20 // 5 MB

// allowedImageTypes is a raster allow-list. SVG is intentionally excluded — it can
// carry <script> and would execute as stored XSS when served inline from our origin.
var allowedImageTypes = map[string]string{
	"image/png":  ".png",
	"image/jpeg": ".jpg",
	"image/gif":  ".gif",
	"image/webp": ".webp",
}

// mediaKeyRe constrains served object keys to what UploadImage generates:
// 32 hex chars + a known raster extension. Prevents path traversal / arbitrary
// object access through GET /api/media/:key.
var mediaKeyRe = regexp.MustCompile(`^[a-f0-9]{32}\.(png|jpg|gif|webp)$`)

// UploadImage handles POST /api/admin/images (multipart, field "file").
// Stores the bytes in MinIO and returns the public (same-origin) URL.
func UploadImage(c *gin.Context) {
	if !storage.Enabled() {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "image storage is not configured"})
		return
	}

	// Cap the body before parsing so oversized uploads are rejected while streaming,
	// not after buffering the whole request to memory/disk.
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, maxImageBytes+1024)

	fileHeader, err := c.FormFile("file")
	if err != nil {
		if strings.Contains(err.Error(), "too large") {
			c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "image exceeds 5MB limit"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "no file uploaded (expected form field 'file')"})
		return
	}
	if fileHeader.Size > maxImageBytes {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "image exceeds 5MB limit"})
		return
	}

	f, err := fileHeader.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read upload"})
		return
	}
	defer f.Close()

	data, err := io.ReadAll(io.LimitReader(f, maxImageBytes+1))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read upload"})
		return
	}
	if len(data) > maxImageBytes {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "image exceeds 5MB limit"})
		return
	}

	// Trust the bytes, not the client-supplied Content-Type.
	detected := http.DetectContentType(data)
	if i := strings.IndexByte(detected, ';'); i >= 0 {
		detected = detected[:i]
	}
	ext, ok := allowedImageTypes[detected]
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported image type (allowed: png, jpeg, gif, webp)"})
		return
	}

	buf := make([]byte, 16)
	if _, err := rand.Read(buf); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not generate object key"})
		return
	}
	key := hex.EncodeToString(buf) + ext

	_, err = storage.Client.PutObject(c.Request.Context(), storage.Bucket, key,
		bytes.NewReader(data), int64(len(data)), minio.PutObjectOptions{ContentType: detected})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not store image"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"key": key, "url": "/api/media/" + key})
}

// GetMedia handles GET /api/media/:key — public, streams the object from MinIO.
func GetMedia(c *gin.Context) {
	if !storage.Enabled() {
		c.Status(http.StatusServiceUnavailable)
		return
	}

	key := c.Param("key")
	if !mediaKeyRe.MatchString(key) {
		c.Status(http.StatusNotFound)
		return
	}

	obj, err := storage.Client.GetObject(c.Request.Context(), storage.Bucket, key, minio.GetObjectOptions{})
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}
	defer obj.Close()

	// Stat resolves whether the object actually exists (GetObject is lazy).
	info, err := obj.Stat()
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}

	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.DataFromReader(http.StatusOK, info.Size, info.ContentType, obj, nil)
}

// GetImage handles GET /api/images/:id — legacy path for images stored in Postgres
// before the MinIO migration. Kept so old URLs keep resolving.
func GetImage(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}

	var img models.Image
	if err := db.DB.First(&img, id).Error; err != nil {
		c.Status(http.StatusNotFound)
		return
	}
	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.Data(http.StatusOK, img.MimeType, img.Data)
}
