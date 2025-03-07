#!/bin/bash

# Exit on error
set -e

echo "Setting up Quote App..."

# Create project directory
mkdir -p quote-app
cd quote-app

# Initialize Vite project with React and TypeScript
echo "Creating Vite project with React and TypeScript..."
npm create vite@latest . -- --template react-ts

# Install dependencies
echo "Installing dependencies..."
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install axios js-cookie react-router-dom
npm install -D json-server concurrently @types/js-cookie

# Create .gitignore file
echo "Creating .gitignore file..."
npx gitignore node

# Create project structure
echo "Creating project structure..."
mkdir -p src/components src/contexts src/pages src/services src/types

# Copy all files
echo "Creating project files..."
# Files will be created manually after this script runs

echo "Setup complete! Run the following commands to start the application:"
echo "cd quote-app"
echo "npm run start"