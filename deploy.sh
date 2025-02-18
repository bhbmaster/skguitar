#!/bin/bash

# Configuration
APP_NAME="skguitar-app"
INTERNAL_PORT=52929  # Port inside the container
START_PORT=8000     # Starting external port to try
MAX_PORT=8020      # Maximum port to try

# Update app.py to use the internal port
sed -i "s/port=[0-9]*/port=$INTERNAL_PORT/" app.py

# Function to check if a port is in use
is_port_in_use() {
    lsof -i ":$1" >/dev/null 2>&1
    return $?
}

# Function to find an available port
find_available_port() {
    local port=$START_PORT
    while [ $port -le $MAX_PORT ]; do
        if ! is_port_in_use $port; then
            echo $port
            return 0
        fi
        ((port++))
    done
    echo "No available ports found between $START_PORT and $MAX_PORT" >&2
    exit 1
}

# Stop and remove any existing containers
echo "Stopping any running containers..."
docker ps -q --filter "name=$APP_NAME" | xargs -r docker stop
docker ps -aq --filter "name=$APP_NAME" | xargs -r docker rm

# Remove existing image
echo "Removing existing image..."
docker rmi -f $APP_NAME 2>/dev/null

# Build new image
echo "Building new image..."
docker build -t $APP_NAME .

# Find available port
PORT=$(find_available_port)
echo "Using port: $PORT"

# Run the container
echo "Starting container..."
docker run --name $APP_NAME -d --rm -p $PORT:$INTERNAL_PORT $APP_NAME

# Print status
echo "Container started!"
echo "Application is running at: http://localhost:$PORT"

# Wait for logs to show
echo "Wait 2 second"
sleep 2

# Print logs
echo "Container logs:"
docker logs $APP_NAME

# Open browser
echo "Open browser to:"
echo "http://localhost:$PORT/"

# EOF
