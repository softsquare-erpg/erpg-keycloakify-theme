#!/bin/sh
set -e

# This script deploys the Keycloak theme JAR file to a Maven repository.
THEME_NAME=$(grep '"name"' package.json | head -1 | sed 's/.*: "\(.*\)",*/\1/')
REPO_URL=$(grep '"registry"' package.json | head -1 | sed 's/.*: "\(.*\)".*/\1/')
JAR_FILE="dist_keycloak/$THEME_NAME.jar"

echo "Deploying Keycloak theme JAR file: $JAR_FILE to repository: $REPO_URL"
# Build the Keycloak theme using yarn
yarn run build-keycloak-theme

# Ensure that the JAR file exists before attempting to deploy
if [ ! -f $JAR_FILE ]; then
    echo "Error: JAR file not found. Please build the project first."
    exit 1
fi

# Deploy the JAR file to the specified Maven repository

./mvnw -B --quiet deploy:deploy-file \
    -DrepositoryId=github \
    -Durl=$REPO_URL \
    -Dfile=$JAR_FILE
