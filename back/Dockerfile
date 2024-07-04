FROM node:14-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY init_db.sql /app/init_db.sql

EXPOSE 3000

CMD ["node", "server.js"]
