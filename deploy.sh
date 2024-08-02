#!/bin/bash

# Stop the most recently created container if it is running
CONTAINER_ID=$(docker ps -lq)
echo "Most recently created container ID: $CONTAINER_ID"
if [ -n "$CONTAINER_ID" ]; then
    echo "Stopping the running container..."
    docker stop ${CONTAINER_ID}
    echo "Container stopped."
fi

# Define the Docker image names
FE_IMAGE1="pardhuguttula/userbot"
FE_IMAGE2="pardhuguttula/agentchat-fe"
BE_IMAGE="pardhuguttula/agentchat-be"

# Get the latest Docker tags from DockerHub
FE_TAG1=$(curl -s "https://hub.docker.com/v2/repositories/${FE_IMAGE1}/tags/" | jq -r '.results[0].name')
FE_TAG2=$(curl -s "https://hub.docker.com/v2/repositories/${FE_IMAGE2}/tags/" | jq -r '.results[0].name')
BE_TAG=$(curl -s "https://hub.docker.com/v2/repositories/${BE_IMAGE}/tags/" | jq -r '.results[0].name')

# Pull the images with the dynamically determined tags
echo "Pulling image ${FE_IMAGE1}:${FE_TAG1}..."
docker pull "${FE_IMAGE1}:${FE_TAG1}"

echo "Pulling image ${FE_IMAGE2}:${FE_TAG2}..."
docker pull "${FE_IMAGE2}:${FE_TAG2}"

echo "Pulling image ${BE_IMAGE}:${BE_TAG}..."
docker pull "${BE_IMAGE}:${BE_TAG}"

# Update docker-compose.yml with the latest tags
echo "Updating docker-compose.yml with the latest tags..."
sed -i "s|image: ${FE_IMAGE1}:latest|image: ${FE_IMAGE1}:${FE_TAG1}|g" ./docker-compose.yml
sed -i "s|image: ${FE_IMAGE2}:latest|image: ${FE_IMAGE2}:${FE_TAG2}|g" ./docker-compose.yml
sed -i "s|image: ${BE_IMAGE}:latest|image: ${BE_IMAGE}:${BE_TAG}|g" ./docker-compose.yml

# Run the Docker Compose file to start the containers
echo "Starting containers with Docker Compose..."
docker-compose -f BACKUPS/docker-compose.yml up -d
echo "Containers started with Docker Compose."