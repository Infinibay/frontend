'use client';

// /setup Step: OS images (ISOs).
//  - Ubuntu / Fedora: one-click auto-download (backend IsoDownloadService). Progress
//    and errors come from POLLING isoDownloadStatus (socket-independent — the realtime
//    socket may not be connected during setup). Cancelable.
//  - All OSes: manual upload via the SAME axios flow the Settings › ISOs tab uses
//    (real % progress + cancel + toast). Windows is upload-only.
//  - Wrong upload? Remove it and try again.
// This step never blocks Next: installing an ISO is optional to finish setup.

import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useMutation, useQuery, useApolloClient } from '@apollo/client/react';
import { Button, Alert, Progress, Badge, Card } from '@infinibay/harbor';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import {
  START_OS_ISO_DOWNLOAD,
  CANCEL_OS_ISO_DOWNLOAD,
  ISO_DOWNLOAD_STATUS,
  AVAILABLE_ISOS,
  REMOVE_ISO,
  PICKABLE_OSES,
} from '@/lib/setupOps';

const BACKEND = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BACKEND_HOST) || 'http://localhost:4000';
const ACTIVE_STATES = new Set(['resolving', 'downloading', 'verifying', 'registering']);

function fmtBytes(n) {
  if (!n) return '';
  const u = ['B', 'KB', 'MB', 'GB'];
  let v = n; let i = 0;
  while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
  return `${v.toFixed(1)} ${u[i]}`;
}

function OsCard({ os, label, autoDownloadable, available, isoId, onChanged }) {
  const client = useApolloClient();
  const [startDownload] = useMutation(START_OS_ISO_DOWNLOAD);
  const [cancelDownload] = useMutation(CANCEL_OS_ISO_DOWNLOAD);
  const [removeIso] = useMutation(REMOVE_ISO);

  const [dl, setDl] = React.useState(null); // { state, receivedBytes, totalBytes, error }
  const [uploading, setUploading] = React.useState(false);
  const [uploadPct, setUploadPct] = React.useState(0);
  const [busy, setBusy] = React.useState(false);
  const pollRef = React.useRef(null);
  const uploadCtrl = React.useRef(null);
  const fileRef = React.useRef(null);

  React.useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const stopPoll = () => { if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; } };

  const poll = React.useCallback(() => {
    stopPoll();
    pollRef.current = setInterval(async () => {
      try {
        const { data } = await client.query({
          query: ISO_DOWNLOAD_STATUS,
          variables: { os },
          fetchPolicy: 'network-only',
        });
        const s = data?.isoDownloadStatus;
        if (!s) return;
        setDl(s);
        if (!ACTIVE_STATES.has(s.state)) {
          stopPoll();
          if (s.state === 'done') { toast.success(`${label} downloaded and registered`); onChanged?.(); }
          else if (s.state === 'failed') { toast.error(`${label} download failed`); }
          else if (s.state === 'cancelled') { toast.info(`${label} download cancelled`); }
        }
      } catch { /* keep polling */ }
    }, 1500);
  }, [client, os, label, onChanged]);

  const handleAuto = async () => {
    setBusy(true);
    setDl({ state: 'resolving', receivedBytes: 0, totalBytes: 0 });
    try {
      await startDownload({ variables: { os } });
      poll();
    } catch (e) {
      setDl({ state: 'failed', error: e?.message || 'Could not start the download.' });
      toast.error(e?.message || 'Could not start the download.');
    } finally {
      setBusy(false);
    }
  };

  const handleCancelDownload = async () => {
    try { await cancelDownload({ variables: { os } }); } catch { /* ignore */ }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.iso')) { toast.error('Please select a valid .iso file'); return; }
    const MAX = 100 * 1024 * 1024 * 1024;
    if (file.size > MAX) { toast.error('ISO must be under 100 GB'); return; }

    const controller = new AbortController();
    uploadCtrl.current = controller;
    setUploading(true);
    setUploadPct(0);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('os', os);
      const res = await axios.post(`${BACKEND}/isoUpload`, form, {
        headers: {
          Authorization: (typeof localStorage !== 'undefined' && localStorage.getItem('token')) || '',
          'Content-Type': 'multipart/form-data',
        },
        signal: controller.signal,
        onUploadProgress: (e) => {
          if (e.total) setUploadPct(Math.round((e.loaded * 100) / e.total));
        },
      });
      if (res.status !== 200) throw new Error(res.data?.error || res.data);
      toast.success(`${label} ISO uploaded`);
      onChanged?.();
    } catch (err) {
      if (axios.isCancel?.(err) || err?.name === 'CanceledError') toast.info('Upload cancelled');
      else toast.error(`Upload failed: ${err?.response?.data?.error || err?.message || 'unknown error'}`);
    } finally {
      setUploading(false);
      setUploadPct(0);
      uploadCtrl.current = null;
    }
  };

  const handleRemove = async () => {
    if (!isoId) { toast.error('Could not find the ISO to remove — refresh and retry.'); return; }
    setBusy(true);
    try {
      await removeIso({ variables: { isoId } });
      toast.success(`${label} ISO removed`);
      onChanged?.();
    } catch (e) {
      toast.error(`Remove failed: ${e?.message || 'unknown error'}`);
    } finally {
      setBusy(false);
    }
  };

  const downloading = dl && ACTIVE_STATES.has(dl.state);
  const pct = dl && dl.totalBytes > 0 ? Math.round((dl.receivedBytes / dl.totalBytes) * 100) : 0;

  return (
    <Card className="p-4">
      <input
        ref={fileRef}
        type="file"
        accept=".iso"
        hidden
        onChange={(e) => { handleUpload(e.target.files?.[0]); e.target.value = ''; }}
      />

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {available ? <Badge tone="success">Installed</Badge> : <Badge tone="warning">Missing</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {available && (
            <Button size="sm" variant="destructive" loading={busy} disabled={busy || uploading || downloading} onClick={handleRemove}>
              Remove
            </Button>
          )}
          {!available && autoDownloadable && !downloading && (
            <Button size="sm" variant="primary" loading={busy} disabled={busy || uploading} onClick={handleAuto}>
              Auto-download
            </Button>
          )}
          {!downloading && (
            <Button size="sm" variant="secondary" disabled={uploading || busy} onClick={() => fileRef.current?.click()}>
              {available ? 'Replace…' : 'Upload…'}
            </Button>
          )}
        </div>
      </div>

      {/* Auto-download progress */}
      {downloading && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1">
            <Progress
              value={pct}
              indeterminate={dl.state === 'resolving' || dl.totalBytes === 0}
              tone="sky"
              label={
                dl.state === 'downloading'
                  ? `Downloading ${dl.totalBytes ? `${fmtBytes(dl.receivedBytes)} / ${fmtBytes(dl.totalBytes)}` : ''}`
                  : dl.state === 'resolving' ? 'Finding the latest image…'
                  : dl.state === 'verifying' ? 'Verifying checksum…'
                  : 'Registering…'
              }
              showValue={dl.state === 'downloading' && dl.totalBytes > 0}
            />
          </div>
          <Button size="sm" variant="destructive" onClick={handleCancelDownload}>Cancel</Button>
        </div>
      )}

      {/* Upload progress */}
      {uploading && (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1"><Progress value={uploadPct} showValue tone="sky" label="Uploading" /></div>
          <Button size="sm" variant="destructive" onClick={() => uploadCtrl.current?.abort()}>Cancel</Button>
        </div>
      )}

      {dl?.state === 'failed' && dl.error && (
        <div className="mt-2"><Alert tone="danger" size="sm" title="Download failed">{dl.error}</Alert></div>
      )}
    </Card>
  );
}

export default function IsoStep() {
  const { availableOS, checkStatus } = useSystemStatus({ checkOnMount: true });
  const { data: isosData, refetch: refetchIsos } = useQuery(AVAILABLE_ISOS, { fetchPolicy: 'cache-and-network' });

  const available = new Set((availableOS || []).map((s) => String(s).toUpperCase()));
  // Map os → iso id (for Remove). ISO.os is the raw stored value (lowercased here).
  const isoIdByOs = {};
  for (const iso of isosData?.availableISOs || []) {
    if (iso?.os) isoIdByOs[String(iso.os).toLowerCase()] = iso.id;
  }

  const onChanged = React.useCallback(async () => {
    await Promise.all([checkStatus(), refetchIsos()]);
  }, [checkStatus, refetchIsos]);

  return (
    <div className="space-y-4">
      <Alert tone="info" title="Operating system images">
        Install at least one OS image so you can create VMs. Ubuntu and Fedora can be
        auto-downloaded (checksum-verified) or uploaded; Windows must be uploaded. Wrong
        file? Remove it and try again. This step is optional — you can add ISOs later.
      </Alert>

      <div className="grid gap-3">
        {PICKABLE_OSES.map((o) => (
          <OsCard
            key={o.os}
            os={o.os}
            label={o.label}
            autoDownloadable={o.autoDownloadable}
            available={available.has(o.os.toUpperCase())}
            isoId={isoIdByOs[o.os]}
            onChanged={onChanged}
          />
        ))}
      </div>
    </div>
  );
}
