#!/bin/bash

# Load environment variables from .env.aws
set -a
source .env.aws
set +a

# Set the full repository URI
REPOSITORY_URI=$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$REPOSITORY_NAME

# Generate timestamp for versioning
TIMESTAMP=$(date +%m-%d-%H-%M)

# Login to AWS ECR
echo "Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI

# Build the Docker image with production target and environment variables
echo "Building Docker image..."
docker build --target production \
  --build-arg POSTGRES_USER=$POSTGRES_USER \
  --build-arg POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  --build-arg POSTGRES_DB=$POSTGRES_DB \
  --build-arg POSTGRES_HOST=$POSTGRES_HOST \
  --build-arg POSTGRES_PORT=$POSTGRES_PORT \
  --build-arg POSTGRES_URL="$POSTGRES_URL" \
  --build-arg NODE_ENV=$NODE_ENV \
  --build-arg PORT=$PORT \
  --build-arg FRONTEND_PORT=$FRONTEND_PORT \
  --build-arg BACKEND_PORT=$BACKEND_PORT \
  -t $REPOSITORY_URI:$TIMESTAMP \
  -f ./docker/Dockerfile .

# Tag the image with latest
echo "Tagging image as latest..."
docker tag $REPOSITORY_URI:$TIMESTAMP $REPOSITORY_URI:latest

# Push both tags to ECR
echo "Pushing images to ECR..."
docker push $REPOSITORY_URI:$TIMESTAMP
docker push $REPOSITORY_URI:latest

echo "Deployment complete!"
