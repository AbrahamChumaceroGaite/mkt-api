FROM node:lts

# Create app directory
WORKDIR /app/

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install pm2 globally
RUN npm install pm2 -g

# Copy the rest of the application code
COPY . .

# Ensure the Prisma schema is copied
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Use pm2-runtime to start the app
CMD ["pm2-runtime", "app.js"]
