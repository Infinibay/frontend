'use client';

/**
 * OsBadge — given a free-form OS/template string, returns a branded chip:
 * tiny logo (simple-icons CDN) + short name, colored to match the OS.
 *
 * Low saturation to match Harbor's muted palette — the chip is a signal,
 * not a sticker.
 */

const OS_MAP = [
  { match: /windows|\bwin\b|win10|win11|microsoft/i, slug: 'windows11', label: 'Windows', tintBg: 'bg-[rgb(0_120_214_/_0.10)]',   tintFg: 'text-[rgb(120_180_240)]', color: '5EB5FF', inline: 'windows' },
  { match: /ubuntu/i,          slug: 'ubuntu',        label: 'Ubuntu',      tintBg: 'bg-[rgb(233_84_32_/_0.10)]', tintFg: 'text-[rgb(233_140_100)]', color: 'E95420' },
  { match: /debian/i,          slug: 'debian',        label: 'Debian',      tintBg: 'bg-[rgb(168_29_51_/_0.10)]', tintFg: 'text-[rgb(220_140_150)]', color: 'DC7B8A' },
  { match: /fedora/i,          slug: 'fedora',        label: 'Fedora',      tintBg: 'bg-[rgb(81_162_218_/_0.10)]',tintFg: 'text-[rgb(120_180_230)]', color: '78B4E6' },
  { match: /centos/i,          slug: 'centos',        label: 'CentOS',      tintBg: 'bg-[rgb(62_115_167_/_0.10)]',tintFg: 'text-[rgb(130_170_220)]', color: '82AADB' },
  { match: /rhel|red\s?hat/i,  slug: 'redhat',        label: 'RHEL',        tintBg: 'bg-[rgb(238_0_0_/_0.10)]',   tintFg: 'text-[rgb(240_130_130)]', color: 'F08282' },
  { match: /arch/i,            slug: 'archlinux',     label: 'Arch',        tintBg: 'bg-[rgb(23_147_209_/_0.10)]',tintFg: 'text-[rgb(100_180_220)]', color: '64B4DC' },
  { match: /alpine/i,          slug: 'alpinelinux',   label: 'Alpine',      tintBg: 'bg-[rgb(13_89_127_/_0.10)]', tintFg: 'text-[rgb(130_180_220)]', color: '82B4DC' },
  { match: /macos|osx|darwin|apple|mac\s?os/i, slug: 'apple', label: 'macOS', tintBg: 'bg-white/5',               tintFg: 'text-fg',                color: 'FFFFFF' },
  { match: /freebsd|bsd/i,     slug: 'freebsd',       label: 'FreeBSD',     tintBg: 'bg-[rgb(171_43_40_/_0.10)]', tintFg: 'text-[rgb(220_140_140)]', color: 'DC8C8C' },
  { match: /linux|gnu/i,       slug: 'linux',         label: 'Linux',       tintBg: 'bg-[rgb(252_198_36_/_0.08)]',tintFg: 'text-[rgb(230_195_100)]', color: 'E6C364' },
];

function matchOs(os) {
  if (!os || typeof os !== 'string') return null;
  return OS_MAP.find((m) => m.match.test(os));
}

/**
 * simple-icons CDN no longer hosts Microsoft-trademarked logos (Windows
 * returns 404). For Windows we render an inline SVG instead.
 */
function InlineOsIcon({ hit, size }) {
  if (hit.inline === 'windows') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={`#${hit.color}`}
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <path d="M3 5.7l8-1.1v7.4H3V5.7zm0 12.6l8 1.1v-7.4H3v6.3zm9 1.2l9 1.2v-8.5h-9v7.3zm0-15.7v7.7h9V2.5l-9 1.3z" />
      </svg>
    );
  }
  return (
    <img
      src={`https://cdn.simpleicons.org/${hit.slug}/${hit.color}`}
      alt=""
      width={size}
      height={size}
      style={{ display: 'block' }}
    />
  );
}

/** Named label (uses map's default) */
export function OsBadge({ os, size = 14, className = '' }) {
  const hit = matchOs(os);
  if (!hit) {
    return (
      <span
        className={[
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md',
          'text-xs text-fg-muted bg-white/5 whitespace-nowrap',
          className,
        ].join(' ')}
      >
        {os || '—'}
      </span>
    );
  }
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md',
        'text-xs whitespace-nowrap',
        hit.tintBg,
        hit.tintFg,
        className,
      ].join(' ')}
    >
      <InlineOsIcon hit={hit} size={size} />
      <span>{hit.label}</span>
    </span>
  );
}

/** Icon only (for dense columns where text doesn't fit) */
export function OsIcon({ os, size = 14 }) {
  const hit = matchOs(os);
  if (!hit) return null;
  return <InlineOsIcon hit={hit} size={size} />;
}
