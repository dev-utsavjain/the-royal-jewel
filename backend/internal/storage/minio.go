// Package storage wraps the MinIO (S3-compatible) client used for uploaded media.
// Uploads are stored in a bucket over Railway's private network; the app streams
// them back to browsers via GET /api/media/:key (see internal/handler/images.go),
// so the bucket never needs to be publicly reachable.
package storage

import (
	"context"
	"log"
	"time"

	"imagine_backend/config"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// Client is the shared MinIO client, initialized by Init at startup. It is nil
// when MinIO is not configured (e.g. local dev without object storage), in which
// case upload/serve handlers return a clear 503.
var Client *minio.Client

// Bucket is the target bucket for uploaded media.
var Bucket string

// Enabled reports whether object storage is configured and ready.
func Enabled() bool { return Client != nil }

// Init connects to MinIO and ensures the bucket exists. A missing endpoint is not
// fatal — the server still boots (uploads just won't work) so local dev is unblocked.
func Init() error {
	cfg := config.AppConfig
	if cfg.MinioEndpoint == "" {
		log.Println("MinIO not configured (MINIO_ENDPOINT empty) — image uploads disabled")
		return nil
	}

	client, err := minio.New(cfg.MinioEndpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(cfg.MinioAccessKey, cfg.MinioSecretKey, ""),
		Secure: cfg.MinioUseSSL,
	})
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	exists, err := client.BucketExists(ctx, cfg.MinioBucket)
	if err != nil {
		return err
	}
	if !exists {
		if err := client.MakeBucket(ctx, cfg.MinioBucket, minio.MakeBucketOptions{}); err != nil {
			return err
		}
		log.Printf("Created MinIO bucket %q", cfg.MinioBucket)
	}

	Client = client
	Bucket = cfg.MinioBucket
	log.Printf("MinIO ready at %s (bucket %q)", cfg.MinioEndpoint, cfg.MinioBucket)
	return nil
}
