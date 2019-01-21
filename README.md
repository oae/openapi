# Open API GraphQL [![Build Status](https://travis-ci.com/openapi/openapi.svg?branch=master)](https://travis-ci.com/openapi/openapi)

[![](https://sourcerer.io/fame/oae/openapi/openapi/images/0)](https://sourcerer.io/fame/oae/openapi/openapi/links/0)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/1)](https://sourcerer.io/fame/oae/openapi/openapi/links/1)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/2)](https://sourcerer.io/fame/oae/openapi/openapi/links/2)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/3)](https://sourcerer.io/fame/oae/openapi/openapi/links/3)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/4)](https://sourcerer.io/fame/oae/openapi/openapi/links/4)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/5)](https://sourcerer.io/fame/oae/openapi/openapi/links/5)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/6)](https://sourcerer.io/fame/oae/openapi/openapi/links/6)[![](https://sourcerer.io/fame/oae/openapi/openapi/images/7)](https://sourcerer.io/fame/oae/openapi/openapi/links/7)

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
