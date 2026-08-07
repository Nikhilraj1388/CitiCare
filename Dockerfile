FROM node:22-alpine AS base

# Backend build
FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ .
RUN npx prisma generate
RUN npx tsc --noEmit

# Frontend build
FROM base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci

FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ENV NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
RUN npm run build

# Backend production
FROM base AS backend
WORKDIR /app
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/ .
RUN npx prisma generate
RUN mkdir -p /app/uploads
EXPOSE 5000
CMD ["npx", "tsx", "src/server.ts"]

# Frontend production
FROM base AS frontend
WORKDIR /app
COPY --from=frontend-build /app/frontend/.next ./.next
COPY --from=frontend-build /app/frontend/public ./public
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY frontend/package.json ./
EXPOSE 3000
CMD ["npm", "start"]
