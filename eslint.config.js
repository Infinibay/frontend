const coreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...coreWebVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'src/gql/**'],
  },
];
