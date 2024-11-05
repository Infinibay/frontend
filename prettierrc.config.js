export default {
  sortingMethod: 'lineLength',
  tailwindFunctions: ['cn'],
  printWidth: 120,
  tabWidth: 2,
  trailingComma: 'all',
  singleQuote: true,
  semi: false,
  importOrder: ['react', '^(?!react)\\w+$', '@radix-ui/(.*)', '<THIRD_PARTY_MODULES>', '~/(.*)', '^[./]'],
  importOrderSeparation: false,
  // plugins: [myPlugin],
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
}
