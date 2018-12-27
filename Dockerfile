FROM node:10-alpine as dev

WORKDIR /app

# We need some packages in development
RUN apk add --update util-linux git python make bash g++

# copy source
COPY . /app

RUN npm i -g yarn

# install only production modules and separate it for later use
RUN yarn install --production --frozen-lockfile \
  && cp -r node_modules /prod_node_modules/

# install all modules
RUN yarn install --frozen-lockfile

# starting point for builder image
FROM node:10-alpine as builder

WORKDIR /app

# get source and all node_modules from dev stage
COPY --from=dev /app /app

RUN yarn build

# starting point for production image
FROM node:10-alpine as prod

WORKDIR /app

# get source and all node_modules from dev stage
COPY --from=builder /app /app
COPY --from=dev /prod_node_modules /prod_node_modules

# only use production modules
RUN rm -rf node_modules \
  && mv /prod_node_modules /app/node_modules

CMD ["yarn", "start"]
