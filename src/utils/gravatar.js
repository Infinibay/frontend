/**
 * Compute a real, spec-compliant MD5 hash of a string (synchronous, pure JS).
 *
 * Gravatar identifies accounts by the MD5 of the lowercased/trimmed email, so a
 * genuine MD5 is required for real avatars to resolve. Web Crypto's
 * crypto.subtle.digest does NOT support 'MD5', so we implement RFC 1321 here.
 * Handles the full Unicode range via UTF-8 encoding.
 *
 * @param {string} str - String to hash
 * @returns {string} 32-character lowercase hex MD5 digest
 */
function md5(str) {
  // UTF-8 encode so multi-byte characters hash identically to Gravatar's server.
  const bytes = typeof TextEncoder !== 'undefined'
    ? new TextEncoder().encode(str)
    : utf8Encode(str);

  const add32 = (a, b) => (a + b) & 0xffffffff;
  const rol = (n, c) => (n << c) | (n >>> (32 - c));

  const cmn = (q, a, b, x, s, t) => add32(rol(add32(add32(a, q), add32(x, t)), s), b);
  const ff = (a, b, c, d, x, s, t) => cmn((b & c) | (~b & d), a, b, x, s, t);
  const gg = (a, b, c, d, x, s, t) => cmn((b & d) | (c & ~d), a, b, x, s, t);
  const hh = (a, b, c, d, x, s, t) => cmn(b ^ c ^ d, a, b, x, s, t);
  const ii = (a, b, c, d, x, s, t) => cmn(c ^ (b | ~d), a, b, x, s, t);

  const n = bytes.length;
  // Build padded message: original bytes + 0x80 + zeros + 64-bit length.
  const withOne = n + 1;
  const padded = (withOne % 64 <= 56)
    ? withOne + (56 - (withOne % 64))
    : withOne + (120 - (withOne % 64));
  const totalLen = padded + 8;
  const buf = new Uint8Array(totalLen);
  buf.set(bytes);
  buf[n] = 0x80;
  const bitLen = n * 8;
  // 64-bit little-endian length (low 32 bits; high 32 bits ~0 for practical inputs).
  buf[padded] = bitLen & 0xff;
  buf[padded + 1] = (bitLen >>> 8) & 0xff;
  buf[padded + 2] = (bitLen >>> 16) & 0xff;
  buf[padded + 3] = (bitLen >>> 24) & 0xff;
  const bitLenHigh = Math.floor(n / 0x20000000); // (n*8) >> 32
  buf[padded + 4] = bitLenHigh & 0xff;
  buf[padded + 5] = (bitLenHigh >>> 8) & 0xff;
  buf[padded + 6] = (bitLenHigh >>> 16) & 0xff;
  buf[padded + 7] = (bitLenHigh >>> 24) & 0xff;

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  const x = new Int32Array(16);
  for (let i = 0; i < totalLen; i += 64) {
    for (let j = 0; j < 16; j++) {
      const k = i + j * 4;
      x[j] = buf[k] | (buf[k + 1] << 8) | (buf[k + 2] << 16) | (buf[k + 3] << 24);
    }

    const olda = a, oldb = b, oldc = c, oldd = d;

    a = ff(a, b, c, d, x[0], 7, -680876936);
    d = ff(d, a, b, c, x[1], 12, -389564586);
    c = ff(c, d, a, b, x[2], 17, 606105819);
    b = ff(b, c, d, a, x[3], 22, -1044525330);
    a = ff(a, b, c, d, x[4], 7, -176418897);
    d = ff(d, a, b, c, x[5], 12, 1200080426);
    c = ff(c, d, a, b, x[6], 17, -1473231341);
    b = ff(b, c, d, a, x[7], 22, -45705983);
    a = ff(a, b, c, d, x[8], 7, 1770035416);
    d = ff(d, a, b, c, x[9], 12, -1958414417);
    c = ff(c, d, a, b, x[10], 17, -42063);
    b = ff(b, c, d, a, x[11], 22, -1990404162);
    a = ff(a, b, c, d, x[12], 7, 1804603682);
    d = ff(d, a, b, c, x[13], 12, -40341101);
    c = ff(c, d, a, b, x[14], 17, -1502002290);
    b = ff(b, c, d, a, x[15], 22, 1236535329);

    a = gg(a, b, c, d, x[1], 5, -165796510);
    d = gg(d, a, b, c, x[6], 9, -1069501632);
    c = gg(c, d, a, b, x[11], 14, 643717713);
    b = gg(b, c, d, a, x[0], 20, -373897302);
    a = gg(a, b, c, d, x[5], 5, -701558691);
    d = gg(d, a, b, c, x[10], 9, 38016083);
    c = gg(c, d, a, b, x[15], 14, -660478335);
    b = gg(b, c, d, a, x[4], 20, -405537848);
    a = gg(a, b, c, d, x[9], 5, 568446438);
    d = gg(d, a, b, c, x[14], 9, -1019803690);
    c = gg(c, d, a, b, x[3], 14, -187363961);
    b = gg(b, c, d, a, x[8], 20, 1163531501);
    a = gg(a, b, c, d, x[13], 5, -1444681467);
    d = gg(d, a, b, c, x[2], 9, -51403784);
    c = gg(c, d, a, b, x[7], 14, 1735328473);
    b = gg(b, c, d, a, x[12], 20, -1926607734);

    a = hh(a, b, c, d, x[5], 4, -378558);
    d = hh(d, a, b, c, x[8], 11, -2022574463);
    c = hh(c, d, a, b, x[11], 16, 1839030562);
    b = hh(b, c, d, a, x[14], 23, -35309556);
    a = hh(a, b, c, d, x[1], 4, -1530992060);
    d = hh(d, a, b, c, x[4], 11, 1272893353);
    c = hh(c, d, a, b, x[7], 16, -155497632);
    b = hh(b, c, d, a, x[10], 23, -1094730640);
    a = hh(a, b, c, d, x[13], 4, 681279174);
    d = hh(d, a, b, c, x[0], 11, -358537222);
    c = hh(c, d, a, b, x[3], 16, -722521979);
    b = hh(b, c, d, a, x[6], 23, 76029189);
    a = hh(a, b, c, d, x[9], 4, -640364487);
    d = hh(d, a, b, c, x[12], 11, -421815835);
    c = hh(c, d, a, b, x[15], 16, 530742520);
    b = hh(b, c, d, a, x[2], 23, -995338651);

    a = ii(a, b, c, d, x[0], 6, -198630844);
    d = ii(d, a, b, c, x[7], 10, 1126891415);
    c = ii(c, d, a, b, x[14], 15, -1416354905);
    b = ii(b, c, d, a, x[5], 21, -57434055);
    a = ii(a, b, c, d, x[12], 6, 1700485571);
    d = ii(d, a, b, c, x[3], 10, -1894986606);
    c = ii(c, d, a, b, x[10], 15, -1051523);
    b = ii(b, c, d, a, x[1], 21, -2054922799);
    a = ii(a, b, c, d, x[8], 6, 1873313359);
    d = ii(d, a, b, c, x[15], 10, -30611744);
    c = ii(c, d, a, b, x[6], 15, -1560198380);
    b = ii(b, c, d, a, x[13], 21, 1309151649);
    a = ii(a, b, c, d, x[4], 6, -145523070);
    d = ii(d, a, b, c, x[11], 10, -1120210379);
    c = ii(c, d, a, b, x[2], 15, 718787259);
    b = ii(b, c, d, a, x[9], 21, -343485551);

    a = add32(a, olda);
    b = add32(b, oldb);
    c = add32(c, oldc);
    d = add32(d, oldd);
  }

  // Serialize the four state words as little-endian hex.
  const toHex = (num) => {
    let s = '';
    for (let i = 0; i < 4; i++) {
      s += ((num >>> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return s;
  };
  return toHex(a) + toHex(b) + toHex(c) + toHex(d);
}

/**
 * Minimal UTF-8 encoder fallback for environments without TextEncoder.
 * @param {string} str
 * @returns {number[]} UTF-8 byte values
 */
function utf8Encode(str) {
  const bytes = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff) {
      // Surrogate pair
      const hi = code;
      const lo = str.charCodeAt(++i);
      code = 0x10000 + ((hi & 0x3ff) << 10) + (lo & 0x3ff);
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f)
      );
    } else {
      bytes.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    }
  }
  return bytes;
}

/**
 * Generate a Gravatar URL based on an email address
 * @param {string} email - User email address
 * @param {object} options - Gravatar options
 * @param {number} options.size - Image size in pixels (1-2048)
 * @param {string} options.default - Default image type (404, mp, identicon, monsterid, wavatar, retro, robohash, blank)
 * @param {string} options.rating - Maximum rating (g, pg, r, x)
 * @returns {string} Gravatar URL
 */
export function getGravatarUrl(email, options = {}) {
  if (!email || typeof email !== 'string') {
    // Return default Gravatar for missing email
    return getDefaultGravatarUrl(options);
  }

  // Normalize email: trim and lowercase
  const normalizedEmail = email.trim().toLowerCase();

  // Gravatar identifies accounts by the MD5 of the normalized email.
  const hash = md5(normalizedEmail);

  // Build URL with options
  const {
    size = 200,
    default: defaultImage = 'identicon',
    rating = 'g'
  } = options;

  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating
  });

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

/**
 * Get a default Gravatar URL when no email is provided
 * @param {object} options - Gravatar options
 * @returns {string} Default Gravatar URL
 */
export function getDefaultGravatarUrl(options = {}) {
  const {
    size = 200,
    default: defaultImage = 'identicon',
    rating = 'g'
  } = options;

  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating
  });

  // Use a consistent hash for default avatar
  const defaultHash = '00000000000000000000000000000000';

  return `https://www.gravatar.com/avatar/${defaultHash}?${params.toString()}`;
}

/**
 * Get Gravatar profile URL
 * @param {string} email - User email address
 * @returns {string} Gravatar profile URL
 */
export function getGravatarProfileUrl(email) {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const hash = md5(normalizedEmail);

  return `https://www.gravatar.com/${hash}`;
}

/**
 * Available Gravatar default image types
 */
export const GRAVATAR_DEFAULTS = {
  /** Return 404 if no Gravatar exists */
  NOT_FOUND: '404',
  /** Mystery person silhouette */
  MYSTERY_PERSON: 'mp',
  /** Geometric pattern based on email hash */
  IDENTICON: 'identicon',
  /** Generated monster with different colors */
  MONSTERID: 'monsterid',
  /** Generated face with different features */
  WAVATAR: 'wavatar',
  /** 8-bit arcade-style pixelated faces */
  RETRO: 'retro',
  /** Generated robot with different colors */
  ROBOHASH: 'robohash',
  /** Transparent PNG */
  BLANK: 'blank'
};

/**
 * Available Gravatar ratings
 */
export const GRAVATAR_RATINGS = {
  /** Suitable for display on all websites */
  G: 'g',
  /** May contain rude gestures, provocatively dressed individuals */
  PG: 'pg',
  /** May contain harsh profanity, intense violence, nudity */
  R: 'r',
  /** May contain hardcore sexual imagery or extremely disturbing violence */
  X: 'x'
};
