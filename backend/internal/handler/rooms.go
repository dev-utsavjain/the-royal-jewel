package handler

import (
	"net/http"
	"strconv"

	"imagine_backend/internal/db"
	"imagine_backend/internal/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// ListRooms handles GET /api/rooms — public, ordered by SortOrder.
func ListRooms(c *gin.Context) {
	var rooms []models.Room
	if err := db.DB.Order("sort_order asc, id asc").Find(&rooms).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load rooms"})
		return
	}
	c.JSON(http.StatusOK, rooms)
}

// GetRoom handles GET /api/rooms/:slug — public.
func GetRoom(c *gin.Context) {
	var room models.Room
	if err := db.DB.Where("slug = ?", c.Param("slug")).First(&room).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
		return
	}
	c.JSON(http.StatusOK, room)
}

// CreateRoom handles POST /api/admin/rooms.
func CreateRoom(c *gin.Context) {
	var room models.Room
	if err := c.ShouldBindJSON(&room); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	if room.Slug == "" || room.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "slug and name are required"})
		return
	}
	// Never let the client set identity/soft-delete fields on create.
	room.Model = gorm.Model{}
	if err := db.DB.Create(&room).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not create room (slug may already exist)"})
		return
	}
	c.JSON(http.StatusCreated, room)
}

// UpdateRoom handles PUT /api/admin/rooms/:id.
func UpdateRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var room models.Room
	if err := db.DB.First(&room, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
		return
	}

	var input models.Room
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	// Preserve identity/soft-delete fields from the loaded row; only content is editable.
	input.Model = room.Model
	// Save writes all columns, so json-serialized slices reset cleanly too.
	if err := db.DB.Save(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update room (slug may already exist)"})
		return
	}
	c.JSON(http.StatusOK, input)
}

// DeleteRoom handles DELETE /api/admin/rooms/:id.
func DeleteRoom(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	res := db.DB.Delete(&models.Room{}, id)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete room"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "room not found"})
		return
	}
	c.Status(http.StatusNoContent)
}
