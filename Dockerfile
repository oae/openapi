FROM node:8-alpine as dev

WORKDIR /app

# We need some packages in development
RUN apk add --update util-linux git python make bash g++

# copy source
COPY . /app

# install only production modules and separate it for later use
RUN yarn install --production --frozen-lockfile \
  && cp -r node_modules prod_node_modules/

# install all modules
RUN yarn install --frozen-lockfile

# starting point for production image
FROM node:8-alpine as prod

WORKDIR /app

# get source and all node_modules from dev stage
COPY --from=dev /app /app

# only use production modules
RUN rm -rf node_modules \
  && mv prod_node_modules node_modules

CMD ["yarn", "start"]
