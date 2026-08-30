export function evaluateContact(values) {
  if (!values?.length) return "NO SIGNAL";
  const finite = values.filter(Number.isFinite);
  if (!finite.length) return "NO SIGNAL";
  return "REVIEW";
}
