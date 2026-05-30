import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/gql/schema.graphql",
  documents: [
    "src/gql/mutations.graphql",
    "src/gql/queries.graphql",
    "src/gql/automations.graphql",
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
        // Apollo Client 4 removed the `MutationFunction` and
        // `BaseMutationOptions` type exports these flags relied on. The
        // generated `*MutationFn` / `*MutationOptions` aliases are unused by
        // app code (only the `useXMutation` hooks are), so disable them.
        withMutationFn: false,
        withRefetchFn: true,
        withResultType: true,
        withMutationOptionsType: false,
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
        apolloReactHooksImportFrom: "@apollo/client/react",
        apolloReactCommonImportFrom: "@apollo/client/react"
      }
    }
  },
  config: {
    validate: true,
    errorOnDeprecatedFields: true
  }
};

export default config;
