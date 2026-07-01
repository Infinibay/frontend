import { useCallback } from 'react';
import { toast } from 'sonner';
import { useGraphicConnectionLazyQuery } from '@/gql/hooks';
import { openSpiceClient } from '@/utils/spiceConnect';

/**
 * Hook that opens a VM's SPICE/VNC console via the master's per-session relay.
 *
 * On click it asks the backend (`graphicConnection`) for a live connection: the
 * backend provisions a relay session and returns a link pointing at the MASTER
 * ingress (host:port), not the VM's raw bind address (which is 0.0.0.0/loopback
 * and not dialable from the client). The returned link + password are assembled
 * into a `spice://` URL and handed to virt-viewer via a `.vv` download.
 *
 * `fallbackUrl` (the pre-baked `configuration.graphic`) is used only if the
 * backend returns no link — e.g. the proxy is disabled and a direct route works.
 */
export function useOpenConsole() {
  const [fetchGraphicConnection] = useGraphicConnectionLazyQuery();

  return useCallback(
    async (vm, fallbackUrl = null) => {
      if (!vm?.id) return;
      try {
        const { data } = await fetchGraphicConnection({ variables: { id: vm.id } });
        const conn = data?.graphicConnection;
        let url = fallbackUrl;
        if (conn?.link) {
          url = conn.password
            ? conn.link.replace('://', `://${encodeURIComponent(conn.password)}@`)
            : conn.link;
        }
        if (!url) throw new Error('No console connection is available for this VM.');
        openSpiceClient(url, { vmName: vm?.name });
        toast('Opening SPICE client', {
          description:
            'A .vv file was downloaded. Your OS should open it with virt-viewer or the default SPICE client.',
        });
      } catch (err) {
        toast.error('Could not open SPICE client', {
          description: err?.message || 'Invalid connection info',
        });
      }
    },
    [fetchGraphicConnection]
  );
}
