/**
 * Adapters between backend shape and UI vocabulary.
 *
 * The backend exposes `Machine` / `MachineTemplate`; UI speaks in
 * `Desktop` / `Blueprint` (see lib/vocab.ts and
 * docs/design/harbor_design_guidelines.md §2).
 *
 * These adapters are a thin read-layer only: they attach UI-friendly aliases
 * while leaving the original fields in place. Write paths continue to use the
 * backend names since GraphQL mutations still speak `Machine`/`Template`.
 *
 * Keep adapters pure, idempotent, and null-safe.
 */

export interface BackendMachine {
  id: string;
  name: string;
  status?: string | null;
  [key: string]: unknown;
}

export interface Desktop extends BackendMachine {
  /** UI alias — same value as `name`, kept for readability in templated copy. */
  displayName: string;
}

export function machineToDesktop<T extends BackendMachine>(m: T | null | undefined): (T & { displayName: string }) | null {
  if (!m) return null;
  return { ...m, displayName: m.name };
}

export interface BackendMachineTemplate {
  id: string;
  name: string;
  description?: string | null;
  cores?: number;
  ram?: number;
  storage?: number;
  [key: string]: unknown;
}

export interface Blueprint extends BackendMachineTemplate {
  displayName: string;
}

export function templateToBlueprint<T extends BackendMachineTemplate>(
  t: T | null | undefined,
): (T & { displayName: string }) | null {
  if (!t) return null;
  return { ...t, displayName: t.name };
}

export function machinesToDesktops<T extends BackendMachine>(ms: readonly T[] | null | undefined) {
  return (ms ?? []).map((m) => machineToDesktop(m)!);
}

export function templatesToBlueprints<T extends BackendMachineTemplate>(
  ts: readonly T[] | null | undefined,
) {
  return (ts ?? []).map((t) => templateToBlueprint(t)!);
}
