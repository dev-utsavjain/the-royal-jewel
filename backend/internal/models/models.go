package models

import "gorm.io/gorm"

// User is an admin who can log into the console.
type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string `gorm:"not null" json:"-"`
}

// Amenity is a single labeled room amenity. Icon is a key the frontend maps
// to a lucide icon (e.g. "wifi", "tv", "wind", "coffee").
type Amenity struct {
	Name string `json:"name"`
	Icon string `json:"icon"`
}

// Room is a bookable room type, editable from the CMS.
type Room struct {
	gorm.Model
	Slug        string    `gorm:"uniqueIndex;not null" json:"slug"`
	Name        string    `json:"name"`
	Price       string    `json:"price"`
	MainImage   string    `json:"mainImage"`
	Gallery     []string  `gorm:"serializer:json" json:"gallery"`
	Description string    `json:"description"`
	Details     string    `json:"details"`
	Size        string    `json:"size"`
	BedType     string    `json:"bedType"`
	Occupancy   string    `json:"occupancy"`
	Amenities   []Amenity `gorm:"serializer:json" json:"amenities"`
	Features    []string  `gorm:"serializer:json" json:"features"`
	SortOrder   int       `json:"sortOrder"`
}

// Lead is a captured enquiry from the public site — either a contact-form
// message or a room/event booking request. Viewed in the admin console.
type Lead struct {
	gorm.Model
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Type     string `json:"type"`    // "contact" | "booking" | "event"
	Subject  string `json:"subject"` // contact subject, or the room/event name
	Message  string `json:"message"`
	CheckIn  string `json:"checkIn"`
	CheckOut string `json:"checkOut"`
	Guests   string `json:"guests"`
	Status   string `json:"status"` // "new" | "contacted" | "closed"
}

// Image holds an admin-uploaded file. Bytes live in Postgres so they survive
// Railway's ephemeral filesystem across redeploys. Served via GET /api/images/:id.
type Image struct {
	gorm.Model
	MimeType string `json:"mimeType"`
	Data     []byte `gorm:"type:bytea" json:"-"`
}
