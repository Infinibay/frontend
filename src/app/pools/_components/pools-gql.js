import { gql } from '@apollo/client';

// ---------------------------------------------------------------------------
// GraphQL documents shared by the pools list page and its sub-components.
// Extracted verbatim from the page so the operations live in one place.
// ---------------------------------------------------------------------------

export const POOL_FIELDS = gql`
  fragment PoolFields on Pool {
    id
    name
    templateId
    goldenImageId
    departmentId
    type
    sizeMin
    sizeMax
    idleTimeoutMinutes
    resetOnLogoff
    draining
    currentSize
    createdAt
    updatedAt
  }
`;

export const POOLS_QUERY = gql`
  query Pools { pools { ...PoolFields } }
  ${POOL_FIELDS}
`;

export const CREATE_POOL = gql`
  mutation CreatePool($input: CreatePoolInput!) {
    createPool(input: $input) { success error pool { ...PoolFields } }
  }
  ${POOL_FIELDS}
`;

export const SCALE_POOL = gql`
  mutation ScalePool($id: ID!, $targetSize: Int!) {
    scalePool(id: $id, targetSize: $targetSize) { success error pool { ...PoolFields } }
  }
  ${POOL_FIELDS}
`;

export const DRAIN_POOL = gql`
  mutation DrainPool($id: ID!) { drainPool(id: $id) { success error pool { ...PoolFields } } }
  ${POOL_FIELDS}
`;

export const UNDRAIN_POOL = gql`
  mutation UndrainPool($id: ID!) { undrainPool(id: $id) { success error pool { ...PoolFields } } }
  ${POOL_FIELDS}
`;

export const DELETE_POOL = gql`
  mutation DeletePool($id: ID!) { deletePool(id: $id) }
`;

export const GOLDEN_IMAGES_FOR_POOLS = gql`
  query GoldenImagesForPools {
    goldenImages { id name osType status version }
  }
`;
