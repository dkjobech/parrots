# Docker Setup for Parrots Application

This guide explains how to run the Parrots application using Docker and Docker Compose, and how to configure RubyMine to work with this setup.

## Running with Docker Compose

The application consists of two services:
- `web`: The Rails application
- `redis`: Redis server for caching and background jobs

To start both services:

```bash
docker-compose up -d
```

This will start both the web application and Redis server. The web application will be available at http://localhost:3000.

## RubyMine Configuration

RubyMine has limitations when working with Docker Compose files directly. To work around this, we've configured the project to support both Docker Compose and direct Docker runs.

### Option 1: Run Redis with Docker Compose, Web with RubyMine

1. Start only the Redis service:
   ```bash
   docker-compose up -d redis
   ```

2. In RubyMine, go to Run > Edit Configurations
3. Click the + button and select "Docker: Run/Debug Configuration"
4. Configure as follows:
   - Server: Your Docker connection
   - Image: Built from Dockerfile.dev
   - Container name: "parrots-app-rubymine" (different from docker-compose)
   - Port bindings: "3000:3000, 1234:1234, 26162:26162"
   - Environment variables: Add any needed environment variables
5. Save the configuration and run it

### Option 2: Run Everything with Docker Compose

1. Start all services:
   ```bash
   docker-compose up -d
   ```

2. Use RubyMine for code editing only, not for running the application

### Troubleshooting

If you encounter issues:

1. Check container logs:
   ```bash
   docker logs parrots-app
   docker logs parrots-redis
   ```

2. Ensure ports are not in use by other applications:
   ```bash
   lsof -i :3000
   lsof -i :6379
   ```

3. Restart the containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

4. Run the test script:
   ```bash
   bash test_docker_setup.sh
   ```

## Development Workflow

1. Start the Redis service with Docker Compose
2. Start the web service with RubyMine's Docker configuration
3. Make code changes in RubyMine
4. RubyMine will automatically reload the application when files change (thanks to the volume mount)

This setup gives you the best of both worlds: Redis running in Docker Compose and the web application running through RubyMine with full debugging capabilities.