# Open API GraphQL

- This project is under heavy development. 
- Things may or may not work. 
- There might be some things that aren't even implemented yet. 
- Things may be added/deleted in the future.

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
