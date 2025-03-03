# Base image
FROM node:22

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Use entrypoint script to determine the command to run based on the environment
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]