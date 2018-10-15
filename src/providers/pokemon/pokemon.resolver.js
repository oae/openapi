module.exports = {
  Query: {
    pokemons: () =>
      Array.from({ length: 10 }).map((_, index) => ({
        name: `Pokemon #${index}`,
      })),
  },
};
