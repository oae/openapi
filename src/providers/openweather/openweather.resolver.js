const fp = require('lodash/fp');
const client = require('./client');

const createWeatherByCityIdResolver = () => async (obj, { cityName } = {}, context, info) => {
  let res = [];
  try {
    res = await client.get('/', {
      params: {
        q: cityName,
      },
    });
  } catch (e) {
    return res;
  }

  return res.data;
};

const resolveAlias = key => (obj, args, context, info) => fp.get(key, obj);

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
