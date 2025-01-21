FROM node:20-alpine AS builder

WORKDIR /app
# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application source code
COPY . .

RUN npm run build

# RUN npm run deploy:mongodb

RUN rm -rf ./dist/scripts

RUN npm prune --production


FROM gcr.io/distroless/nodejs20-debian12 AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV=production

# Copy only the necessary files from builder
# COPY --from=builder /app/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/dist/src ./
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules
# Expose the port on which the app will run
EXPOSE 8080

# Define the command to start your app
CMD ["index.js"]