import { gql } from '@apollo/client';

// ---------------------------------------------------------------------------
// GraphQL (inline — department-role + audit operations are admin-only and
// not part of codegen). Extracted verbatim from the policies page so the
// operations live in one place — no behaviour change.
// ---------------------------------------------------------------------------

export const DEPARTMENTS_Q = gql`
  query PolicyDepartments {
    departments { id name }
  }
`;

export const MEMBERS_Q = gql`
  query DepartmentMembers($departmentId: String!) {
    departmentMembers(departmentId: $departmentId) {
      id
      departmentId
      userId
      role
      userEmail
      userName
      userGlobalRole
    }
  }
`;

export const SET_MEMBER_M = gql`
  mutation SetDepartmentMember($input: SetDepartmentMemberInput!) {
    setDepartmentMember(input: $input) {
      id
      userId
      role
      userEmail
      userName
      userGlobalRole
    }
  }
`;

export const REMOVE_MEMBER_M = gql`
  mutation RemoveDepartmentMember($departmentId: String!, $userId: String!) {
    removeDepartmentMember(departmentId: $departmentId, userId: $userId)
  }
`;

export const AUDIT_Q = gql`
  query PolicyAuditLog($input: PolicyAuditQueryInput) {
    policyAuditLog(input: $input) {
      id
      actorName
      action
      targetType
      summary
      createdAt
    }
  }
`;
