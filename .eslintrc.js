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
    'no-unused-vars': ['error', { args: 'none' }],
    'prettier/prettier': ['error', { trailingComma: 'es5', singleQuote: true }],
  },
};
