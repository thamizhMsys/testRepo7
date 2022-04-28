FROM node:14.18.0-alpine3.14
WORKDIR /usr/local/src
COPY package*.json ./
COPY . .
RUN npm install
EXPOSE 9000
CMD ["npm", "start"]
