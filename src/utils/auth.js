import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// GraphQL API endpoint (use environment variable)
const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || 'http://localhost:4000/graphql';

// Create Apollo Client instance
const httpLink = createHttpLink({
  uri: API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token || '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// Login mutation
const LOGIN_QUERY = gql`
  query Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

// Authentication functions
export const auth = {
  login: async (email, password) => {
    try {
      const { data } = await client.query({
        query: LOGIN_QUERY,
        variables: { email, password },
      });

      if (data.login && data.login.token) {
        localStorage.setItem('token', data.login.token);
        return true;
      }
      throw new Error('401'); // Unauthorized
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('401') || error.message.includes('403')) {
        throw error; // Re-throw authentication errors
      }
      throw new Error('An unexpected error occurred');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isLoggedIn: () => {
    return !!localStorage.getItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  // Optionally, add a method to check if the token is still valid
  validateToken: async () => {
    const token = auth.getToken();
    if (!token) return false;

    // Here you would typically make a request to your server to validate the token
    // For this example, we'll just check if it exists
    return true;
  }
};

export default auth;
