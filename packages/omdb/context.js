const DataLoader = require('dataloader');

const client = require('./client');

const loadMovies = imdbIds =>
  Promise.all(
    imdbIds.map(imdbId =>
      client
        .get('', {
          params: {
            i: imdbId,
          },
        })
        .then(res => res.data)
    )
  );

module.exports = async function createContext() {
  return {
    movieLoader: new DataLoader(loadMovies),
  };
};
