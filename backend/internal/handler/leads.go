package handler

import (
	"net/http"
	"net/mail"
	"strconv"
	"strings"

	"imagine_backend/internal/db"
	"imagine_backend/internal/models"

	"github.com/gin-gonic/gin"
)

// leadRequest is the public-facing shape for POST /api/leads. Binding into a DTO
// (not the gorm model) prevents mass-assignment of ID/CreatedAt/DeletedAt/Status.
type leadRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Type     string `json:"type"`
	Subject  string `json:"subject"`
	Message  string `json:"message"`
	CheckIn  string `json:"checkIn"`
	CheckOut string `json:"checkOut"`
	Guests   string `json:"guests"`
}

func clamp(s string, n int) string {
	s = strings.TrimSpace(s)
	if len(s) > n {
		return s[:n]
	}
	return s
}

// CreateLead handles POST /api/leads — public. Captures a contact or booking enquiry.
func CreateLead(c *gin.Context) {
	var req leadRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	name := clamp(req.Name, 200)
	email := clamp(req.Email, 254)
	phone := clamp(req.Phone, 32)

	if name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "name is required"})
		return
	}
	if email == "" && phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "an email or phone number is required"})
		return
	}
	if email != "" {
		if _, err := mail.ParseAddress(email); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid email address"})
			return
		}
	}

	leadType := clamp(req.Type, 20)
	if leadType == "" {
		leadType = "contact"
	}

	lead := models.Lead{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Type:     leadType,
		Subject:  clamp(req.Subject, 200),
		Message:  clamp(req.Message, 5000),
		CheckIn:  clamp(req.CheckIn, 40),
		CheckOut: clamp(req.CheckOut, 40),
		Guests:   clamp(req.Guests, 20),
		Status:   "new", // server-controlled
	}

	if err := db.DB.Create(&lead).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not submit enquiry"})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Enquiry received", "id": lead.ID})
}

// ListLeads handles GET /api/admin/leads — newest first.
func ListLeads(c *gin.Context) {
	var leads []models.Lead
	if err := db.DB.Order("created_at desc").Find(&leads).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not load leads"})
		return
	}
	c.JSON(http.StatusOK, leads)
}

// UpdateLeadStatus handles PATCH /api/admin/leads/:id — updates only the status.
func UpdateLeadStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var body struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}
	switch body.Status {
	case "new", "contacted", "closed":
	default:
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid status"})
		return
	}

	var lead models.Lead
	if err := db.DB.First(&lead, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "lead not found"})
		return
	}
	lead.Status = body.Status
	if err := db.DB.Save(&lead).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not update lead"})
		return
	}
	c.JSON(http.StatusOK, lead)
}

// DeleteLead handles DELETE /api/admin/leads/:id.
func DeleteLead(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}
	res := db.DB.Delete(&models.Lead{}, id)
	if res.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "could not delete lead"})
		return
	}
	if res.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "lead not found"})
		return
	}
	c.Status(http.StatusNoContent)
}
