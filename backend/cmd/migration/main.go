package main

import (
	"fmt"
	"log"

	"imagine_backend/config"
	"imagine_backend/internal/db"
	"imagine_backend/internal/models"
	"imagine_backend/internal/utils"

	"gorm.io/gorm"
)

func main() {
	config.LoadConfig()
	db.ConnectToDB()
	sqlDB, err := db.DB.DB()
	if err != nil {
		log.Fatalf("Failed to get SQL DB: %v", err)
	}
	defer func() {
		if err := sqlDB.Close(); err != nil {
			log.Printf("Error closing DB: %v", err)
		}
	}()

	log.Printf("Connected to database: %v", db.DB.Dialector.Name())

	// Multi-tenant: every project shares one physical DB, isolated by schema.
	// Create the tenant schema and pin search_path to it BEFORE AutoMigrate so
	// tables land in this project's schema, never public.
	schema := config.AppConfig.DBSchema // sourced from DB_SCHEMA env var
	if schema == "" {
		log.Fatalf("DB_SCHEMA environment variable is required but empty — cannot run migration without a target schema")
	}
	if err := db.DB.Exec(fmt.Sprintf(`CREATE SCHEMA IF NOT EXISTS "%s"`, schema)).Error; err != nil {
		log.Fatalf("failed to create schema %q: %v", schema, err)
	}
	if err := db.DB.Exec(fmt.Sprintf(`SET search_path TO "%s"`, schema)).Error; err != nil {
		log.Fatalf("failed to set search_path to %q: %v", schema, err)
	}
	log.Printf("Running migrations in schema %q...", schema)

	if err := db.DB.AutoMigrate(&models.User{}, &models.Room{}, &models.Lead{}, &models.Image{}, &models.SiteContent{}); err != nil {
		log.Fatal(err)
	}
	log.Println("All models migrated successfully")

	seedAdmin(db.DB)
	seedRooms(db.DB)
}

func seedAdmin(gdb *gorm.DB) {
	var count int64
	gdb.Model(&models.User{}).Where("email = ?", config.AppConfig.AdminEmail).Count(&count)
	if count > 0 {
		log.Println("Admin user already exists, skipping seed")
		return
	}
	hash, err := utils.HashPassword(config.AppConfig.AdminPassword)
	if err != nil {
		log.Fatalf("Failed to hash admin password: %v", err)
	}
	if err := gdb.Create(&models.User{Email: config.AppConfig.AdminEmail, PasswordHash: hash}).Error; err != nil {
		log.Fatalf("Failed to seed admin: %v", err)
	}
	log.Printf("Seeded admin user: %s", config.AppConfig.AdminEmail)
}

func seedRooms(gdb *gorm.DB) {
	var count int64
	gdb.Model(&models.Room{}).Count(&count)
	if count > 0 {
		log.Println("Rooms already exist, skipping seed")
		return
	}
	for _, r := range defaultRooms {
		if err := gdb.Create(&r).Error; err != nil {
			log.Fatalf("Failed to seed room %s: %v", r.Slug, err)
		}
	}
	log.Printf("Seeded %d rooms", len(defaultRooms))
}

var defaultRooms = []models.Room{
	{
		Slug:      "deluxe",
		Name:      "Deluxe Room",
		Price:     "From Rs. 2,328 / night",
		MainImage: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
		Gallery: []string{
			"https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
		},
		Description: "Warm and comfortable standard accommodation designed for both relaxation and productivity. The Deluxe Room features contemporary decor with thoughtful touches.",
		Details:     "Our Deluxe Rooms offer a perfect blend of comfort and style. Ideal for both business and leisure travelers, these rooms are thoughtfully designed with modern amenities, ensuring a restful stay.",
		Size:        "320 sq. ft.",
		BedType:     "Queen-size bed",
		Occupancy:   "2 Adults, 1 Child",
		Amenities: []models.Amenity{
			{Name: "Air Conditioning", Icon: "wind"},
			{Name: "High-speed WiFi", Icon: "wifi"},
			{Name: "Smart TV", Icon: "tv"},
			{Name: "Tea/Coffee Maker", Icon: "coffee"},
		},
		Features:  []string{"In-room safe", "Work desk", "Premium toiletries", "24-hour room service", "Daily housekeeping"},
		SortOrder: 0,
	},
	{
		Slug:      "premium",
		Name:      "Premium Room",
		Price:     "From Rs. 3,500 / night",
		MainImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
		Gallery: []string{
			"https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop",
		},
		Description: "Elegant workspace and spacious interiors offering elevated comfort with premium furnishings.",
		Details:     "Step into elevated luxury with our Premium Rooms. Offering more space and enhanced amenities, these rooms are designed for those who appreciate the finer things. Enjoy a spacious work area and a luxurious modern bathroom.",
		Size:        "450 sq. ft.",
		BedType:     "King-size bed",
		Occupancy:   "2 Adults, 2 Children",
		Amenities: []models.Amenity{
			{Name: "Air Conditioning", Icon: "wind"},
			{Name: "High-speed WiFi", Icon: "wifi"},
			{Name: "Smart TV", Icon: "tv"},
			{Name: "Espresso Machine", Icon: "coffee"},
		},
		Features:  []string{"Spacious sitting area", "Complimentary breakfast", "Premium bath amenities", "Mini-bar", "Plush bathrobes & slippers"},
		SortOrder: 1,
	},
	{
		Slug:      "royal",
		Name:      "Royal Suite",
		Price:     "From Rs. 6,500 / night",
		MainImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
		Gallery: []string{
			"https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=2074&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1522771731478-44fb8d89e5d4?q=80&w=2070&auto=format&fit=crop",
			"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070&auto=format&fit=crop",
		},
		Description: "Our finest accommodation for a truly luxurious stay. Features a separate living area and exceptional rooftop views.",
		Details:     "Experience the pinnacle of luxury in our Royal Suite. This expansive suite offers a separate living room, unparalleled city views, and bespoke furnishings. It's the ultimate sanctuary for VIP guests and special occasions.",
		Size:        "850 sq. ft.",
		BedType:     "California King bed",
		Occupancy:   "3 Adults, 2 Children",
		Amenities: []models.Amenity{
			{Name: "Climate Control", Icon: "wind"},
			{Name: "Premium WiFi", Icon: "wifi"},
			{Name: "2x 65\" Smart TVs", Icon: "tv"},
			{Name: "Premium Coffee Station", Icon: "coffee"},
		},
		Features:  []string{"Separate living & dining area", "Jacuzzi bathtub", "Panoramic city views", "Dedicated butler service", "Complimentary airport transfers", "Exclusive lounge access"},
		SortOrder: 2,
	},
}
