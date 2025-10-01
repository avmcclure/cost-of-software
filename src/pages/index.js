import React, { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Conversion factors in seconds
const UNIT_SECONDS = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2629746, // avg month ~30.44 days
    years: 31556952, // avg year ~365.24 days
};

const units = Object.keys(UNIT_SECONDS);

const InputField = ({ label, value, onValueChange, unit, onUnitChange }) => (
    <div className="flex flex-col gap-1 w-full">
        <label className="font-medium text-gray-700">{label}</label>
        <div className="flex gap-2">
            <input
                type="number"
                className="border rounded p-2 w-2/3"
                value={value}
                min="0"
                onChange={(e) => onValueChange(Number(e.target.value))}
            />
            <select
                className="border rounded p-2 w-1/3"
                value={unit}
                onChange={(e) => onUnitChange(e.target.value)}
            >
                {units.map((u) => (
                    <option key={u} value={u}>{u}</option>
                ))}
            </select>
        </div>
    </div>
);

function humanizeSeconds(seconds) {
    if (seconds <= 0) return "0 seconds";
    const years = Math.floor(seconds / UNIT_SECONDS.years);
    seconds %= UNIT_SECONDS.years;
    const months = Math.floor(seconds / UNIT_SECONDS.months);
    seconds %= UNIT_SECONDS.months;
    const days = Math.floor(seconds / UNIT_SECONDS.days);
    seconds %= UNIT_SECONDS.days;
    const hours = Math.floor(seconds / UNIT_SECONDS.hours);
    seconds %= UNIT_SECONDS.hours;
    const minutes = Math.floor(seconds / UNIT_SECONDS.minutes);
    seconds = Math.floor(seconds % UNIT_SECONDS.minutes);

    const parts = [];
    if (years) parts.push(`${years}y`);
    if (months) parts.push(`${months}mo`);
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds) parts.push(`${seconds}s`);
    return parts.join(" ");
}

export default function IndexPage() {
    const [freqValue, setFreqValue] = useState(1);
    const [freqUnit, setFreqUnit] = useState("days");
    const [durationValue, setDurationValue] = useState(30);
    const [durationUnit, setDurationUnit] = useState("minutes");
    const [optValue, setOptValue] = useState(8);
    const [optUnit, setOptUnit] = useState("hours");
    const [savingValue, setSavingValue] = useState(5);
    const [savingUnit, setSavingUnit] = useState("minutes");

    const results = useMemo(() => {
        const freqPerSecond = freqValue / UNIT_SECONDS[freqUnit];
        const optSeconds = optValue * UNIT_SECONDS[optUnit];
        const saveSeconds = savingValue * UNIT_SECONDS[savingUnit];

        if (freqPerSecond <= 0 || saveSeconds <= 0) {
            return {
                recoup: Infinity,
                message: "Never recoup (no frequency or no savings)",
                yearly: [],
                chartData: [],
            };
        }

        const savingPerSecond = freqPerSecond * saveSeconds;
        const recoupSeconds = optSeconds / savingPerSecond;

        const horizons = [1, 5, 10];
        const yearly = horizons.map((years) => {
            const totalSaved = years * UNIT_SECONDS.years * savingPerSecond;
            const net = totalSaved - optSeconds;
            return { years, totalSaved, net };
        });

        const chartData = Array.from({ length: 11 }, (_, i) => {
            const totalSaved = i * UNIT_SECONDS.years * savingPerSecond;
            return {
                year: i,
                gross: totalSaved / 3600,
                net: (totalSaved - optSeconds) / 3600,
            };
        });

        return {
            recoup: recoupSeconds,
            message: humanizeSeconds(recoupSeconds),
            yearly,
            chartData,
        };
    }, [freqValue, freqUnit, durationValue, durationUnit, optValue, optUnit, savingValue, savingUnit]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-6 flex flex-col gap-6">
                <h1 className="text-2xl font-bold text-gray-800">Recoup Time Calculator</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Frequency" value={freqValue} onValueChange={setFreqValue} unit={freqUnit} onUnitChange={setFreqUnit} />
                    <InputField label="Duration (per run)" value={durationValue} onValueChange={setDurationValue} unit={durationUnit} onUnitChange={setDurationUnit} />
                    <InputField label="Optimization time" value={optValue} onValueChange={setOptValue} unit={optUnit} onUnitChange={setOptUnit} />
                    <InputField label="Time savings (per run)" value={savingValue} onValueChange={setSavingValue} unit={savingUnit} onUnitChange={setSavingUnit} />
                </div>

                <div className="bg-blue-50 rounded p-4">
                    <h2 className="text-xl font-semibold mb-2">Results</h2>
                    {results.recoup === Infinity ? (
                        <p>{results.message}</p>
                    ) : (
                        <>
                            <p><strong>Recoup time:</strong> {results.message}</p>
                            <ul className="list-disc ml-6 mt-2">
                                {results.yearly.map((y) => (
                                    <li key={y.years}>
                                        After {y.years} year(s): saved {humanizeSeconds(y.totalSaved)} total, net {humanizeSeconds(y.net)}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>

                {results.chartData.length > 0 && (
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={results.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="year" label={{ value: "Years", position: "insideBottomRight", offset: -5 }} />
                                <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                                <Tooltip />
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