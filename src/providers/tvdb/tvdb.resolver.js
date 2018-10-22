const client = require('./client');

module.exports = {
  Query: {
    series: async (obj, { name, limit = 10 } = {}, context, info) => {
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
        res.data.data.slice(0, limit).map(async series => {
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
      return episodeLoader.load(obj.id);
    },
  },

  Episode: {
    airedAt: obj => obj.firstAired,
    artwork: obj => `https://www.thetvdb.com/banners/${obj.filename}`,
    name: obj => obj.episodeName,
    relativeNumber: obj => obj.airedEpisodeNumber,
    season: obj => obj.airedSeason,
  },
};
