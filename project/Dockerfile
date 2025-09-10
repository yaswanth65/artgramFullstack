# Multi-stage build for React + Node.js application
FROM node:18-alpine as frontend-build

# Set working directory for frontend build
WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY postcss.config.js ./
COPY tailwind.config.js ./

# Install frontend dependencies (including devDependencies so Vite is available to build)
RUN npm ci

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend for production
# This creates a 'dist' folder with static files
RUN npm run build

# Backend stage
FROM node:18-alpine as backend-build

# Set working directory for backend
WORKDIR /app/server

# Copy backend package files
COPY server/package*.json ./
COPY server/tsconfig.json ./

# Install backend dependencies (including devDependencies so tsc is available to build)
RUN npm ci

# Copy backend source code
COPY server/src/ ./src/

# Build backend TypeScript to JavaScript
RUN npm run build

# Remove devDependencies from node_modules to keep the final image slim
RUN npm prune --production

# Production stage
FROM node:18-alpine as production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy backend built files and node_modules
COPY --from=backend-build /app/server/dist ./dist
COPY --from=backend-build /app/server/node_modules ./node_modules
COPY --from=backend-build /app/server/package*.json ./

# Copy frontend built files to be served statically
COPY --from=frontend-build /app/dist ./public

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port (Render prefers 10000, but we'll use PORT env var)
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000) + '/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.js"]
