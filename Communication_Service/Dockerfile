FROM node:14

RUN mkdir /app
WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY . /app

#EXPOSE 7003 7004

CMD [ "npm", "start" ]