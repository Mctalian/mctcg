#!/bin/sh

COMMIT_ID=$(git rev-parse HEAD)
ARTIFACT_REPO=us-west1-docker.pkg.dev/ptcg-tools/pdeckf/pdeckf
IMAGE=${ARTIFACT_REPO}:${COMMIT_ID}

docker manifest inspect ${IMAGE} >/dev/null 2>/dev/null
image_exists=$?

# # Check if image with commit ID tag already exists
if [ "${image_exists}" -eq "0" ]; then
  echo "Image with commit ID tag already exists. Skipping build and push."
else
  echo "Deploying commit ${COMMIT_ID}"

  # Build Docker image
  docker build --platform="linux/amd64" -t ${IMAGE} .

  # Push Docker image
  docker push ${IMAGE}
fi

echo "Attempting to deploy image to Cloud Run..."

gcloud run deploy pdeckf \
  --image=${IMAGE} \
  --region=us-west1 \
  --allow-unauthenticated



