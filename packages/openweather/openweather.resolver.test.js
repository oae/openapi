const { request } = require('graphql-request');
const { gql } = require('@openapi/core/utils');
const { createServer, destroyServer } = require('@openapi/core/testUtils');

const { name: pluginName } = require('./package.json');

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

const validWeather = {
  geoloc: {
    longitude: 28.95,
    latitude: 41.01,
  },
  condition: {
    name: expect.not.toBeEmpty(),
    description: expect.not.toBeEmpty(),
  },
  temperature: expect.toBeNumber(),
  pressure: expect.not.toBeEmpty(),
  humidity: expect.not.toBeEmpty(),
  wind: {
    speed: expect.toBeNumber(),
    degree: expect.toBeNumber(),
  },
  cityName: 'Istanbul',
  estimatedTime: expect.toBeNumber(),
};

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

    const result = await request(server.endpoint, query);
    expect(result.currentWeatherByCityName).toEqual(validWeather);
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

    const result = await request(server.endpoint, query);
    expect(result.currentWeatherByGeoLoc).toEqual(validWeather);
  });
});
