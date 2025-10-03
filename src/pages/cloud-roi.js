import React, { useState } from 'react';
import Header from '../components/Header';
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

export default function CloudROICalculator() {
  const [inputs, setInputs] = useState({
    environments: 1,
    a_costPerMonth: '100',
    a_hoursWorked: '8',
    a_costPerHour: '200',
    b_costPerMonth: '20',
    b_hoursWorked: '80',
    b_costPerHour: '200',
  });

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  function monthlyTotal(
    costPerMonth,
    hoursWorked,
    costPerHour,
    month,
    environments
  ) {
    const recurring = Number(costPerMonth) * month * Number(environments);
    const oneTime = Number(hoursWorked) * Number(costPerHour);
    return recurring + oneTime;
  }

  const horizons = [1, 3, 6, 12, 24, 36, 60, 120];
  const yearTicks = Array.from({ length: 10 }, (_, i) => (i + 1) * 12);
  const initialPoint = {
    month: 0,
    solutionA: monthlyTotal(
      inputs.a_costPerMonth,
      inputs.a_hoursWorked,
      inputs.a_costPerHour,
      0,
      inputs.environments
    ),
    solutionB: monthlyTotal(
      inputs.b_costPerMonth,
      inputs.b_hoursWorked,
      inputs.b_costPerHour,
      0,
      inputs.environments
    ),
  };
  const chartData = [
    initialPoint,
    ...yearTicks.map((month) => ({
      month,
      solutionA: monthlyTotal(
        inputs.a_costPerMonth,
        inputs.a_hoursWorked,
        inputs.a_costPerHour,
        month,
        inputs.environments
      ),
      solutionB: monthlyTotal(
        inputs.b_costPerMonth,
        inputs.b_hoursWorked,
        inputs.b_costPerHour,
        month,
        inputs.environments
      ),
    })),
  ];

  function humanizeMonth(month) {
    if (month % 12 === 0) {
      const years = month / 12;
      return years === 1 ? '1 year' : `${years} years`;
    }
    return `${month} month${month > 1 ? 's' : ''}`;
  }
  const tableData = horizons.map((month) => {
    return {
      month,
      label: humanizeMonth(month),
      solutionA: monthlyTotal(
        inputs.a_costPerMonth,
        inputs.a_hoursWorked,
        inputs.a_costPerHour,
        month,
        inputs.environments
      ),
      solutionB: monthlyTotal(
        inputs.b_costPerMonth,
        inputs.b_hoursWorked,
        inputs.b_costPerHour,
        month,
        inputs.environments
      ),
    };
  });

  function findIntersectionContinuous() {
    let prevA = monthlyTotal(
      inputs.a_costPerMonth,
      inputs.a_hoursWorked,
      inputs.a_costPerHour,
      0,
      inputs.environments
    );
    let prevB = monthlyTotal(
      inputs.b_costPerMonth,
      inputs.b_hoursWorked,
      inputs.b_costPerHour,
      0,
      inputs.environments
    );
    let prevDiff = prevA - prevB;
    for (let month = 1; month <= 12000; month++) {
      const costA = monthlyTotal(
        inputs.a_costPerMonth,
        inputs.a_hoursWorked,
        inputs.a_costPerHour,
        month,
        inputs.environments
      );
      const costB = monthlyTotal(
        inputs.b_costPerMonth,
        inputs.b_hoursWorked,
        inputs.b_costPerHour,
        month,
        inputs.environments
      );
      const diff = costA - costB;
      if ((prevDiff < 0 && diff >= 0) || (prevDiff > 0 && diff <= 0)) {
        return {
          month,
          prevCheaper: prevDiff < 0 ? 'Solution A' : 'Solution B',
          nextCheaper: diff < 0 ? 'Solution A' : 'Solution B',
        };
      }
      prevDiff = diff;
    }
    return null;
  }

  function humanizeIntersection(month) {
    if (month === 0) return 'Now';
    if (!month && month !== 0) return null;
    const years = Math.floor(month / 12);
    const months = month % 12;
    const parts = [];
    if (years) parts.push(years === 1 ? '1 year' : `${years} years`);
    if (months) parts.push(months === 1 ? '1 month' : `${months} months`);
    return parts.join(' and ');
  }

  const intersectionContinuous = findIntersectionContinuous();
  let intersectionMessage;
  if (intersectionContinuous) {
    const intersectionLabel = humanizeIntersection(
      intersectionContinuous.month
    );
    intersectionMessage = `${intersectionContinuous.prevCheaper} is cheaper for ${intersectionLabel}, then ${intersectionContinuous.nextCheaper} is cheaper.`;
  } else {
    const finalA = monthlyTotal(
      inputs.a_costPerMonth,
      inputs.a_hoursWorked,
      inputs.a_costPerHour,
      12000,
      inputs.environments
    );
    const finalB = monthlyTotal(
      inputs.b_costPerMonth,
      inputs.b_hoursWorked,
      inputs.b_costPerHour,
      12000,
      inputs.environments
    );
    if (finalA < finalB) {
      intersectionMessage = 'Solution A is always cheaper within 1000 years.';
    } else if (finalB < finalA) {
      intersectionMessage = 'Solution B is always cheaper within 1000 years.';
    } else {
      intersectionMessage = 'Both solutions have the same cost for 1000 years.';
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Cloud ROI</h1>
          <form className="flex flex-col gap-4">
            <div className="flex items-center mb-4">
              <label
                className="block text-gray-600 mr-2"
                htmlFor="environments"
              >
                Number of environments:
              </label>
              <input
                type="number"
                id="environments"
                name="environments"
                min="1"
                value={inputs.environments}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="font-semibold text-gray-700 mb-2">Solution A</h2>
                <label className="block text-gray-600">Cost per month</label>
                <input
                  type="number"
                  name="a_costPerMonth"
                  value={inputs.a_costPerMonth}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
                <label className="block text-gray-600">
                  Hours worked (one-time)
                </label>
                <input
                  type="number"
                  name="a_hoursWorked"
                  value={inputs.a_hoursWorked}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
                <label className="block text-gray-600">
                  Cost per hour worked
                </label>
                <input
                  type="number"
                  name="a_costPerHour"
                  value={inputs.a_costPerHour}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
              </div>
              <div>
                <h2 className="font-semibold text-gray-700 mb-2">Solution B</h2>
                <label className="block text-gray-600">Cost per month</label>
                <input
                  type="number"
                  name="b_costPerMonth"
                  value={inputs.b_costPerMonth}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
                <label className="block text-gray-600">
                  Hours worked (one-time)
                </label>
                <input
                  type="number"
                  name="b_hoursWorked"
                  value={inputs.b_hoursWorked}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
                <label className="block text-gray-600">
                  Cost per hour worked
                </label>
                <input
                  type="number"
                  name="b_costPerHour"
                  value={inputs.b_costPerHour}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 mb-2"
                />
              </div>
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <div className="text-blue-700 font-semibold mb-2">
              {intersectionMessage}
            </div>
            <div className="text-gray-700 font-semibold mb-2">
              Total cost over time
            </div>
            <table className="w-full text-sm mb-2 table-fixed">
              <thead>
                <tr>
                  <th className="text-left pr-4" style={{ width: '45%' }}>
                    Time Deployed
                  </th>
                  <th className="text-right pr-2" style={{ width: '27.5%' }}>
                    Solution A
                  </th>
                  <th className="text-right" style={{ width: '27.5%' }}>
                    Solution B
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((row) => (
                  <tr key={row.month}>
                    <td className="text-left pr-4">{row.label}</td>
                    <td className="text-right pr-2">
                      ${row.solutionA.toFixed(2)}
                    </td>
                    <td className="text-right">${row.solutionB.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 4, right: 24, left: 16, bottom: 48 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="month"
                  label={{
                    value: 'Years',
                    position: 'insideBottom',
                    offset: -6,
                    style: {
                      textAnchor: 'middle',
                      fontWeight: 600,
                      fontSize: 13,
                      fill: '#374151',
                    },
                  }}
                  tickFormatter={(tick) => Math.round(tick / 12)}
                  ticks={[0, ...yearTicks]}
                  domain={[0, 120]}
                  type="number"
                  allowDecimals={false}
                  interval={0}
                  height={28}
                  tickMargin={6}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <YAxis
                  label={{
                    value: 'Cost',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 8,
                    style: {
                      textAnchor: 'middle',
                      fontWeight: 600,
                      fontSize: 13,
                      fill: '#374151',
                    },
                  }}
                  tickFormatter={(value) => {
                    if (Math.abs(value) >= 1000000)
                      return `$${(value / 1000000).toFixed(1)}M`;
                    if (Math.abs(value) >= 1000)
                      return `$${(value / 1000).toFixed(0)}k`;
                    return `$${value.toFixed(0)}`;
                  }}
                  tickCount={6}
                  width={80}
                  domain={[0, 'dataMax']}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  labelFormatter={(label) => {
                    if (label === 0) return 'Now';
                    const years = label / 12;
                    return years === 1 ? '1 year' : `${years} years`;
                  }}
                  isAnimationActive={false}
                  allowEscapeViewBox={{ x: true, y: true }}
                  cursor={{ stroke: '#8884d8', strokeWidth: 2 }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  height={16}
                  wrapperStyle={{ paddingTop: 6 }}
                  formatter={(value) => (
                    <span style={{ color: '#374151', fontSize: 13 }}>
                      {value}
                    </span>
                  )}
                />
                <Line
                  type="monotone"
                  dataKey="solutionA"
                  stroke="#2563eb"
                  name="Solution A"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="solutionB"
                  stroke="#16a34a"
                  name="Solution B"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
