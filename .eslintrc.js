module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  env: {
    node: true,
  },
  rules: {
    'prettier/prettier': ['error', { trailingComma: 'es5', singleQuote: true }],
  },
};
