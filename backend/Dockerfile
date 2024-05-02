FROM --platform=linux/amd64 node:18-slim

WORKDIR /eapp

COPY . ./

RUN npm install --only=production

CMD [ "node", "src/server.js" ]