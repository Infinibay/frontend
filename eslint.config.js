const coreWebVitals = require('eslint-config-next/core-web-vitals');

module.exports = [
  ...coreWebVitals,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'warn',
      // Hard-fail on missing/incorrect hook dependencies so the lint gate
      // (npm run lint / lint-staged) actually blocks these bugs.
      'react-hooks/exhaustive-deps': 'error',
      'react-hooks/use-memo': 'error',
      // The remaining react-hooks v6 rules currently surface pre-existing
      // violations across the tree and stay disabled until those are triaged;
      // re-enable them one at a time as the violations are fixed.
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'src/gql/**', 'harbor/**'],
  },
];
