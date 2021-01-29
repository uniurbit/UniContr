FROM node:10

# Install global npm packages
RUN npm i -g @angular/cli

# Set working directory
WORKDIR /usr/src/app

# Copy and install local npm packages
COPY package.json* package-lock.json* ./
RUN npm install

ENV PATH=/usr/src/app/node_modules/.bin:$PATH

# Copy the remaining source code
#COPY . .
