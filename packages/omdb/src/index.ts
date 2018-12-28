import { loadResolvers, loadTypeDefs } from '@openapi/core/utils';
import context from './context';

async function init() {
  return {
    typeDefs: await loadTypeDefs(__dirname, ['./omdb.type.graphql']),
    resolvers: await loadResolvers(__dirname, ['./omdb.resolver']),
    context,
  };
}

export default {
  init,
};
