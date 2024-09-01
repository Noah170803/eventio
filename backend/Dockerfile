# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose port
EXPOSE 8080

# Command to run the application
CMD ["npm", "start"]
