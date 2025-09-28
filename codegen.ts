import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_ENDPOINT || process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "http://localhost:4000/graphql",
  documents: [
    "src/gql/mutations.graphql",
    "src/gql/queries.graphql",
    "src/gql/queries/**/*.graphql",
    "src/gql/mutations/**/*.graphql",
    "!src/gql/**/*.bak",
    "!src/gql/**/*.tmp"
  ],
  ignoreNoDocuments: true,
  errorsOnly: false,
  verbose: true,
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
        fragmentMasking: false
      }
    },
    "src/gql/hooks.ts": {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        withMutationFn: true,
        withRefetchFn: true,
        withResultType: true,
        withMutationOptionsType: true,
        withSubscriptions: true,
        avoidOptionals: true,
        skipTypename: false,
        dedupeOperationSuffix: true,
        omitOperationSuffix: false,
        maybeValue: "T | null",
        scalars: {
          DateTimeISO: "string",
          JSONObject: "{ [key: string]: any }",
          Upload: "File"
        },
        apolloReactHooksImportFrom: "@apollo/client",
        apolloReactCommonImportFrom: "@apollo/client"
      }
    }
  },
  config: {
    validate: true,
    errorOnDeprecatedFields: true
  }
};

export default config;
