# Use the official Node.js image as base
FROM node:20 AS frontend-builder

# Set the working directory
WORKDIR /app/ProductivityKeeperClient

# Copy package.json and package-lock.json files
COPY ./package.json ProductivityKeeperClient/package-lock.json ./
# Install dependencies
RUN npm install --force
# Copy the rest of the frontend files
COPY . .
# Build the frontend application
RUN npm run build --production

# Production environment
FROM nginx:alpine
COPY --from=frontend-builder /app/ProductivityKeeperClient/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
