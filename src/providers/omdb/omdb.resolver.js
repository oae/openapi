const fp = require('lodash/fp');

const { resolveAlias } = require('../../utils');
const client = require('./client');
const { DEFAULT_LIMIT } = require('./constants');

const PAGE_SIZE = 10;

const createMovieSearchResolver = () => async (
  obj,
  { title, limit = DEFAULT_LIMIT, skip = 0 } = {},
  context,
  info
) => {
  const { movieLoader } = await context.getContext('omdb');

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
    fp.map(movie => movie.imdbID)
  )(pages);

  return movieLoader.loadMany(imdbIds);
};

const createMovieResolver = () => async (obj, { imdbId } = {}, context, info) => {
  const {
    loaders: { movieLoader },
  } = await context.getContext('omdb');

  return movieLoader.load(imdbId);
};

const resolveSeperatedArray = (alias, seperator) =>
  fp.flow(
    resolveAlias(alias),
    fp.split(seperator),
    fp.map(fp.trim)
  );

const resolveImdb = () => (obj, { imdbId } = {}, context, info) => ({
  id: obj.imdbID,
  rating: obj.imdbRating,
  votes: obj.imdbVotes,
});

const resolveRating = source => (obj, { imdbId } = {}, context, info) => {
  const ratingSource = obj.Ratings.find(r => r.Source === source);

  return ratingSource
    ? {
        rating: ratingSource.Value,
      }
    : null;
};

module.exports = {
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
