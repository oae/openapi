import { gql, testUtils } from '@openapi/core';
import { request } from 'graphql-request';

import { name as pluginName } from '../package.json';

let server = null;

beforeAll(async () => {
  server = await testUtils.createServer([pluginName]);
});

afterAll(async () => {
  await testUtils.destroyServer(server);
});

describe('openrates', () => {
  it('should return rates for a given currency pair on a specific date', async () => {
    const query = gql`
      {
        rates(from: "USD", to: "TRY", date: "2018-11-02T00:00:00.000Z") {
          date
          from
          rates {
            to
            rate
          }
        }
      }
    `;

    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });

  it('should return all currencies', async () => {
    const query = gql`
      {
        currencies {
          name
        }
      }
    `;

    const result = await request(server.endpoint, query);
    expect(result).toMatchSnapshot();
  });
});
