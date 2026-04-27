/**
 * Enriched metadata for golden-image hardening scripts.
 * Maps script fileName → human-readable details, pros and cons.
 * Scripts not listed here fall back to their description + tags.
 */

export const SCRIPT_DETAILS = {
  'golden-image/windows-disable-telemetry.yaml': {
    whatItDoes:
      'Stops and disables the DiagTrack and dmwappushservice services, sets the AllowTelemetry registry policy to 0, and disables CEIP and Compatibility Appraiser scheduled tasks.',
    pros: [
      'Stops diagnostic data collection at the OS level',
      'Reduces background network traffic to Microsoft',
      'Idempotent — safe to run multiple times',
      'Recommended for regulated/business environments',
    ],
    cons: [
      'Windows Update reliability reports will be empty',
      'Feedback Hub and Insider preview features stop working',
      'Microsoft may show a generic "managed by your organization" banner',
    ],
    notes: 'Safe for enterprise desktops. No user-facing breakage beyond telemetry UI.',
  },
  'golden-image/windows-disable-ads-suggestions.yaml': {
    whatItDoes:
      'Disables Start menu suggestions, lock-screen ads, tailored experiences, and consumer features that reinstall promoted apps. Applies both machine-wide policy keys and default-user hive settings so new profiles inherit them.',
    pros: [
      'Clean Start menu without promoted tiles',
      'No surprise app reinstalls after Windows Updates',
      'Improves end-user experience and reduces support tickets',
    ],
    cons: [
      'Windows Spotlight and dynamic lock-screen wallpapers are disabled',
      'Some "consumer features" like app suggestions in Search are turned off',
    ],
    notes: 'The default-user hive change ensures the policy survives new account creation.',
  },
  'golden-image/windows-disable-cortana.yaml': {
    whatItDoes:
      'Removes the Cortana AppX package for all users and from the provisioning manifest, then sets policy keys that block reinstallation and disable web search in the Start menu.',
    pros: [
      'Eliminates a known privacy surface (voice/search assistant)',
      'Reduces background CPU and memory usage',
      'Prevents Cortana from coming back for new user profiles',
    ],
    cons: [
      'Windows search loses web/Bing integration',
      'Voice commands and dictation features stop working',
      'Some Start-menu search suggestions disappear',
    ],
    notes: 'Provisioned-package removal is permanent; Cortana can only be restored via PowerShell or an OS reinstall.',
  },
  'golden-image/windows-remove-bloatware.yaml': {
    whatItDoes:
      'Removes a curated list of non-business UWP apps (Xbox suite, Mixed Reality, Clipchamp, Feedback Hub, 3D Viewer, etc.) from all existing users and the provisioning manifest.',
    pros: [
      'Smaller OS image and faster logins',
      'Fewer background updates and less attack surface',
      'Cleaner desktop and app list for business users',
    ],
    cons: [
      'Consumer apps are gone permanently for standard users',
      'Reinstalling removed apps requires administrator rights',
      'Some Xbox/Game Bar features may break if users had profiles relying on them',
    ],
    notes: 'Office, Edge, Calculator, Photos and Sticky Notes are intentionally preserved. Extend the list via custom scripts if needed.',
  },
  'golden-image/windows-enable-bitlocker.yaml': {
    whatItDoes:
      'Enables BitLocker full-disk encryption on C: using the TPM and a recovery-password protector. Writes the recovery key to C:\\BitLockerRecoveryKey.txt and restricts ACLs to Administrators and SYSTEM.',
    pros: [
      'Protects data at rest against physical theft or disk cloning',
      'Meets common compliance requirements (HIPAA, PCI-DSS, etc.)',
      'Idempotent — skips if the volume is already encrypted',
      'Uses UsedSpaceOnly for faster initial encryption on thin-provisioned VDI disks',
    ],
    cons: [
      'Recovery-key escrow to a local text file is demo-grade only',
      'Production environments should push keys to AD DS, Intune, or a vault',
      'Requires a TPM; VMs without TPM will skip silently',
      'BitLocker overhead is minimal but measurable on very slow storage',
    ],
    notes: 'For production, replace the file-based escrow with Active Directory or a cloud key-vault integration.',
  },
  'golden-image/windows-set-wallpaper-and-power.yaml': {
    whatItDoes:
      'Applies the blueprint wallpaper URL and power-plan token on first boot. Downloads or copies the image, updates the registry, and sets the active power scheme (balanced, high-performance or power-saver).',
    pros: [
      'Consistent corporate branding out of the box',
      'Correct power settings for VDI (e.g. high-performance)',
      'Works for both local paths and HTTP(S) URLs',
    ],
    cons: [
      'Wallpaper download requires internet or LAN access on first boot if a URL is used',
      'Custom power plans not in the Windows default set are ignored',
    ],
    notes: 'Reads WALLPAPER_URL and POWER_PLAN from blueprint inputValues.',
  },
  'golden-image/ubuntu-disable-telemetry.yaml': {
    whatItDoes:
      'Disables apport (crash reporting), whoopsie (error submissions), ubuntu-report (first-run popularity contest), and MOTD sponsored links.',
    pros: [
      'Stops crash and usage data from leaving the desktop',
      'Improves privacy posture for regulated environments',
      'Idempotent and lightweight',
    ],
    cons: [
      'Canonical receives less diagnostic data to improve Ubuntu',
      'Error reporting becomes fully manual (apport-cli)',
      'MOTD news is suppressed entirely',
    ],
    notes: 'Safe for enterprise deployments. Does not affect Ubuntu Pro/ESM notifications.',
  },
  'golden-image/ubuntu-remove-snap-bloat.yaml': {
    whatItDoes:
      'Removes snapd entirely, blocks its reinstallation via apt pinning, and reinstalls Firefox as a native deb package via the Mozilla PPA.',
    pros: [
      'Much faster boot times and lower disk usage',
      'Fewer background services (snapd, auto-refresh timers)',
      'Firefox runs as a native .deb instead of a confined snap',
      'Predictable update cadence via apt instead of snap refreshes',
    ],
    cons: [
      'Snap Store and all snap apps become unavailable',
      'Users lose Ubuntu\'s snap-based software discovery',
      'Reinstalling snapd requires manual removal of the apt pin',
      'Mozilla PPA must be reachable during first boot',
    ],
    notes: 'Substantially reduces boot time and disk usage on Ubuntu VDI pools.',
  },
  'golden-image/fedora-disable-telemetry.yaml': {
    whatItDoes:
      'Disables ABRT (Automatic Bug Reporting Tool), geoclue (geolocation), and PackageKit background refreshes on Fedora. Also cleans GNOME initial-setup relics on cloned images.',
    pros: [
      'Reduces background network traffic and CPU usage',
      'Better privacy by removing geolocation and automatic crash reporting',
      'PackageKit offline updates are disabled — ideal for centrally-managed VDI',
    ],
    cons: [
      'Automatic bug reporting stops; crashes must be reported manually',
      'Location services (weather, maps) no longer work',
      'GNOME Software will not show updates until dnf is run manually',
    ],
    notes: 'Ideal for centrally-managed desktops where updates are pushed via Infinibay scripts.',
  },
  'golden-image/fedora-remove-tracker.yaml': {
    whatItDoes:
      'Masks Tracker3 file-indexer units globally and removes autostart entries to stop the GNOME file indexer from running.',
    pros: [
      'Significant CPU and RAM savings on VDI sessions',
      'Faster login and less disk thrashing after boot',
      'No perceptible impact on typical office workflows',
    ],
    cons: [
      'File search in GNOME Files (Nautilus) will not find content by text',
      'Some GNOME apps that rely on Tracker metadata (e.g. Photos) degrade gracefully but lose search',
    ],
    notes: 'Best-effort per-user termination is included; new logins will not start the indexer.',
  },
  'golden-image/linux-disk-encryption-notice.yaml': {
    whatItDoes:
      'Placeholder script that writes a notice to /var/log/infinibay-encryption-notice.log. Full-disk encryption on Linux VMs requires LUKS configuration at install time (preseed / cloud-init), which is not yet wired up.',
    pros: [
      'Transparently documents that encryption was requested in the blueprint',
      'Operators can audit logs to see the intent was captured',
    ],
    cons: [
      'Does NOT encrypt the disk — the VM remains unencrypted',
      'Compliance auditors may flag the gap between intent and implementation',
    ],
    notes: 'Tracked as follow-up 6.G.ii. For now, configure LUKS via preseed or cloud-init storage layouts at provisioning time.',
  },
  'golden-image/linux-set-wallpaper-and-power.yaml': {
    whatItDoes:
      'Applies the blueprint wallpaper URL and power-plan token on first boot for GNOME-based distros. Uses gsettings for wallpaper and power-profiles-daemon / tuned for the power plan.',
    pros: [
      'Consistent branding across Linux desktops',
      'Correct power profile for VDI (e.g. performance)',
      'Supports both power-profiles-daemon and tuned backends',
    ],
    cons: [
      'Requires gsettings — non-GNOME desktops may ignore the wallpaper',
      'Wallpaper download needs network on first boot if a URL is used',
      'tuned profiles may override other system tuning',
    ],
    notes: 'Reads WALLPAPER_URL and POWER_PLAN from blueprint inputValues.',
  },
};

export function getScriptDetails(script) {
  if (!script?.fileName) return null;
  return SCRIPT_DETAILS[script.fileName] ?? null;
}
