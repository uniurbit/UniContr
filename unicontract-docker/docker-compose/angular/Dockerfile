FROM node:18.20.8

# Install global npm packages
RUN npm install -g @angular/cli@19

# Set working directory
WORKDIR /usr/src/app

# Copy and install local npm packages
#COPY package.json* package-lock.json* ./
#RUN npm install

#ENV PATH=/usr/src/app/node_modules/.bin:$PATH

# Copy the remaining source code
#COPY . .
