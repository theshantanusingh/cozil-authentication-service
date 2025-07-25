#Base image
FROM node:18-alpine

LABEL author="Shantanu Singh <distributedservices.shan@gmail.com>"

LABEL maintainer="Shantanu Singh <distributedservices.shan@gmail.com>" \
      version="0.0.1" \
      description="This image contains the backend auth service for cozil."

# Set working directory
WORKDIR /app

# Coping package.json
COPY package.json ./
# Copying package-lock.json
COPY package-lock.json ./

# Install dependencies
RUN npm install 

#Copying app code
COPY . .

# Exposeing the port the app runs on
EXPOSE 8080

ENV NODE_ENV=development

# Running the app
CMD ["npm" , "start"]