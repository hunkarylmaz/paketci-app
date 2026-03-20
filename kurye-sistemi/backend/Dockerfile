# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install PostgreSQL client for wait script
RUN apk add --no-cache postgresql-client

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Create startup script
RUN echo '#!/bin/sh\n\
echo "Waiting for PostgreSQL..."\n\
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do\n\
  sleep 1\n\
done\n\
echo "PostgreSQL is ready!"\n\
npm run start:prod' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 4000

CMD ["/app/start.sh"]
