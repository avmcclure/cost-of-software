# Use official Node.js image
FROM node:24-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build Gatsby site
RUN npm run build

# --- Production Image ---
FROM nginx:alpine

# Copy built site to Nginx html folder
COPY --from=build /app/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]