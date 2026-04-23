/** Policy fixtures for the Preview. Web filter + network policies. */

export type PolicyKind = 'web' | 'network';

export interface Policy {
  id: string;
  name: string;
  kind: PolicyKind;
  description: string;
  appliedTo: number;
  lastModifiedAt: string;
}

export const POLICIES: Policy[] = [
  {
    id: 'pol-office',
    name: 'Office Standard',
    kind: 'web',
    description: 'Permissive web filter for general office work. Blocks adult content and known malware categories.',
    appliedTo: 3,
    lastModifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pol-restricted',
    name: 'Restricted',
    kind: 'web',
    description: 'Tight web filter. Blocks social media, streaming, and non-business categories.',
    appliedTo: 1,
    lastModifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pol-dev',
    name: 'Dev Unlimited',
    kind: 'web',
    description: 'Dev/engineering tier. Only known malware and phishing are blocked.',
    appliedTo: 1,
    lastModifiedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pol-callcenter',
    name: 'Call Center',
    kind: 'web',
    description: 'Locked to whitelisted tools. Everything else blocked.',
    appliedTo: 0,
    lastModifiedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'pol-vpn-only',
    name: 'VPN Only',
    kind: 'network',
    description: 'Outbound traffic only via corporate VPN gateway.',
    appliedTo: 2,
    lastModifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface WebFilterCategory {
  id: string;
  name: string;
  allow: boolean;
  description: string;
}

export const WEB_CATEGORIES: Record<string, WebFilterCategory[]> = {
  'pol-office': [
    { id: 'adult',       name: 'Adult content',       allow: false, description: 'Explicit material, pornography.' },
    { id: 'malware',     name: 'Malware & phishing',  allow: false, description: 'Known malicious sites.' },
    { id: 'gambling',    name: 'Gambling',            allow: false, description: 'Casinos, betting, lotteries.' },
    { id: 'weapons',     name: 'Weapons',             allow: false, description: 'Firearms, explosives commerce.' },
    { id: 'social',      name: 'Social media',        allow: true,  description: 'Facebook, Twitter/X, Instagram, LinkedIn.' },
    { id: 'streaming',   name: 'Streaming',           allow: true,  description: 'YouTube, Netflix, Twitch, Spotify.' },
    { id: 'news',        name: 'News',                allow: true,  description: 'News portals and aggregators.' },
    { id: 'shopping',    name: 'Shopping',            allow: true,  description: 'E-commerce sites.' },
    { id: 'productivity',name: 'Productivity',        allow: true,  description: 'Office, docs, collaboration.' },
    { id: 'dev',         name: 'Developer tools',     allow: true,  description: 'GitHub, npm, Docker Hub, Stack Overflow.' },
  ],
  'pol-restricted': [
    { id: 'adult',       name: 'Adult content',       allow: false, description: 'Explicit material, pornography.' },
    { id: 'malware',     name: 'Malware & phishing',  allow: false, description: 'Known malicious sites.' },
    { id: 'gambling',    name: 'Gambling',            allow: false, description: 'Casinos, betting, lotteries.' },
    { id: 'weapons',     name: 'Weapons',             allow: false, description: 'Firearms, explosives commerce.' },
    { id: 'social',      name: 'Social media',        allow: false, description: 'Facebook, Twitter/X, Instagram, LinkedIn.' },
    { id: 'streaming',   name: 'Streaming',           allow: false, description: 'YouTube, Netflix, Twitch, Spotify.' },
    { id: 'news',        name: 'News',                allow: true,  description: 'News portals and aggregators.' },
    { id: 'shopping',    name: 'Shopping',            allow: false, description: 'E-commerce sites.' },
    { id: 'productivity',name: 'Productivity',        allow: true,  description: 'Office, docs, collaboration.' },
    { id: 'dev',         name: 'Developer tools',     allow: false, description: 'GitHub, npm, Docker Hub, Stack Overflow.' },
  ],
  'pol-dev': [
    { id: 'malware',     name: 'Malware & phishing',  allow: false, description: 'Known malicious sites.' },
    { id: 'adult',       name: 'Adult content',       allow: false, description: 'Explicit material, pornography.' },
    { id: 'social',      name: 'Social media',        allow: true,  description: 'Facebook, Twitter/X, Instagram, LinkedIn.' },
    { id: 'streaming',   name: 'Streaming',           allow: true,  description: 'YouTube, Netflix, Twitch, Spotify.' },
    { id: 'dev',         name: 'Developer tools',     allow: true,  description: 'GitHub, npm, Docker Hub, Stack Overflow.' },
  ],
  'pol-callcenter': [
    { id: 'malware',     name: 'Malware & phishing',  allow: false, description: 'Known malicious sites.' },
    { id: 'social',      name: 'Social media',        allow: false, description: 'Facebook, Twitter/X, Instagram, LinkedIn.' },
    { id: 'streaming',   name: 'Streaming',           allow: false, description: 'YouTube, Netflix, Twitch, Spotify.' },
    { id: 'news',        name: 'News',                allow: false, description: 'News portals and aggregators.' },
    { id: 'shopping',    name: 'Shopping',            allow: false, description: 'E-commerce sites.' },
    { id: 'productivity',name: 'Productivity',        allow: true,  description: 'Office, docs, collaboration.' },
  ],
};

export interface CustomRule {
  id: string;
  domain: string;
  allow: boolean;
}

export const CUSTOM_RULES: Record<string, CustomRule[]> = {
  'pol-office':     [{ id: 'r1', domain: 'company-intranet.acme.com', allow: true }, { id: 'r2', domain: 'tiktok.com', allow: false }],
  'pol-restricted': [{ id: 'r1', domain: 'company-intranet.acme.com', allow: true }],
  'pol-dev':        [],
  'pol-callcenter': [{ id: 'r1', domain: 'contact-center-app.acme.com', allow: true }, { id: 'r2', domain: 'salesforce.com', allow: true }],
};

/** Given a policy and a domain, simulate a classification. Used by the test UI. */
export function testDomain(policyId: string, domain: string): { verdict: 'allowed' | 'blocked'; reason: string } {
  const d = domain.trim().toLowerCase().replace(/^https?:\/\//, '').split('/')[0];
  if (!d) return { verdict: 'allowed', reason: 'No domain entered' };

  const custom = (CUSTOM_RULES[policyId] || []).find((r) => d === r.domain || d.endsWith('.' + r.domain));
  if (custom) {
    return { verdict: custom.allow ? 'allowed' : 'blocked', reason: `Matches custom rule "${custom.domain}"` };
  }

  const categories = WEB_CATEGORIES[policyId] || [];
  // Tiny heuristic map for the demo
  const DOMAIN_TO_CAT = [
    { match: /(porn|xxx|adult)/, cat: 'adult' },
    { match: /(phish|malware|malicious)/, cat: 'malware' },
    { match: /(casino|bet|poker)/, cat: 'gambling' },
    { match: /(youtube|netflix|twitch|spotify|primevideo|hulu)/, cat: 'streaming' },
    { match: /(facebook|twitter|x\.com|instagram|linkedin|tiktok|reddit)/, cat: 'social' },
    { match: /(amazon|ebay|mercadolibre|aliexpress|shopify)/, cat: 'shopping' },
    { match: /(github|npmjs|docker|stackoverflow|anthropic|openai|developer)/, cat: 'dev' },
    { match: /(office|docs|slack|notion|confluence|jira|google\.com\/docs)/, cat: 'productivity' },
    { match: /(cnn|bbc|nytimes|reuters|news)/, cat: 'news' },
  ];
  const hit = DOMAIN_TO_CAT.find((m) => m.match.test(d));
  if (hit) {
    const cat = categories.find((c) => c.id === hit.cat);
    if (cat) {
      return {
        verdict: cat.allow ? 'allowed' : 'blocked',
        reason: `Category: ${cat.name}`,
      };
    }
  }

  return { verdict: 'allowed', reason: 'Uncategorised — falls through to default allow' };
}
