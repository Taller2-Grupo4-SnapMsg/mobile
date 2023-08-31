# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Install expo-cli globally
RUN npm install -g expo-cli

# Install @expo/ngrok as a dependency
RUN npm install @expo/ngrok@^4.1.0

# Copy the entire project directory to the container
COPY . .

# Start the app
CMD ["npx", "expo", "start", "--tunnel"]
