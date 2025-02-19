import { ApolloError } from '@apollo/client';

export class GraphQLAdapter {
  static async executeQuery(hook, variables = {}) {
    try {
      const { data, error } = await hook({ variables });

      if (error) {
        throw error;
      }

      // Check for GraphQL errors in the response
      if (data?.errors) {
        const errorMessage = data.errors.map(err => err.message).join(', ');
        throw new ApolloError({ graphQLErrors: data.errors });
      }

      return data;
    } catch (error) {
      console.error('GraphQL query error:', error);
      throw error;
    }
  }

  static async executeMutation(hook, variables = {}) {
    try {
      const { data, errors } = await hook({ variables });

      if (errors) {
        throw new ApolloError({ graphQLErrors: errors });
      }

      // Check for errors in the data response
      const firstKey = Object.keys(data || {})[0];
      if (data?.[firstKey]?.errors) {
        const errorMessage = data[firstKey].errors.map(err => err.message).join(', ');
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('GraphQL mutation error:', error);
      throw error;
    }
  }
}