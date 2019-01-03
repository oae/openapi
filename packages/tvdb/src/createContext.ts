import * as DataLoader from 'dataloader';
import * as _ from 'lodash';

import client from './client';

interface ISeasonLoaderInput {
  seriesId?: number;
  options?: {
    seasonNumber?: number;
  };
}

const getEpisodesForSeries = async (seriesId, options = {}) =>
  client
    .get(`/series/${seriesId}/episodes/query`, {
      params: {
        page: 1,
        ...options,
      },
    })
    .then(result => result.data)
    .then(result => {
      const nextPage = result.links.next;
      if (!nextPage) {
        return result.data;
      }

      const next = _.parseInt(nextPage);
      const last = _.parseInt(result.links.last);

      return Promise.all(
        _.range(next, last + 1).map(page =>
          client
            .get(`/series/${seriesId}/episodes/query`, {
              params: {
                page,
                ...options,
              },
            })
            .then(res => res.data.data)
        )
      ).then(data => [...result.data, ..._.flatten(data)]);
    });

const loadSeries = async seriesIds =>
  seriesIds.map(seriesId => client.get(`/series/${seriesId}`).then(res => res.data.data));

const loadEpisode = async seriesIds =>
  seriesIds.map(({ seriesId, options }) => getEpisodesForSeries(seriesId, options));

const loadSeason = async (seriesIds: ISeasonLoaderInput[]) =>
  seriesIds.map(({ seriesId, options = {} }) =>
    client.get(`/series/${seriesId}/episodes/summary`).then(res =>
      _.map(res.data.data.airedSeasons, season => ({
        number: _.parseInt(season),
        seriesId,
      })).filter(season => season.number === options.seasonNumber)
    )
  );

export default async function createContext() {
  return {
    seriesLoader: new DataLoader(loadSeries),
    episodeLoader: new DataLoader(loadEpisode),
    seasonLoader: new DataLoader(loadSeason),
  };
}
