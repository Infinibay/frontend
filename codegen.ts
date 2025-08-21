import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000/graphql",
  documents: ["src/gql/mutations.graphql", "src/gql/queries.graphql", "src/gql/queries/*.graphql"],
  ignoreNoDocuments: true,
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
        skipTypename: false,
        scalars: {
          DateTimeISO: "string",
          JSONObject: "{ [key: string]: any }"
        }
      }
    }
  }
};

export default config;
