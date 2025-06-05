#!/bin/bash

echo "Budowanie obrazów Docker..."
cd ..
docker build -t rabbitmq-producer:latest ./producer
docker build -t rabbitmq-consumers:latest ./consumers

echo "Wdrażanie do Kubernetes..."
cd k8s
kubectl apply -f rabbitmq-deployment.yaml
kubectl apply -f producer-deployment.yaml  
kubectl apply -f consumers-deployment.yaml

echo "Sprawdzanie statusu..."
kubectl get pods
kubectl get services

echo "Gotowe! Sprawdź:"
echo "- API: http://localhost:30800"
echo "- RabbitMQ Management: http://localhost:30672" 