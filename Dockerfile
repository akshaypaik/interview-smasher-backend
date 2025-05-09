# Stage 1: Build
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the source code and configuration files
COPY src/ src/
COPY tsconfig.json tsconfig.json

# Build the application
RUN npm run build

# Stage 2: Run
FROM node:18 AS runner

# Set the working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules/
COPY --from=builder /app/dist ./dist/
COPY .env .env

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]