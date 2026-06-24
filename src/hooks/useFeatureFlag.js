'use client';

import { useSelector } from 'react-redux';
import { FEATURE_FLAG_DEFAULTS } from '@/config/featureFlags';

/**
 * Effective boolean value for a feature flag.
 *
 * Resolution order: the backend-provided flag (state.featureFlags.flags[key]),
 * then the code-side FEATURE_FLAG_DEFAULTS[key], then false. This keeps
 * unimplemented features hidden by default and fail-safe before the flags
 * have been fetched.
 */
export default function useFeatureFlag(key) {
  return useSelector((state) => {
    const flags = state.featureFlags?.flags;
    if (flags && key in flags) return !!flags[key];
    return !!FEATURE_FLAG_DEFAULTS[key];
  });
}
