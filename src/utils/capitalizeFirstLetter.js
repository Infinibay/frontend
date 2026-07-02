export function capitalizeFirstLetter(string) {
  // Guard first: without this, null/undefined input yields `undefined + undefined`
  // === NaN, which renders as the literal string 'NaN'.
  if (!string || typeof string !== 'string') return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
