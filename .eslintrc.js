module.exports = {
  plugins: ['prettier'],
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parser: 'babel-eslint',
  env: {
    node: true,
  },
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'prettier/prettier': ['error', { trailingComma: 'es5', singleQuote: true }],
  },
};
