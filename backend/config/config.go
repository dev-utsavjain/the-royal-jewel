package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port       string
	Env        string
	DBUser     string
	DBPassword string
	DBName     string
	DBHost     string
	DBPort     string
	DBSchema   string
	JWTSecret  string
	RAGBaseURL string
	RAGAPIKey  string

	AdminEmail    string
	AdminPassword string
}

var AppConfig *Config

func LoadConfig() {
	godotenv.Load()

	env := os.Getenv("ENV")
	fmt.Printf("env: %s\n", env)
	if env == "" {
		env = "development"
	} else {
		godotenv.Overload(".env." + env)
	}

	AppConfig = &Config{
		Port:       os.Getenv("PORT"),
		Env:        os.Getenv("ENV"),
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBHost:     os.Getenv("DB_HOST"),
		DBPort:     os.Getenv("DB_PORT"),
		DBSchema:   os.Getenv("DB_SCHEMA"),
		JWTSecret:  os.Getenv("JWT_SECRET"),
		RAGBaseURL: os.Getenv("RAG_BASE_URL"),
		RAGAPIKey:  os.Getenv("RAG_API_KEY"),

		AdminEmail:    os.Getenv("ADMIN_EMAIL"),
		AdminPassword: os.Getenv("ADMIN_PASSWORD"),
	}
	if AppConfig.JWTSecret == "" {
		AppConfig.JWTSecret = "your-very-secret-key"
	}
	if AppConfig.AdminEmail == "" {
		AppConfig.AdminEmail = "admin@theroyaljewel.com"
	}
	if AppConfig.AdminPassword == "" {
		AppConfig.AdminPassword = "royaljewel123"
	}
	if AppConfig.Port == "" {
		AppConfig.Port = "8080"
	}
}
