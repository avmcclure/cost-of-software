import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import calculateROI, { humanizeSeconds } from '../utils/recoup';
import { TimeUnit } from '../utils/time-unit';

export default function IndexPage() {
  const [freqValue, setFreqValue] = useState(5);
  const [freqUnit, setFreqUnit] = useState(TimeUnit.DAYS);
  const [durationValue, setDurationValue] = useState(10);
  const [durationUnit, setDurationUnit] = useState(TimeUnit.MINUTES);
  const [optValue, setOptValue] = useState(5);
  const [optUnit, setOptUnit] = useState(TimeUnit.MINUTES);
  const [savingValue, setSavingValue] = useState(9);
  const [savingUnit, setSavingUnit] = useState(TimeUnit.MINUTES);

  const results = useMemo(() => {
    return calculateROI({
      freqValue,
      freqUnit,
      optValue,
      optUnit,
      savingValue,
      savingUnit,
    });
  }, [
    freqValue,
    freqUnit,
    durationValue,
    durationUnit,
    optValue,
    optUnit,
    savingValue,
    savingUnit,
  ]);

  const freqUnits = [
    { label: 'year', value: TimeUnit.YEARS },
    { label: 'month', value: TimeUnit.MONTHS },
    { label: 'week', value: TimeUnit.WEEKS },
    { label: 'day', value: TimeUnit.DAYS },
    { label: 'hour', value: TimeUnit.HOURS },
    { label: 'minute', value: TimeUnit.MINUTES },
  ];
  const timeUnits = [TimeUnit.SECONDS, TimeUnit.MINUTES, TimeUnit.HOURS, TimeUnit.DAYS];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800">Process Optimization ROI Calculator</h1>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>My process runs</span>
            <input type="number" className="border rounded p-2 w-20" value={freqValue} min="0" onChange={(e) => setFreqValue(parseFloat(e.target.value) || 0)} />
            <span>times a</span>
            <select className="border rounded p-2" value={freqUnit} onChange={(e) => setFreqUnit(e.target.value)}>
              {freqUnits.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>It takes</span>
            <input type="number" className="border rounded p-2 w-20" value={durationValue} min="0" onChange={(e) => setDurationValue(parseFloat(e.target.value) || 0)} />
            <select className="border rounded p-2" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value)}>
              {timeUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            <span>per run</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>I want to reduce the runtime by</span>
            <input type="number" className="border rounded p-2 w-20" value={savingValue} min="0" onChange={(e) => setSavingValue(parseFloat(e.target.value) || 0)} />
            <select className="border rounded p-2" value={savingUnit} onChange={(e) => setSavingUnit(e.target.value)}>
              {timeUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span>I will work on it for</span>
            <input type="number" className="border rounded p-2 w-20" value={optValue} min="0" onChange={(e) => setOptValue(parseFloat(e.target.value) || 0)} />
            <select className="border rounded p-2" value={optUnit} onChange={(e) => setOptUnit(e.target.value)}>
              {timeUnits.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="bg-blue-50 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          {results.roi === null ? (
            <p>{results.message}</p>
          ) : (
            <>
              <p className="mt-2"><strong>Runs until positive ROI:</strong> {results.minRunsForPositiveROI}</p>
              <p className="mt-1"><strong>Days until positive ROI:</strong> {results.daysUntilPositiveROI !== null ? results.daysUntilPositiveROI.toFixed(2) : 'N/A'}</p>
              <table className="table-auto w-full mt-4 bg-white rounded shadow">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Time since</th>
                    <th className="px-2 py-1 text-right">Time Saved</th>
                    <th className="px-2 py-1 text-right">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearly.map((y) => (
                    <tr key={y.label}>
                      <td className="px-2 py-1">{y.label}</td>
                      <td className="px-2 py-1 text-right">{humanizeSeconds(y.totalSaved)}</td>
                      <td className="px-2 py-1 text-right">{(y.roi * 100).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
        {results.chartData.length > 0 && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value, name, props) => {
                  if (name === 'ROI') {
                    return [`${(value * 100).toFixed(2)}%`, name];
                  }
                  return [value, name];
                }} />
                <Legend />
                <Line type="monotone" dataKey="gross" stroke="#4f46e5" name="Gross Saved (hrs)" />
                <Line type="monotone" dataKey="net" stroke="#10b981" name="Net Saved (hrs)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
