FROM node:14-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app

EXPOSE 7001
CMD [ "npm", "start" ]