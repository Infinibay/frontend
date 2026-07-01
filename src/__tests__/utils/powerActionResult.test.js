// Unit tests for getPowerActionError (utils/powerActionResult.js).
//
// Regression: the desktop power controls used to `await powerOnMutation()` and
// then unconditionally show a green "started successfully" toast. Apollo does
// NOT throw when a resolver returns `{ success: false, message }`, so a VM that
// failed to boot (e.g. QEMU "failed to initialize spice server") was reported to
// the user as a success. This helper is the guard that turns an explicit
// success:false payload into a surfaced error.

import { describe, it, expect } from 'vitest';
import { getPowerActionError } from '@/utils/powerActionResult';

describe('getPowerActionError', () => {
  it('returns the server message when powerOn reports success:false (the real bug)', () => {
    const data = { powerOn: { success: false, message: 'failed to initialize spice server' } };
    expect(getPowerActionError('start', data)).toBe('failed to initialize spice server');
  });

  it('returns the server message when powerOff reports success:false', () => {
    const data = { powerOff: { success: false, message: 'VM process still alive' } };
    expect(getPowerActionError('stop', data)).toBe('VM process still alive');
  });

  it('returns null on a genuine success (no false alarm)', () => {
    expect(getPowerActionError('start', { powerOn: { success: true, message: 'Machine running' } })).toBeNull();
    expect(getPowerActionError('stop', { powerOff: { success: true, message: 'Machine off' } })).toBeNull();
  });

  it('falls back to a generic message when success:false but message is empty/missing', () => {
    expect(getPowerActionError('start', { powerOn: { success: false, message: '' } }))
      .toBe('Failed to start the desktop.');
    expect(getPowerActionError('start', { powerOn: { success: false } }))
      .toBe('Failed to start the desktop.');
    expect(getPowerActionError('stop', { powerOff: { success: false, message: '   ' } }))
      .toBe('Failed to stop the desktop.');
  });

  it('returns null for absent/malformed payloads (leaves those to the network-error path)', () => {
    expect(getPowerActionError('start', undefined)).toBeNull();
    expect(getPowerActionError('start', null)).toBeNull();
    expect(getPowerActionError('start', {})).toBeNull();
    expect(getPowerActionError('start', { powerOn: null })).toBeNull();
  });

  it('reads the field matching the action, not the other one', () => {
    // A failed stop must not be masked by a stale/other powerOn field, and vice-versa.
    const data = { powerOn: { success: true }, powerOff: { success: false, message: 'nope' } };
    expect(getPowerActionError('start', data)).toBeNull();
    expect(getPowerActionError('stop', data)).toBe('nope');
  });

  it('returns null for an unknown action', () => {
    expect(getPowerActionError('restart', { powerOn: { success: false, message: 'x' } })).toBeNull();
  });
});
