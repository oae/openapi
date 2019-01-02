import * as DataLoader from 'dataloader';

import client from './client';

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

export default async function createContext() {
  return {
    movieLoader: new DataLoader(loadMovies),
  };
}
