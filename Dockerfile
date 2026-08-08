FROM node:20-alpine

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the files (including nest-cli.json for Swagger)
COPY . .

# Expose the application port
EXPOSE 3000

# Optional: Set environment variable to force NestJS to bind to 0.0.0.0
ENV HOST=0.0.0.0

CMD ["npm", "run", "start:dev"]
