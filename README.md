# Open API GraphQL
[![Build Status](https://travis-ci.com/openapi/openapi.svg?branch=master)](https://travis-ci.com/openapi/openapi)

## :computer: Development

### Requirements:
- yarn
- docker
- docker-compose

Clone the repository:
```sh
git clone git@github.com:openapi/openapi.git
```

Copy `.env.example`:
```sh
cp .env.example .env
```

Fill the `.env` with api keys you obtained from relevant plugins

Start `api` and all of it's dependencies in development mode:
```
yarn dev
```

## :rocket: Deployment

Clone the repository:
```sh
git clone git@github.com:openapi/openapi.git
```

Copy `.env.example`:
```sh
cp .env.example .env
```

Fill the `.env` with api keys you obtained from relevant plugins

Start the project in background
```
docker-compose up --build -d
```
