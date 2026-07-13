// Unit tests for RealTimeReduxService.handleGoldenImageEvent — the bridge that turns
// backend 'golden_images' Socket.IO lifecycle events into a header background-tasks
// entry so a build/capture shows in the tracker (with a stage-based percent + label)
// from any page.
//
// The real risk here is the event choreography, not the rendering:
//   - the backend fires 'update'(building) at start, a stream of 'progress' events
//     (each carrying progressPercent + a stage name), then 'update'(draft|failed);
//   - the two async emits have no guaranteed delivery order, so a late 'progress'
//     must not resurrect a task that a terminal 'update' already finished;
//   - a manual publish/deprecate also emits 'update' (status published|deprecated) and
//     must NOT spawn a phantom task.
// These tests pin all of that against the real backgroundTasks reducer.

import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import RealTimeReduxService from '@/services/realTimeReduxService';
import backgroundTasks, { selectBackgroundTasks } from '@/state/slices/backgroundTasks';

// Wrap a payload the way GoldenImageEventManager does on the wire.
const evt = (data) => ({ status: 'success', data });

function makeService() {
  const store = configureStore({ reducer: { backgroundTasks } });
  const service = new RealTimeReduxService(store);
  return { store, service };
}

const taskFor = (store, id) => store.getState().backgroundTasks.byId[`golden_image:${id}`];

describe('handleGoldenImageEvent', () => {
  let store;
  let service;

  beforeEach(() => {
    ({ store, service } = makeService());
  });

  it('opens a running task with the image name from update(building)', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'building' }));

    const t = taskFor(store, 'img1');
    expect(t).toMatchObject({ kind: 'golden_image', status: 'running', title: 'Building Win11 Base' });
  });

  it('drives the percent + human stage label from progress events', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'building' }));
    service.handleGoldenImageEvent('progress', evt({ id: 'img1', progressPercent: 55, step: 'sealing' }));

    const t = taskFor(store, 'img1');
    expect(t.progress).toBe(55);
    expect(t.detail).toBe('Sealing image'); // GOLDEN_IMAGE_STEPS['sealing']
    expect(t.status).toBe('running');
  });

  it('prettifies an unknown step and clamps the percent', () => {
    service.handleGoldenImageEvent('progress', evt({ id: 'img1', progressPercent: 140, step: 'weird_new_step' }));

    const t = taskFor(store, 'img1');
    expect(t.progress).toBe(100); // clamped
    expect(t.detail).toBe('Weird new step');
  });

  it('does not let a name-less progress event clobber the real title from update(building)', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Ubuntu Gold', status: 'building' }));
    service.handleGoldenImageEvent('progress', evt({ id: 'img1', progressPercent: 10, step: 'spawning_vm' }));

    expect(taskFor(store, 'img1').title).toBe('Building Ubuntu Gold');
  });

  it('finishes with success on update(draft) — the build terminal', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'building' }));
    service.handleGoldenImageEvent('progress', evt({ id: 'img1', progressPercent: 85, step: 'promoting_disk' }));
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'draft' }));

    const t = taskFor(store, 'img1');
    expect(t).toMatchObject({ status: 'success', progress: 100, detail: 'Image ready' });
  });

  it('finishes with error and the reason on update(failed), stripping the notes prefix', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'building' }));
    service.handleGoldenImageEvent('update', evt({
      id: 'img1', name: 'Win11 Base', status: 'failed',
      notes: '[build failed] agent never connected',
    }));

    const t = taskFor(store, 'img1');
    expect(t.status).toBe('error');
    expect(t.error).toBe('agent never connected');
  });

  it('ignores publish/deprecate updates — they are not builds (no phantom task)', () => {
    service.handleGoldenImageEvent('update', evt({ id: 'old', name: 'Old Image', status: 'published' }));
    service.handleGoldenImageEvent('update', evt({ id: 'old2', name: 'Older', status: 'deprecated' }));

    expect(selectBackgroundTasks(store.getState())).toHaveLength(0);
  });

  it('does not resurrect a finished task when a late progress arrives after the terminal update', () => {
    // Delivery order across the two async backend emits is not guaranteed: the terminal
    // update(draft) can land before the final progress(100, "draft").
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'building' }));
    service.handleGoldenImageEvent('update', evt({ id: 'img1', name: 'Win11 Base', status: 'draft' }));
    service.handleGoldenImageEvent('progress', evt({ id: 'img1', progressPercent: 100, step: 'draft' }));

    expect(taskFor(store, 'img1').status).toBe('success'); // still terminal, not 'running'
  });

  it('ignores malformed events (no id)', () => {
    service.handleGoldenImageEvent('progress', evt({ progressPercent: 10, step: 'sealing' }));
    service.handleGoldenImageEvent('update', evt(null));
    expect(selectBackgroundTasks(store.getState())).toHaveLength(0);
  });
});
