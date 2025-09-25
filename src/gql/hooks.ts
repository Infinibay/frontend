import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';

// Basic types
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type Maybe<T> = T | null;
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTimeISO: string;
  JSONObject: { [key: string]: any };
};

// Current User Query
export type CurrentUserQueryVariables = Exact<{ [key: string]: never; }>;

export type CurrentUserQuery = { __typename?: 'Query', currentUser?: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar?: string | null, createdAt: string, namespace?: string | null } | null };

export const CurrentUserDocument = gql`
    query currentUser {
  currentUser {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
    namespace
  }
}
    `;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
        const options = {...baseOptions}
        return Apollo.useQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
      }
export function useCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = {...baseOptions}
          return Apollo.useLazyQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export function useCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<CurrentUserQuery, CurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...baseOptions}
          return Apollo.useSuspenseQuery<CurrentUserQuery, CurrentUserQueryVariables>(CurrentUserDocument, options);
        }
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<CurrentUserQuery, CurrentUserQueryVariables>;
export function refetchCurrentUserQuery(variables?: CurrentUserQueryVariables) {
      return { query: CurrentUserDocument, variables: variables }
    }

// Users Query
export type UsersQueryVariables = Exact<{
  pagination?: Maybe<PaginationInputType>;
  orderBy?: Maybe<UserOrderByInputType>;
}>;

export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar?: string | null, createdAt: string }> };

export const UsersDocument = gql`
    query users($pagination: PaginationInputType, $orderBy: UserOrderByInputType) {
  users(pagination: $pagination, orderBy: $orderBy) {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
  }
}
    `;

// Create User Mutation
export type CreateUserMutationVariables = Exact<{
  input: CreateUserInputType;
}>;

export type CreateUserMutation = { __typename?: 'Mutation', createUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar?: string | null, createdAt: string } };

export const CreateUserDocument = gql`
    mutation createUser($input: CreateUserInputType!) {
  createUser(input: $input) {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
  }
}
    `;

// Update User Mutation
export type UpdateUserMutationVariables = Exact<{
  input: UpdateUserInputType;
  id: Scalars['String'];
}>;

export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'UserType', id: string, firstName: string, lastName: string, role: string, email: string, avatar?: string | null, createdAt: string } };

export const UpdateUserDocument = gql`
    mutation updateUser($input: UpdateUserInputType!, $id: String!) {
  updateUser(input: $input, id: $id) {
    id
    firstName
    lastName
    role
    email
    avatar
    createdAt
  }
}
    `;

// Additional type definitions needed by the queries
export type PaginationInputType = {
  take?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};

export type UserOrderByInputType = {
  fieldName?: Maybe<UserOrderByField>;
  direction?: Maybe<OrderByDirection>;
};

export type CreateUserInputType = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
  passwordConfirmation: Scalars['String'];
  role: UserRole;
};

export type UpdateUserInputType = {
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  passwordConfirmation?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
  avatar?: Maybe<Scalars['String']>;
};

export enum UserOrderByField {
  Id = 'id',
  Email = 'email',
  FirstName = 'firstName',
  LastName = 'lastName',
  Role = 'role',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt'
}

export enum OrderByDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export enum UserRole {
  User = 'USER',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN'
}