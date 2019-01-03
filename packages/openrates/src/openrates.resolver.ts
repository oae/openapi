import { resolveAlias } from '@openapi/core/utils';
import * as format from 'date-fns/format';

import client from './client';

const resolveDate = date => format(date, 'YYYY-MM-DD');

const createLatestRatesResolver = () => async (
  obj,
  { from = null, to = null, date = null } = {},
  context,
  info
) => {
  let res;

  if (date) {
    const resolvedDate = resolveDate(date);
    res = await client.get(resolvedDate, { params: { base: from } });
    return { ...res.data, to };
  }

  res = await client.get('latest', {
    params: {
      base: from,
    },
  });
  return { ...res.data, to };
};

const createCurrenciesResolver = () => async (obj, _, context, info) => {
  const res = await client.get('latest');
  return Object.keys(res.data.rates);
};

const resolveRates = () => (obj, _, context, info) => {
  const { to, rates } = obj;
  return to.reduce((acc, val) => {
    acc.push({ to: val, rate: rates[val] });
    return acc;
  }, []);
};

const resolveCurrencyNames = () => (name, _, context, info) => name;

export default {
  Query: {
    rates: createLatestRatesResolver(),
    currencies: createCurrenciesResolver(),
  },

  Rate: {
    from: resolveAlias('base'),
    date: resolveAlias('date'),
    rates: resolveRates(),
  },

  Currency: {
    name: resolveCurrencyNames(),
  },
};
