FROM nodesource/trusty:4.2.0

COPY ./package.json ./
RUN npm install

COPY . ./

CMD ["node", "server.js"]
