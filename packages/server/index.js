const { server } = require('@openapi/core');

(async () => {
  await server.start({
    providers: [
      '@openapi/plugin-common',
      '@openapi/plugin-omdb',
      '@openapi/plugin-openlibrary',
      '@openapi/plugin-openweather',
      '@openapi/plugin-tvdb',
    ],
  });
})();
