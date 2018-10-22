const env = Object.keys(process.env)
  .filter(key => /^OA_.*$/.test(key))
  .reduce(
    (acc, key) => ({
      ...acc,
      [key.replace('OA_', '')]: process.env[key],
    }),
    {}
  );

module.exports = env;
