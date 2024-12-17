# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Accept build argument for API_URL
ARG EC2_INSTANCE_IP

# Optional: Print the value of EC2_INSTANCE_IP to verify
RUN echo "EC2_INSTANCE_IP is set to: $EC2_INSTANCE_IP"

# Set environment variable in the container
ENV REACT_APP_SERVER_IP=$EC2_INSTANCE_IP

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the app files
COPY . .

# Expose the backend port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
