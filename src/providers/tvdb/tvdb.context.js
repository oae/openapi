const DataLoader = require('dataloader');

const client = require('./client');

const loadSeries = async seriesIds =>
  Promise.all(
    seriesIds.map(seriesId => client.get(`/series/${seriesId}`).then(res => res.data.data))
  );

const loadEpisode = async seriesIds =>
  Promise.all(
    seriesIds.map(seriesId => client.get(`/series/${seriesId}/episodes`).then(res => res.data.data))
  );
const loadSeason = () => {};

module.exports = async function createContext() {
  return {
    seriesLoader: new DataLoader(loadSeries),
    episodeLoader: new DataLoader(loadEpisode),
    seasonLoader: new DataLoader(loadSeason),
  };
};
