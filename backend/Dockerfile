# Use lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --production

# Copy rest of the code
COPY . .

# Expose port (optional, e.g., 5000)
EXPOSE 5000

# Run the app
CMD ["node", "server.js"]
