# Stage 1: Build Angular app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy remaining source files
COPY . .

# Build the Angular app with production configuration
ENV NX_CLOUD_ACCESS_TOKEN=""
RUN npx nx build trackyourproject --configuration=production --skip-nx-cache

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from builder stage
COPY --from=builder /app/dist/trackyourproject/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
