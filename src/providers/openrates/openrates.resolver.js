const { resolveAlias } = require('../../utils');

const client = require('./client');

const createLatestRatesResolver = () => async (obj, { from, to } = {}, context, info) => {
  const res = await client.get('latest', {
    params: {
      base: from,
    },
  });
  return { ...res.data, to };
};

const resolveRates = () => (obj, { temp } = {}, context, info) => {
  const { to, rates } = obj;
  return to.reduce((acc, val) => {
    acc.push({ to: val, rate: rates[val] });
    return acc;
  }, []);
};

module.exports = {
  Query: {
    latestRates: createLatestRatesResolver(),
  },

  Rate: {
    from: resolveAlias('base'),
    date: resolveAlias('date'),
    rates: resolveRates(),
  },
};
