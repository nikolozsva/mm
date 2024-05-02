# Use proper node version
FROM node

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install --production
COPY . .
RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD [ "serve", "-s", "build" ]