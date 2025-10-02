// Calculation utilities for recoup time
import { TimeUnit } from './time-unit';
import { UnitSeconds } from './unit-seconds';

export function humanizeSeconds(seconds) {
  if (!isFinite(seconds)) return 'Never recoup';
  if (seconds <= 0) return '0 seconds';

  let s = Math.floor(seconds);
  const years = Math.floor(s / UnitSeconds[TimeUnit.YEARS]);
  s %= UnitSeconds[TimeUnit.YEARS];
  const months = Math.floor(s / UnitSeconds[TimeUnit.MONTHS]);
  s %= UnitSeconds[TimeUnit.MONTHS];
  const days = Math.floor(s / UnitSeconds[TimeUnit.DAYS]);
  s %= UnitSeconds[TimeUnit.DAYS];
  const hours = Math.floor(s / UnitSeconds[TimeUnit.HOURS]);
  s %= UnitSeconds[TimeUnit.HOURS];
  const minutes = Math.floor(s / UnitSeconds[TimeUnit.MINUTES]);
  const secs = s % UnitSeconds[TimeUnit.MINUTES];

  const parts = [];
  if (years) parts.push(`${years}y`);
  if (months) parts.push(`${months}mo`);
  if (days) parts.push(`${days}d`);
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (secs) parts.push(`${secs}s`);
  return parts.join(' ');
}

export default function calculateROI({
  freqValue,
  freqUnit,
  optValue,
  optUnit,
  savingValue,
  savingUnit,
}) {
  // sanitize numeric input
  const fv = Number.isFinite(Number(freqValue)) ? Number(freqValue) : 0;
  const ov = Number.isFinite(Number(optValue)) ? Number(optValue) : 0;
  const sv = Number.isFinite(Number(savingValue)) ? Number(savingValue) : 0;

  if (!UnitSeconds[freqUnit] || fv <= 0 || sv <= 0) {
    return {
      roi: null,
      message: 'Invalid frequency or savings',
      yearly: [],
      chartData: [],
    };
  }
  const freqPerSecond = fv / UnitSeconds[freqUnit];
  const optSeconds = ov * UnitSeconds[optUnit];
  const saveSeconds = sv * UnitSeconds[savingUnit];

  if (
    !(isFinite(freqPerSecond) && freqPerSecond > 0) ||
    !(isFinite(saveSeconds) && saveSeconds > 0)
  ) {
    return {
      roi: null,
      message: 'No frequency or no savings',
      yearly: [],
      chartData: [],
    };
  }

  const savingPerSecond = freqPerSecond * saveSeconds;
  if (!(isFinite(savingPerSecond) && savingPerSecond > 0)) {
    return {
      roi: null,
      message: 'No effective savings',
      yearly: [],
      chartData: [],
    };
  }

  // ROI for each horizon: (totalSaved - optSeconds) / optSeconds
  const horizons = [
    { years: 1 / 12, label: '1 month', months: 1 },
    { years: 3 / 12, label: '3 months', months: 3 },
    { years: 6 / 12, label: '6 months', months: 6 },
    { years: 1, label: '1 year', months: 12 },
    { years: 5, label: '5 years', months: 60 },
    { years: 10, label: '10 years', months: 120 },
  ];
  const yearly = horizons.map((h) => {
    const totalSaved = h.years * UnitSeconds[TimeUnit.YEARS] * savingPerSecond;
    const net = totalSaved - optSeconds;
    const roi = optSeconds > 0 ? net / optSeconds : null;
    return { label: h.label, years: h.years, totalSaved, net, roi };
  });

  const chartData = Array.from({ length: 11 }, (_, i) => {
    const totalSaved = i * UnitSeconds[TimeUnit.YEARS] * savingPerSecond;
    const net = totalSaved - optSeconds;
    const roi = optSeconds > 0 ? net / optSeconds : null;
    return {
      year: i,
      gross: totalSaved / 3600,
      net: net / 3600,
      roi,
    };
  });

  // ROI for 1 year horizon
  const roi = yearly[3].roi;

  // Calculate minimum runs for positive ROI
  let minRunsForPositiveROI = null;
  let daysUntilPositiveROI = null;
  if (optSeconds > 0 && saveSeconds > 0 && fv > 0 && UnitSeconds[freqUnit] > 0) {
    minRunsForPositiveROI = Math.ceil(optSeconds / saveSeconds);
    // Calculate days until positive ROI
    const runsPerDay = UnitSeconds[TimeUnit.DAYS] / UnitSeconds[freqUnit] * fv;
    daysUntilPositiveROI = minRunsForPositiveROI / runsPerDay;
    if (!isFinite(daysUntilPositiveROI) || daysUntilPositiveROI < 0) daysUntilPositiveROI = null;
  }

  return {
    roi,
    message:
      roi === null
        ? 'Never recoup (invalid or zero investment)'
        : `ROI after 1 year: ${(roi * 100).toFixed(2)}%`,
    yearly,
    chartData,
    minRunsForPositiveROI,
    daysUntilPositiveROI,
  };
}
