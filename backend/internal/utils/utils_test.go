package utils

import (
	"testing"

	"imagine_backend/config"
)

func TestPasswordHashAndCheck(t *testing.T) {
	hash, err := HashPassword("royaljewel123")
	if err != nil {
		t.Fatalf("hash failed: %v", err)
	}
	if !CheckPassword(hash, "royaljewel123") {
		t.Fatal("correct password rejected")
	}
	if CheckPassword(hash, "wrong") {
		t.Fatal("wrong password accepted")
	}
}

func TestJWTRoundTrip(t *testing.T) {
	config.AppConfig = &config.Config{JWTSecret: "test-secret"}

	token, err := GenerateJWT(42, "admin@theroyaljewel.com")
	if err != nil {
		t.Fatalf("generate failed: %v", err)
	}
	claims, err := ValidateJWT(token)
	if err != nil {
		t.Fatalf("validate failed: %v", err)
	}
	if claims.UserID != 42 || claims.Email != "admin@theroyaljewel.com" {
		t.Fatalf("claims mismatch: %+v", claims)
	}

	// Tampered/foreign token must be rejected.
	config.AppConfig.JWTSecret = "different-secret"
	if _, err := ValidateJWT(token); err == nil {
		t.Fatal("token validated under wrong secret")
	}
}
