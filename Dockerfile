FROM node:14.15.0-buster

COPY ./package.json ./
RUN npm install

COPY . ./

CMD ["node", "server.js"]
