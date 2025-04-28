


FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production && \
    npm rebuild bcrypt --update-binary

# Copy application code
COPY . .

# Runtime environment variables will be injected by Kubernetes
# These are just for documentation purposes
ENV NODE_ENV=production
ENV PORT=6969

# Expose the server port
EXPOSE 6969

# Start the server (consider using "start" for production instead of "dev")
CMD ["npm", "run" , "dev"]