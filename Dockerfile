FROM node:8-alpine

WORKDIR /app

COPY . /app

RUN yarn install

CMD ["yarn", "start"]
