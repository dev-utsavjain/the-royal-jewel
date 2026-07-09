# MinIO — S3-compatible object storage for The Royal Jewel image uploads.
# Data persists on a Railway volume mounted at /data.
FROM minio/minio:latest

EXPOSE 9000 9001

# API on 9000, web console on 9001. Root creds come from env
# (MINIO_ROOT_USER / MINIO_ROOT_PASSWORD) set as Railway variables.
ENTRYPOINT []
CMD ["minio", "server", "/data", "--address", ":9000", "--console-address", ":9001"]
