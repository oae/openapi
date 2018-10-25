const client = require('./client');

module.exports = {
  Query: {
    series: async (obj, { name, limit = 1 } = {}, context, info) => {
      let res = [];
      try {
        res = await client.get('/search/series', {
          params: {
            name,
          },
        });
      } catch (e) {
        return res;
      }

      const loaders = await context.getContext('tvdb/tvdb');
      const { seriesLoader } = loaders;

      return Promise.all(
        res.data.data
          .filter(series => series.slug !== '403-series-not-permitted')
          .slice(0, limit)
          .map(async series => {
            const currentSeries = await seriesLoader.load(series.id);

            return {
              ...series,
              ...currentSeries,
            };
          })
      );
    },
  },

  Series: {
    airedAt: obj => obj.firstAired,
    name: obj => obj.seriesName,
    banner: obj => `https://www.thetvdb.com/banners/${obj.banner}`,
    episodes: async (obj, _, context) => {
      const loaders = await context.getContext('tvdb/tvdb');
      const { episodeLoader } = loaders;
      return episodeLoader.load({
        seriesId: obj.id,
      });
    },
    seasons: async (obj, { seasonNumber }, context) => {
      const loaders = await context.getContext('tvdb/tvdb');
      const { seasonLoader } = loaders;
      return seasonLoader.load({
        seriesId: obj.id,
        options: {
          seasonNumber,
        },
      });
    },
  },

  Episode: {
    airedAt: obj => obj.firstAired,
    artwork: obj => `https://www.thetvdb.com/banners/${obj.filename}`,
    name: obj => obj.episodeName,
    relativeNumber: obj => obj.airedEpisodeNumber,
    season: obj => obj.airedSeason,
  },

  Season: {
    episodes: async (obj, _, context, info) => {
      const loaders = await context.getContext('tvdb/tvdb');
      const { episodeLoader } = loaders;
      return episodeLoader.load({
        seriesId: obj.seriesId,
        options: {
          airedSeason: obj.number,
        },
      });
    },
  },
};
