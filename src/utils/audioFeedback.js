/**
 * Audio Feedback Utility
 * Provides accessible audio feedback for user interactions
 */

/**
 * Play a low-frequency error tone (200Hz)
 * Used for subtle negative feedback (e.g., disabled actions)
 *
 * @param {Object} options - Audio options
 * @param {number} options.frequency - Tone frequency in Hz (default: 200)
 * @param {number} options.duration - Duration in seconds (default: 0.15)
 * @param {number} options.volume - Volume level 0-1 (default: 0.15)
 */
export const playErrorTone = (options = {}) => {
  const {
    frequency = 200,
    duration = 0.15,
    volume = 0.15
  } = options;

  if (typeof window === 'undefined') return;

  try {
    // Check for AudioContext support (including Safari's webkitAudioContext)
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Low frequency tone for a subtle, deep sound
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine'; // Smooth sine wave

    // Volume envelope: fade in/out for smoothness
    const fadeInDuration = duration * 0.33; // First third for fade in
    const fadeOutStart = duration * 0.67; // Last third for fade out

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + fadeInDuration);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (err) {
    // Silently ignore audio errors (e.g., autoplay policy, unsupported browsers)
  }
};

/**
 * Play a success/confirmation tone (higher pitch)
 *
 * @param {Object} options - Audio options
 */
export const playSuccessTone = (options = {}) => {
  const {
    frequency = 600,
    duration = 0.1,
    volume = 0.12
  } = options;

  playErrorTone({ frequency, duration, volume });
};

/**
 * Play a warning tone (medium pitch)
 *
 * @param {Object} options - Audio options
 */
export const playWarningTone = (options = {}) => {
  const {
    frequency = 400,
    duration = 0.12,
    volume = 0.15
  } = options;

  playErrorTone({ frequency, duration, volume });
};
