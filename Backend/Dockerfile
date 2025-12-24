# Backend Dockerfile
# Use Debian-based image to avoid Alpine DNS/CA issues when connecting to Atlas
FROM node:18-bullseye-slim

WORKDIR /app

# Install system deps (ca-certificates for TLS, curl for healthchecks)
RUN apt-get update && apt-get install -y --no-install-recommends \
		ca-certificates \
		curl \
	&& rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production

# Copy source code
COPY . .

# Make entrypoint executable
RUN chmod +x /app/docker-entrypoint.sh

# Expose port
EXPOSE 5000

# Use custom entrypoint
ENTRYPOINT ["/app/docker-entrypoint.sh"]
