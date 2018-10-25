const { resolveAlias } = require('../../utils');

const client = require('./client');

const createWeatherByCityIdResolver = () => async (obj, { cityName } = {}, context, info) => {
  const res = await client.get('', {
    params: {
      q: cityName,
    },
  });

  return res.data;
};

const createWeatherByGeoLocResolver = () => async (obj, { lat, lon } = {}, context, info) => {
  const res = await client.get('', {
    params: {
      lat,
      lon,
    },
  });

  return res.data;
};

const resolveGeoLocation = () => (obj, cityName = {}, context, info) => ({
  latitude: obj.coord.lat,
  longitude: obj.coord.lon,
});

const resolveWind = () => (obj, cityName = {}, context, info) => ({
  speed: obj.wind.speed,
  degree: obj.wind.deg,
});

const resolveWeatherCondition = () => (obj, cityName = {}, context, info) => ({
  name: obj.weather[0].main,
  description: obj.weather[0].description,
});

module.exports = {
  Query: {
    currentWeatherByCityName: createWeatherByCityIdResolver(),
    currentWeatherByGeoLoc: createWeatherByGeoLocResolver(),
  },
  Weather: {
    temperature: resolveAlias('main.temp'),
    pressure: resolveAlias('main.pressure'),
    humidity: resolveAlias('main.humidity'),
    cityName: resolveAlias('name'),
    estimatedTime: resolveAlias('dt'),
    geoloc: resolveGeoLocation(),
    condition: resolveWeatherCondition(),
    wind: resolveWind(),
  },
};
