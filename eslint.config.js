const coreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...coreWebVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'src/gql/**', 'harbor/**'],
  },
];
