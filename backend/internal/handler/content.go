package handler

import (
	"encoding/json"
	"io"
	"net/http"
	"regexp"

	"imagine_backend/internal/db"
	"imagine_backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// maxContentBytes caps a single section's JSON document.
const maxContentBytes = 512 << 10 // 512 KB

// sectionRe constrains section names to a safe slug (camelCase keys allowed).
var sectionRe = regexp.MustCompile(`^[A-Za-z0-9_-]{1,40}$`)

// GetContent handles GET /api/content — public. Returns a map of
// { section: <raw JSON document> } for every stored section. The frontend
// deep-merges this over its built-in defaults.
func GetContent(c *gin.Context) {
	var rows []models.SiteContent
	if err := db.DB.Find(&rows).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load content"})
		return
	}

	out := make(map[string]json.RawMessage, len(rows))
	for _, r := range rows {
		if r.Data == "" {
			continue
		}
		out[r.Section] = json.RawMessage(r.Data)
	}
	c.JSON(http.StatusOK, out)
}

// UpdateContentSection handles PUT /api/admin/content/:section (JWT).
// The request body is the section's JSON document (any valid JSON — object or array);
// it is validated and upserted verbatim.
func UpdateContentSection(c *gin.Context) {
	section := c.Param("section")
	if !sectionRe.MatchString(section) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid section name"})
		return
	}

	body, err := io.ReadAll(io.LimitReader(c.Request.Body, maxContentBytes+1))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not read body"})
		return
	}
	if len(body) > maxContentBytes {
		c.JSON(http.StatusRequestEntityTooLarge, gin.H{"error": "content too large"})
		return
	}
	if !json.Valid(body) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "body must be valid JSON"})
		return
	}

	var row models.SiteContent
	err = db.DB.Where("section = ?", section).First(&row).Error
	switch {
	case err == gorm.ErrRecordNotFound:
		row = models.SiteContent{Section: section, Data: string(body)}
		if err := db.DB.Create(&row).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save content"})
			return
		}
	case err != nil:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load content"})
		return
	default:
		row.Data = string(body)
		if err := db.DB.Save(&row).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "could not save content"})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"section": section})
}
