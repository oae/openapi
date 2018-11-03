module.exports = {
  plugins: ['jest', 'prettier'],
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'babel-eslint',
  env: {
    node: true,
  },
  rules: {
    'global-require': 'off',
    'import/no-dynamic-require': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.js', '**/*.spec.js', 'config/**/*.js'] },
    ],
    'prettier/prettier': [
      'error',
      { trailingComma: 'es5', singleQuote: true, printWidth: 100 },
    ],
  },
};
