module.exports = {
  Query: {
    series: (obj, { query = 'Series' } = {}, context, info) =>
      Array.from({ length: 10 }).map((_, index) => ({
        name: `${query} #${index + 1}`,
      })),
  },
};
