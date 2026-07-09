package handler

import (
	"io"
	"net/http"
	"strconv"
	"strings"

	"imagine_backend/internal/db"
	"imagine_backend/internal/models"

	"github.com/gin-gonic/gin"
)

const maxImageBytes = 5 << 20 // 5 MB

// allowedImageTypes is a raster allow-list. SVG is intentionally excluded — it can
// carry <script> and would execute as stored XSS when served inline from our origin.
var allowedImageTypes = map[string]bool{
	"image/png":  true,
	"image/jpeg": true,
	"image/gif":  true,
	"image/webp": true,
}

// UploadImage handles POST /api/admin/images (multipart, field "file").
// Stores the bytes in Postgres and returns the public URL.
func UploadImage(c *gin.Context) {
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
	if !allowedImageTypes[detected] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unsupported image type (allowed: png, jpeg, gif, webp)"})
		return
	}

	img := models.Image{MimeType: detected, Data: data}
	if err := db.DB.Create(&img).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not store image"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"id": img.ID, "url": "/api/images/" + strconv.FormatUint(uint64(img.ID), 10)})
}

// GetImage handles GET /api/images/:id — public, serves the raw bytes.
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
	// Stored MimeType is a server-detected raster type; nosniff is defense-in-depth.
	c.Header("X-Content-Type-Options", "nosniff")
	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.Data(http.StatusOK, img.MimeType, img.Data)
}
