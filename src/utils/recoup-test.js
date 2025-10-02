import { describe, it, expect } from 'vitest';
import calculateRecoup, { humanizeSeconds } from './recoup';
import { TimeUnit } from './timeUnit';
import { UNIT_SECONDS } from './unitSeconds';

describe('humanizeSeconds', () => {
  it('returns Never recoup for non-finite values', () => {
    expect(humanizeSeconds(Infinity)).toBe('Never recoup');
  });

  it('returns 0 seconds for non-positive inputs', () => {
    expect(humanizeSeconds(0)).toBe('0 seconds');
    expect(humanizeSeconds(-10)).toBe('0 seconds');
  });

  it('formats hours/minutes/seconds correctly', () => {
    // 1h 1m 1s = 3600 + 60 + 1 = 3661
    expect(humanizeSeconds(3661)).toBe('1h 1m 1s');
  });
});

describe('calculateRecoup', () => {
  it('returns Infinity recoup when frequency or savings are zero', () => {
    const res = calculateRecoup({
      freqValue: 0,
      freqUnit: TimeUnit.DAYS,
      optValue: 1,
      optUnit: TimeUnit.HOURS,
      savingValue: 0,
      savingUnit: TimeUnit.MINUTES,
    });
    expect(res.recoup).toBe(Infinity);
    expect(res.message).toMatch(/Never recoup/);
  });

  const freqUnits = [
    TimeUnit.YEARS,
    TimeUnit.MONTHS,
    TimeUnit.WEEKS,
    TimeUnit.DAYS,
    TimeUnit.HOURS,
    TimeUnit.MINUTES,
  ];
  freqUnits.forEach((unit) => {
    it(`calculates recoup for frequency unit: ${unit}`, () => {
      const fv = 3;
      const ov = 1;
      const optUnit = TimeUnit.HOURS;
      const sv = 5;
      const savingUnit = TimeUnit.MINUTES;
      const res = calculateRecoup({
        freqValue: fv,
        freqUnit: unit,
        optValue: ov,
        optUnit,
        savingValue: sv,
        savingUnit,
      });
      const optSeconds = ov * UNIT_SECONDS[optUnit];
      const savingPerSecond =
        (fv / UNIT_SECONDS[unit]) * (sv * UNIT_SECONDS[savingUnit]);
      const expectedRecoup = optSeconds / savingPerSecond;
      expect(res.recoup).toBeCloseTo(expectedRecoup, 4);
    });
  });

  it('calculates recoup and chart/yearly data for sample inputs', () => {
    const fv = 1; // times per day
    const ov = 1;
    const optUnit = TimeUnit.HOURS;
    const sv = 5;
    const savingUnit = TimeUnit.MINUTES;

    const res = calculateRecoup({
      freqValue: fv,
      freqUnit: TimeUnit.DAYS,
      optValue: ov,
      optUnit,
      savingValue: sv,
      savingUnit,
    });

    const optSeconds = ov * UNIT_SECONDS[optUnit];
    const savingPerSecond =
      (fv / UNIT_SECONDS.days) * (sv * UNIT_SECONDS[savingUnit]);
    const expectedRecoup = optSeconds / savingPerSecond;

    // numeric check
    expect(res.recoup).toBeCloseTo(expectedRecoup, 4);

    // structure checks
    expect(Array.isArray(res.chartData)).toBe(true);
    expect(res.chartData.length).toBe(11);
    expect(Array.isArray(res.yearly)).toBe(true);
    expect(res.yearly.length).toBe(3);
    expect(res.yearly[0].years).toBe(1);
  });
});
