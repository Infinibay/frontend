'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogButtons,
  FormField,
  SegmentedControl,
  Select,
  TextField } from
'@infinibay/harbor';

import client from '@/apollo-client';
import { createDebugger } from '@/utils/debug';
import { CREATE_POOL, GOLDEN_IMAGES_FOR_POOLS } from './pools-gql';

const debug = createDebugger('frontend:pages:pools');

export function NewPoolDialog({ onClose, onCreated }) {
  const departments = useSelector((s) => s.departments?.items ?? []);
  const templates = useSelector((s) => s.templates?.items ?? []);
  const [name, setName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [goldenImageId, setGoldenImageId] = useState('');
  const [goldenImages, setGoldenImages] = useState([]);
  const [goldenImagesLoading, setGoldenImagesLoading] = useState(true);
  const [goldenImagesError, setGoldenImagesError] = useState(false);
  // PoolType enum wire value (uppercase key — see pool-helpers POOL_TYPE).
  const [type, setType] = useState('NON_PERSISTENT');
  const [sizeMin, setSizeMin] = useState('0');
  const [sizeMax, setSizeMax] = useState('10');
  const [idleTimeoutMinutes, setIdleTimeoutMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Clear a single field's error as the user edits it, so inline messages
  // disappear the moment they're addressed.
  const clearError = (...fields) =>
    setErrors((prev) => {
      if (!fields.some((f) => prev[f])) return prev;
      const next = { ...prev };
      fields.forEach((f) => delete next[f]);
      return next;
    });

  // Collect every field error at once (not first-failure-only) so the operator
  // sees all problems in one pass instead of a fix→submit→repeat loop.
  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!departmentId) e.departmentId = 'Department is required';
    if (!templateId) e.templateId = 'Blueprint is required';
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);
    if (!Number.isFinite(min)) e.sizeMin = 'Enter a number';
    else if (min < 0) e.sizeMin = 'Cannot be negative';
    if (!Number.isFinite(max)) e.sizeMax = 'Enter a number';
    else if (max < 1) e.sizeMax = 'Must be at least 1';
    if (Number.isFinite(min) && Number.isFinite(max) && min > max) {
      e.sizeMax = 'Min cannot exceed Max';
    }
    return e;
  };

  // Load published golden images so the operator can pin the pool to a
  // specific sealed base instead of inheriting the blueprint's default.
  const loadGoldenImages = useCallback(async () => {
    setGoldenImagesLoading(true);
    setGoldenImagesError(false);
    try {
      const { data } = await client.query({
        query: GOLDEN_IMAGES_FOR_POOLS,
        fetchPolicy: 'network-only'
      });
      setGoldenImages(data?.goldenImages ?? []);
    } catch (err) {
      debug.warn('golden images load', err);
      setGoldenImagesError(true);
    } finally {
      setGoldenImagesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoldenImages();
  }, [loadGoldenImages]);

  const handleSubmit = async () => {
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    const min = parseInt(sizeMin, 10);
    const max = parseInt(sizeMax, 10);

    setSubmitting(true);
    try {
      const { data } = await client.mutate({
        mutation: CREATE_POOL,
        variables: {
          input: {
            name: name.trim(),
            departmentId,
            templateId,
            goldenImageId: goldenImageId || null,
            type,
            sizeMin: min,
            sizeMax: max,
            idleTimeoutMinutes: idleTimeoutMinutes ? parseInt(idleTimeoutMinutes, 10) : null,
            resetOnLogoff: true
          }
        }
      });
      const res = data?.createPool;
      if (!res?.success) throw new Error(res?.error || 'create failed');
      toast.success(`Pool “${name}” created`);
      onCreated();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open onClose={submitting ? () => {} : onClose} size="lg">
      <DialogTitle>New Pool</DialogTitle>
      <DialogDescription>
        Group desktops sharing a blueprint and golden image, kept warm for instant hand-out.
      </DialogDescription>
      <DialogBody>
        <div className="flex flex-col gap-4">
          <FormField label="Name" required>
            <TextField
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
              error={errors.name}
              autoFocus />

          </FormField>
          <FormField label="Department" required error={errors.departmentId}>
            <Select
              value={departmentId}
              onChange={(v) => {
                setDepartmentId(v);
                clearError('departmentId');
              }}
              options={[
              { value: '', label: '— pick a department —' },
              ...departments.map((d) => ({ value: d.id, label: d.name }))]
              } />

          </FormField>
          <FormField label="Blueprint" required error={errors.templateId}>
            <Select
              value={templateId}
              onChange={(v) => {
                setTemplateId(v);
                clearError('templateId');
              }}
              options={[
              { value: '', label: '— pick a blueprint —' },
              ...templates.map((t) => ({ value: t.id, label: t.name }))]
              } />

          </FormField>
          <div className="flex flex-col gap-1.5">
            <Select
              label="Golden image (optional)"
              value={goldenImageId}
              onChange={setGoldenImageId}
              disabled={goldenImagesLoading}
              options={[
              { value: '', label: goldenImagesLoading ? 'Loading golden images…' : '— inherit from blueprint —' },
              ...goldenImages.
              filter((g) => String(g.status).toUpperCase() === 'PUBLISHED').
              map((g) => ({ value: g.id, label: `${g.name} · v${g.version} (${g.osType})` }))]
              } />
            {goldenImagesError ?
            <span className="text-xs text-[rgb(var(--harbor-danger))] inline-flex items-center gap-2">
                Couldn&apos;t load golden images.
                <button
                type="button"
                className="underline hover:no-underline"
                onClick={loadGoldenImages}>
                  Retry
                </button>
              </span> :
            null}
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm text-fg-muted">Type</span>
            <SegmentedControl
              value={type}
              onChange={setType}
              items={[
              { value: 'NON_PERSISTENT', label: 'Non-persistent' },
              { value: 'PERSISTENT', label: 'Persistent' }]
              } />

            <span className="text-xs text-fg-subtle">
              {type === 'PERSISTENT' ?
              'Each user keeps their own desktop and state across logoffs.' :
              'Any idle desktop is handed out and reset to the golden image on logoff.'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Min (kept warm)" required>
              <TextField
                type="number"
                min={0}
                value={sizeMin}
                onChange={(e) => {
                  setSizeMin(e.target.value);
                  clearError('sizeMin', 'sizeMax');
                }}
                error={errors.sizeMin} />

            </FormField>
            <FormField label="Max (cap)" required>
              <TextField
                type="number"
                min={1}
                value={sizeMax}
                onChange={(e) => {
                  setSizeMax(e.target.value);
                  clearError('sizeMin', 'sizeMax');
                }}
                error={errors.sizeMax} />

            </FormField>
          </div>
          <TextField
            label="Idle timeout (minutes)"
            type="number"
            placeholder="Empty = never"
            value={idleTimeoutMinutes}
            onChange={(e) => setIdleTimeoutMinutes(e.target.value)} />

        </div>
      </DialogBody>
      <DialogButtons align="end">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} loading={submitting}>Create pool</Button>
      </DialogButtons>
    </Dialog>);

}
