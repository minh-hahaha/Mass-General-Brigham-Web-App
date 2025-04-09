#!/bin/sh

# Log environment variables
echo "Starting with environment:"
echo "PORT: $PORT"
echo "BACKEND_PORT: $BACKEND_PORT"
echo "NODE_ENV: $NODE_ENV"
echo "Database: $POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DB"

# Build the frontend (this ensures we have the latest build)
echo "Building frontend..."
cd /app/apps/frontend
yarn build

# Start the backend server in the background
echo "Starting backend..."
cd /app/apps/backend
PORT=$BACKEND_PORT yarn docker:run &
BACKEND_PID=$!

# Handle signals properly
trap "kill $BACKEND_PID; exit" SIGINT SIGTERM

# Start nginx in the foreground
echo "Starting nginx..."
nginx -g "daemon off;"
