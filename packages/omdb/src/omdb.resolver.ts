import { utils } from '@openapi/core';
import * as fp from 'lodash/fp';

import { name as pluginName } from '../package.json';

import client from './client';
import { DEFAULT_LIMIT, PAGE_SIZE } from './constants';

const { resolveAlias } = utils;

const createMovieSearchResolver = () => async (
  obj,
  { title = null, limit = DEFAULT_LIMIT, skip = 0 } = {},
  context,
  info
) => {
  const { movieLoader } = await context.getContext(pluginName);

  const startPage = skip / PAGE_SIZE + 1;
  const lastPage = startPage + limit / PAGE_SIZE;

  const fetchPagesBetween = fp.flow(
    fp.range,
    fp.map(page =>
      client
        .get('', {
          params: {
            s: title,
            page,
          },
        })
        .then(res => res.data.Search)
    )
  );

  const pages = await Promise.all(fetchPagesBetween(startPage, lastPage));
  const imdbIds = fp.flow(
    fp.flatten,
    fp.take(limit),
    fp.map((movie: { imdbID?: string }) => movie.imdbID)
  )(pages);

  return movieLoader.loadMany(imdbIds);
};

const createMovieResolver = () => async (obj, { imdbId = null } = {}, context, info) => {
  const { movieLoader } = await context.getContext(pluginName);

  return movieLoader.load(imdbId);
};

const resolveSeperatedArray = (alias, seperator) =>
  fp.flow(
    resolveAlias(alias),
    fp.split(seperator),
    fp.map(fp.trim)
  );

const resolveImdb = () => (obj, { imdbId = null } = {}, context, info) => ({
  id: obj.imdbID,
  rating: obj.imdbRating,
  votes: obj.imdbVotes,
});

const resolveRating = source => (obj, { imdbId = null } = {}, context, info) => {
  const ratingSource = obj.Ratings.find(r => r.Source === source);

  return ratingSource
    ? {
        rating: ratingSource.Value,
      }
    : null;
};

export default {
  Query: {
    movies: createMovieSearchResolver(),
    movie: createMovieResolver(),
  },

  Movie: {
    title: resolveAlias('Title'),
    year: resolveAlias('Year'),
    rated: resolveAlias('Rated'),
    released: resolveAlias('Released'),
    runtime: resolveAlias('Runtime'),
    genre: resolveSeperatedArray('Genre', ','),
    director: resolveAlias('Director'),
    writer: resolveAlias('Writer'),
    actors: resolveSeperatedArray('Actors', ','),
    plot: resolveAlias('Plot'),
    language: resolveSeperatedArray('Language', ','),
    country: resolveSeperatedArray('Country', ','),
    awards: resolveAlias('Awards'),
    poster: resolveAlias('Poster'),
    boxOffice: resolveAlias('BoxOffice'),
    production: resolveAlias('Production'),
    website: resolveAlias('Website'),
    imdb: resolveImdb(),
    metacritic: resolveRating('Metacritic'),
    rottenTomatoes: resolveRating('Rotten Tomatoes'),
  },
};
