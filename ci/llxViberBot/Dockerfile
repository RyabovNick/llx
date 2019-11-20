FROM node:12-alpine

RUN apk update && apk add tzdata &&\
  cp /usr/share/zoneinfo/Europe/Moscow /etc/localtime &&\
  echo "Europe/Moscow" > /etc/timezone &&\
  apk del tzdata && rm -rf /var/cache/apk/*

WORKDIR /app

COPY package*.json ./

RUN npm install --no-save --production

COPY . .

EXPOSE 8000

CMD ["npm", "run", "start"]