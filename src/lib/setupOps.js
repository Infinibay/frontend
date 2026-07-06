// GraphQL operations for the first-run /setup flow.
//
// These are authored as INLINE `gql` documents (not codegen'd hooks) on purpose:
// /setup is a self-contained pre-login flow, and inlining keeps it independent of
// the generated `@/gql/hooks` surface (and of a codegen run). Operation names are
// `Setup*`-prefixed to avoid clashing with the app's existing operations.

import { gql } from '@apollo/client';

export const SETUP_STATUS = gql`
  query SetupStatus {
    setupStatus {
      completed
      phase
      devModeAdmin
      steps { key label done }
    }
  }
`;

export const COMPLETE_SETUP = gql`
  mutation SetupComplete {
    completeSetup {
      completed
      phase
    }
  }
`;

export const SETUP_CHANGE_ADMIN_PASSWORD = gql`
  mutation SetupChangeAdminPassword($newPassword: String!) {
    setupChangeAdminPassword(newPassword: $newPassword) {
      completed
      devModeAdmin
    }
  }
`;

export const AUTO_DOWNLOADABLE_OSES = gql`
  query SetupAutoDownloadableOSes {
    autoDownloadableOSes
  }
`;

export const START_OS_ISO_DOWNLOAD = gql`
  mutation SetupStartOSIsoDownload($os: String!) {
    startOSIsoDownload(os: $os)
  }
`;

export const CHECK_SYSTEM_READINESS = gql`
  query SetupCheckSystemReadiness {
    checkSystemReadiness {
      ready
      availableOS
      missingOS
    }
  }
`;

export const CHECK_ISO_STATUS = gql`
  query SetupCheckISOStatus($os: String!) {
    checkISOStatus(os: $os) {
      os
      available
    }
  }
`;

export const ISO_DOWNLOAD_STATUS = gql`
  query SetupIsoDownloadStatus($os: String!) {
    isoDownloadStatus(os: $os) {
      os
      state
      receivedBytes
      totalBytes
      error
    }
  }
`;

export const CANCEL_OS_ISO_DOWNLOAD = gql`
  mutation SetupCancelOSIsoDownload($os: String!) {
    cancelOSIsoDownload(os: $os)
  }
`;

export const AVAILABLE_ISOS = gql`
  query SetupAvailableISOs {
    availableISOs {
      id
      os
      filename
    }
  }
`;

export const REMOVE_ISO = gql`
  mutation SetupRemoveISO($isoId: String!) {
    removeISO(isoId: $isoId)
  }
`;

export const SETUP_ROLES = gql`
  query SetupRoles {
    roles { id key name description isSystem }
  }
`;

export const SETUP_CREATE_USER = gql`
  mutation SetupCreateUser($input: CreateUserInputType!) {
    createUser(input: $input) {
      id
      email
      role
    }
  }
`;

// Pickable OSes (matches the backend MachineOs enum values). Windows is
// upload-only — it has no autoDownload entry, so the UI shows only FileDrop for it.
export const PICKABLE_OSES = [
  { os: 'ubuntu', label: 'Ubuntu', autoDownloadable: true },
  { os: 'fedora', label: 'Fedora', autoDownloadable: true },
  { os: 'windows10', label: 'Windows 10', autoDownloadable: false },
  { os: 'windows11', label: 'Windows 11', autoDownloadable: false },
];
