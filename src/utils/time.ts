/**
 * Time formatting utilities
 */

export const formatMinutes = (minutes: number): string => {
  if (minutes == null || isNaN(minutes as any)) return '-';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};
