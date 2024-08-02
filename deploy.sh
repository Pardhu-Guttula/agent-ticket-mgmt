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

echo "Current directory: $(pwd)"

# Change to the directory containing docker-compose.yml if needed
cd /home/ubuntu/deploy || { echo "Directory not found"; exit 1; }

# Check if docker-compose.yml exists
if [ -f "./docker-compose.yml" ]; then
    echo "docker-compose.yml found."
else
    echo "docker-compose.yml not found!"
    exit 1
fi

echo "Checking for docker-compose.yml..."
ls -l ./docker-compose.yml

echo "FE_TAG1=${FE_TAG1}"
echo "FE_TAG2=${FE_TAG2}"
echo "BE_TAG=${BE_TAG}"

# Update docker-compose.yml with the latest tags
echo "Updating docker-compose.yml with the latest tags..."
sed -i "s|image: userbot-img:latest|image: ${FE_IMAGE1}:${FE_TAG1}|g" ./docker-compose.yml
sed -i "s|image: agentfe-img:latest|image: ${FE_IMAGE2}:${FE_TAG2}|g" ./docker-compose.yml
sed -i "s|image: agentbe-img:latest|image: ${BE_IMAGE}:${BE_TAG}|g" ./docker-compose.yml

# Print the updated contents of docker-compose.yml
echo "Updated docker-compose.yml contents:"
cat ./docker-compose.yml

# Run the Docker Compose file to start the containers
echo "Starting containers with Docker Compose..."
docker compose up -d
echo "Containers started with Docker Compose."