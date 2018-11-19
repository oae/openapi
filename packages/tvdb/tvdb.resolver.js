const { resolveAlias } = require('@openapi/core/utils');
const client = require('./client');

const { name: pluginName } = require('./package.json');

const createSeriesSearchResolver = () => async (obj, { name, limit = 1 } = {}, context, info) => {
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

  const loaders = await context.getContext(pluginName);
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
};

const resolveEpisodes = hasOptions => async (obj, _, context) => {
  const loaders = await context.getContext(pluginName);
  const { episodeLoader } = loaders;
  if (!hasOptions) {
    return episodeLoader.load({
      seriesId: obj.id,
    });
  }

  return episodeLoader.load({
    seriesId: obj.seriesId,
    options: {
      airedSeason: obj.number,
    },
  });
};

const resolveSeasons = () => async (obj, { seasonNumber }, context) => {
  const loaders = await context.getContext(pluginName);
  const { seasonLoader } = loaders;
  return seasonLoader.load({
    seriesId: obj.id,
    options: {
      seasonNumber,
    },
  });
};

const resolveBanner = () => obj => `https://www.thetvdb.com/banners/${obj.banner}`;
const resolveArtWork = () => obj => `https://www.thetvdb.com/banners/${obj.filename}`;

module.exports = {
  Query: {
    series: createSeriesSearchResolver(),
  },

  Series: {
    airedAt: resolveAlias('firstAired'),
    name: resolveAlias('seriesName'),
    banner: resolveBanner(),
    episodes: resolveEpisodes(false),
    seasons: resolveSeasons(),
  },

  Episode: {
    airedAt: resolveAlias('firstAired'),
    artwork: resolveArtWork(),
    name: resolveAlias('episodeName'),
    relativeNumber: resolveAlias('airedEpisodeNumber'),
    season: resolveAlias('airedSeason'),
  },

  Season: {
    episodes: resolveEpisodes(true),
  },
};
