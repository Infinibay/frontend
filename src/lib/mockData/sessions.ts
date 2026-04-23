export interface LiveSession {
  id: string;
  userName: string;
  userEmail: string;
  desktopName: string;
  host: string;
  clientIp: string;
  protocol: 'SPICE' | 'RDP' | 'HTML5';
  connectedAt: string;   // ISO
  latencyMs: number;
  bandwidthKbps: number;
  usbRedirect: boolean;
  clipboard: boolean;
  printing: boolean;
}

const now = Date.now();

export const LIVE_SESSIONS: LiveSession[] = [
  { id: 'ss-1', userName: 'María García',   userEmail: 'mgarcia@acme.local',   desktopName: 'contab-01', host: 'host-1', clientIp: '10.20.30.41',  protocol: 'SPICE', connectedAt: new Date(now - 45  * 60_000).toISOString(), latencyMs: 12,  bandwidthKbps: 820,  usbRedirect: true,  clipboard: true,  printing: true },
  { id: 'ss-2', userName: 'Pablo López',    userEmail: 'plopez@acme.local',    desktopName: 'contab-03', host: 'host-1', clientIp: '10.20.30.58',  protocol: 'SPICE', connectedAt: new Date(now - 22  * 60_000).toISOString(), latencyMs: 9,   bandwidthKbps: 610,  usbRedirect: false, clipboard: true,  printing: true },
  { id: 'ss-3', userName: 'Sofía Ruiz',     userEmail: 'sruiz@acme.local',     desktopName: 'ventas-02', host: 'host-2', clientIp: '10.20.30.77',  protocol: 'SPICE', connectedAt: new Date(now - 132 * 60_000).toISOString(), latencyMs: 24,  bandwidthKbps: 1100, usbRedirect: true,  clipboard: true,  printing: false },
  { id: 'ss-4', userName: 'Diego Fernández',userEmail: 'dfernandez@acme.com',  desktopName: 'dev-ws-01', host: 'host-3', clientIp: '203.0.113.14', protocol: 'RDP',   connectedAt: new Date(now - 480 * 60_000).toISOString(), latencyMs: 68,  bandwidthKbps: 2400, usbRedirect: false, clipboard: true,  printing: false },
  { id: 'ss-5', userName: 'Clara Torres',   userEmail: 'ctorres@acme.local',   desktopName: 'cx-14',     host: 'host-2', clientIp: '10.20.30.112', protocol: 'HTML5', connectedAt: new Date(now - 7   * 60_000).toISOString(), latencyMs: 18,  bandwidthKbps: 340,  usbRedirect: false, clipboard: false, printing: false },
  { id: 'ss-6', userName: 'Rafael Castro',  userEmail: 'rcastro@acme.local',   desktopName: 'cx-21',     host: 'host-2', clientIp: '10.20.30.118', protocol: 'HTML5', connectedAt: new Date(now - 153 * 60_000).toISOString(), latencyMs: 22,  bandwidthKbps: 310,  usbRedirect: false, clipboard: false, printing: false },
];

export interface SessionEvent {
  at: string;
  kind: 'connected' | 'reconnected' | 'clipboard' | 'print' | 'usb';
  text: string;
}

export function mockSessionEvents(session: LiveSession): SessionEvent[] {
  const start = new Date(session.connectedAt).getTime();
  const step = 3 * 60_000;
  return [
    { at: new Date(start).toISOString(),              kind: 'connected',   text: `Connected from ${session.clientIp} over ${session.protocol}` },
    { at: new Date(start + step * 2).toISOString(),   kind: 'clipboard',   text: 'Clipboard used (text, 512 bytes)' },
    session.usbRedirect
      ? { at: new Date(start + step * 4).toISOString(), kind: 'usb' as const, text: 'USB device attached: SmartCard Reader' }
      : { at: new Date(start + step * 4).toISOString(), kind: 'clipboard' as const, text: 'Clipboard used (text, 128 bytes)' },
    { at: new Date(start + step * 6).toISOString(),   kind: 'reconnected', text: 'Reconnected after 6s network blip' },
    session.printing
      ? { at: new Date(start + step * 9).toISOString(), kind: 'print' as const, text: 'Print job sent: invoice.pdf (3 pages)' }
      : { at: new Date(start + step * 9).toISOString(), kind: 'clipboard' as const, text: 'Clipboard used (text, 76 bytes)' },
  ];
}
