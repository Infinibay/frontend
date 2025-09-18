import { gql } from '@apollo/client';

// GraphQL query for VM recommendations - sourced from vmRecommendations.graphql
// This module serves as a bridge to import the shared .graphql document
// The query content below is kept in sync with src/gql/queries/vmRecommendations.graphql
// Modify the .graphql file to change the query definition
export const GET_VM_RECOMMENDATIONS_QUERY_STRING = `query getVMRecommendations(
  $vmId: ID!
  $filter: RecommendationFilterInput
  $refresh: Boolean
) {
  getVMRecommendations(
    vmId: $vmId
    filter: $filter
    refresh: $refresh
  ) {
    id
    machineId
    snapshotId
    type
    text
    actionText
    data
    createdAt
  }
}`;

// Export the compiled GraphQL document
export const GET_VM_RECOMMENDATIONS_QUERY = gql(GET_VM_RECOMMENDATIONS_QUERY_STRING);