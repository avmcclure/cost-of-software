// Returns a value clamped between min and max
export default function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
