const moment = require('moment');
const { resolveAlias } = require('../../utils');

const client = require('./client');

const resolveDate = date => moment(date).format('YYYY-MM-DD');

const createLatestRatesResolver = () => async (obj, { from, to, date } = {}, context, info) => {
  if (date) {
    const resolvedDate = resolveDate(date);
    const res = await client.get(resolvedDate, { params: { base: from } });
    return { ...res.data, to };
  }

  const res = await client.get('latest', {
    params: {
      base: from,
    },
  });
  return { ...res.data, to };
};

const resolveRates = () => (obj, _, context, info) => {
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
