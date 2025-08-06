#!/bin/bash

echo "Testing Docker setup for Parrots application"
echo "-------------------------------------------"

# Stop any running containers
echo "Stopping any running containers..."
docker-compose down

# Start the containers with docker-compose
echo "Starting containers with docker-compose..."
docker-compose up -d

# Wait for services to start
echo "Waiting for services to start (10 seconds)..."
sleep 10

# Check if web container is running
echo "Checking if web container is running..."
if docker ps | grep parrots-app > /dev/null; then
  echo "✅ Web container is running"
else
  echo "❌ Web container is not running"
fi

# Check if redis container is running
echo "Checking if redis container is running..."
if docker ps | grep parrots-redis > /dev/null; then
  echo "✅ Redis container is running"
else
  echo "❌ Redis container is not running"
fi

# Check if the web application is accessible
echo "Checking if web application is accessible..."
if curl -s http://localhost:3000 > /dev/null; then
  echo "✅ Web application is accessible at http://localhost:3000"
else
  echo "❌ Web application is not accessible at http://localhost:3000"
  echo "Checking container logs for errors..."
  docker logs parrots-app
fi

echo "-------------------------------------------"
echo "Setup test complete. You can now configure RubyMine to use the Dockerfile.dev directly."
echo "Instructions for RubyMine configuration:"
echo "1. In RubyMine, go to Run > Edit Configurations"
echo "2. Click the + button and select 'Docker: Run/Debug Configuration'"
echo "3. Set the Server to your Docker connection"
echo "4. Set the Image to be built from Dockerfile.dev"
echo "5. Set the Container name to 'parrots-app-rubymine' (different from docker-compose)"
echo "6. Set the port bindings to '3000:3000, 1234:1234, 26162:26162'"
echo "7. Make sure Redis is running from docker-compose before starting this configuration"