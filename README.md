# Open API GraphQL

## Development

### Requirements:
- yarn
- docker
- docker-compose
- If you want to work on tvdb provider you'll need to obtain your `API_KEY` from `https://www.thetvdb.com/` and add following to `.secrets.env` file

    ```
    OA_TVDB_API_KEY=your-api-key
    ```

You can start a development server with following:
```
yarn dev
```
