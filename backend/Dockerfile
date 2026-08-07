FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p /app/uploads

EXPOSE 5000

# Run migrations and start
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx src/server.ts"]
