const resolvers = require('./omdb.resolver.js');
const contextCreator = require('./context');

const info = `{
    title
    year
    imdb {
      id
      rating
      votes
    }
    metacritic {
      rating
    }
    rottenTomatoes {
      rating
    }
    rated
    released
    runtime
    genre
    director
    writer
    actors
    plot
    language
    country
    awards
    poster
    boxOffice
    production
    website
  }`;

const createContext = (...contextArgs) => {
  let context = null;

  return {
    async getContext(name) {
      if (!context) {
        context = await contextCreator(...contextArgs);
      }

      return context;
    },
  };
};

describe('omdb', () => {
  it('should return movies with title', async () => {
    const context = createContext();

    const result = await resolvers.Query.movies(
      {},
      { title: 'Inception', limit: 5 },
      context,
      info
    );
    expect(result).toMatchSnapshot();
  });

  it('should return single movie', async () => {
    const context = createContext();

    const result = await resolvers.Query.movie({}, { imdbId: 'tt1375666' }, context, info);
    expect(result).toMatchSnapshot();
  });
});
