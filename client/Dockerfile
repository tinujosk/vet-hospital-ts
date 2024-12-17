# Use a Node.js base image
FROM node:18 AS build

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

# Build the React app for production
RUN npm run build

# Use a lightweight web server to serve the static files
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for the container
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
