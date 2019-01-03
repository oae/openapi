import { createServer, destroyServer } from '@openapi/core/testUtils';
import { gql } from '@openapi/core/utils';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';
import { Query } from './generated/graphql.js';

let server = null;

beforeAll(async () => {
  server = await createServer([
    [
      pluginName,
      {
        auth: {
          appId: process.env.OA_OPENWEATHER_API_KEY,
        },
      },
    ],
  ]);
});

afterAll(async () => {
  await destroyServer(server);
});

const weatherFields = gql`
  fragment weatherFields on Weather {
    geoloc {
      longitude
      latitude
    }
    condition {
      name
      description
    }
    temperature
    pressure
    humidity
    wind {
      speed
      degree
    }
    cityName
    estimatedTime
  }
`;

function testValidWeather(weather) {
  expect(weather).toMatchObject({
    geoloc: {
      longitude: 28.95,
      latitude: 41.01,
    },
    cityName: 'Istanbul',
  });

  expect(weather.condition.name).not.toBeEmpty();
  expect(weather.condition.description).not.toBeEmpty();
  expect(weather.temperature).toBeNumber();
  expect(weather.pressure).not.toBeEmpty();
  expect(weather.humidity).not.toBeEmpty();
  expect(weather.wind.speed).toBeNumber();
  expect(weather.wind.degree).toBeNumber();
  expect(weather.estimatedTime).toBeNumber();
}

describe('openweather', () => {
  it('should return current weather for a given cityName', async () => {
    const query = gql`
      ${weatherFields}
      {
        currentWeatherByCityName(cityName: "Istanbul") {
          ...weatherFields
        }
      }
    `;

    const result: Query = await request(server.endpoint, query);
    testValidWeather(result.currentWeatherByCityName);
  });

  it('should return current weather for a given location', async () => {
    const query = gql`
      ${weatherFields}
      {
        currentWeatherByGeoLoc(lat: 41.01, lng: 28.95) {
          ...weatherFields
        }
      }
    `;

    const result: Query = await request(server.endpoint, query);
    testValidWeather(result.currentWeatherByGeoLoc);
  });
});
