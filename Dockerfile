# Use an official Node.js runtime as the base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Expose the port that Expo uses
EXPOSE 19000

EXPOSE 8081

# Start the Expo development server
CMD ["npx", "expo", "start", "--tunnel"]

