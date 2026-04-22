/**
 * Parse a spice://[password@]host:port URL into its parts.
 * Returns null if the URL is not a valid SPICE URL.
 */
export const parseSpiceUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/^spice:\/\/(?:([^@]+)@)?([^:/?#]+):(\d+)/i);
  if (!match) return null;
  const [, password, host, port] = match;
  const portNum = Number(port);
  if (!portNum || portNum <= 0 || portNum > 65535) return null;
  return { host, port: portNum, password: password ? decodeURIComponent(password) : undefined };
};

/**
 * Build a virt-viewer .vv config file body for the given connection.
 * Reference: https://gitlab.com/virt-viewer/virt-viewer/-/wikis/FileFormats
 */
export const buildVvFile = ({ host, port, password, title }) => {
  const lines = ['[virt-viewer]', 'type=spice', `host=${host}`, `port=${port}`];
  if (password) lines.push(`password=${password}`);
  if (title) lines.push(`title=${title}`);
  lines.push('fullscreen=0');
  lines.push('delete-this-file=1');
  return lines.join('\n') + '\n';
};

/**
 * Trigger a browser download of a .vv file that most OSes will open with
 * the default SPICE client (virt-viewer / remote-viewer on Linux, the
 * virt-viewer installer for Windows, etc).
 */
export const openSpiceClient = (graphicUrl, { vmName } = {}) => {
  const parsed = parseSpiceUrl(graphicUrl);
  if (!parsed) {
    throw new Error('Invalid SPICE URL');
  }
  const body = buildVvFile({ ...parsed, title: vmName });
  const blob = new Blob([body], { type: 'application/x-virt-viewer' });
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = `${vmName || 'vm'}-spice.vv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 2000);
};
