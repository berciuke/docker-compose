#!/bin/bash

IMAGE_NAME="apajak/multiplatform-app"
TAG="latest"

echo "Tworzenie buildx builder..."
docker buildx create --name multiplatform --use --bootstrap

echo "Budowanie i publikacja obrazu..."
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --tag $IMAGE_NAME:$TAG \
  --push \
  .

echo "Gotowe! Obraz dostępny: $IMAGE_NAME:$TAG" 