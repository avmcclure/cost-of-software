import React, { useState } from 'react';
import clamp from '../utils/clamp';
import WeightedScoringTable from './WeightedScoringTable';

const initialSolutions = ['Solution 1', 'Solution 2'];
const initialCriteria = [
  { name: 'Monetary', weight: 20 },
  { name: 'Time', weight: 20 },
  { name: 'Knowledge', weight: 20 },
  { name: 'Safety', weight: 20 },
  { name: 'Satisfaction', weight: 20 },
];

function WeightedScoringPanel() {
  const [solutions, setSolutions] = useState(initialSolutions);
  const [criteria, setCriteria] = useState(initialCriteria);
  const [ratings, setRatings] = useState(() =>
    criteria.map(() => solutions.map(() => 1))
  );
  const [isEditable, setIsEditable] = useState(true);

  const addSolution = () => {
    setSolutions([...solutions, `Solution ${solutions.length + 1}`]);
    setRatings(ratings.map((row) => [...row, 1]));
  };

  const removeSolution = (idx) => {
    if (solutions.length <= 2) return;
    setSolutions(solutions.filter((_, i) => i !== idx));
    setRatings(ratings.map((row) => row.filter((_, i) => i !== idx)));
  };

  const editSolution = (idx, name) => {
    setSolutions(solutions.map((sol, i) => (i === idx ? name : sol)));
  };

  const addCriterion = () => {
    setCriteria([
      ...criteria,
      { name: `Criterion ${criteria.length + 1}`, weight: 0 },
    ]);
    setRatings([...ratings, solutions.map(() => 1)]);
  };

  const removeCriterion = (idx) => {
    if (criteria.length <= 2) return;
    setCriteria(criteria.filter((_, i) => i !== idx));
    setRatings(ratings.filter((_, i) => i !== idx));
  };

  const editCriterion = (idx, name) => {
    setCriteria(criteria.map((c, i) => (i === idx ? { ...c, name } : c)));
  };

  const editWeight = (idx, weight) => {
    weight = clamp(Number(weight), 0, 100);
    const otherTotal = criteria.reduce(
      (sum, c, i) => (i === idx ? sum : sum + c.weight),
      0
    );
    if (otherTotal + weight > 100) return;
    setCriteria(criteria.map((c, i) => (i === idx ? { ...c, weight } : c)));
  };

  const editRating = (cIdx, sIdx, value) => {
    value = clamp(Number(value), 1, 10);
    setRatings(
      ratings.map((row, i) =>
        i === cIdx ? row.map((r, j) => (j === sIdx ? value : r)) : row
      )
    );
  };

  const totalWeight = () => criteria.reduce((sum, c) => sum + c.weight, 0);

  const isWeightValid = totalWeight() === 100;
  const scores = isWeightValid
    ? solutions.map((_, sIdx) =>
        criteria.reduce(
          (sum, c, cIdx) => sum + (ratings[cIdx][sIdx] * c.weight) / 100,
          0
        )
      )
    : solutions.map(() => null);
  const bestScore = isWeightValid ? Math.max(...scores) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Weighted Scoring Model
        </h1>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={!isEditable}
            onChange={() => setIsEditable((v) => !v)}
          />
          <span className="text-gray-700">Presentation mode</span>
        </label>
        <p className="text-gray-600 mb-4">
          Compare solutions using weighted criteria. Edit names, weights, and
          ratings inline. The best solution is highlighted.
        </p>
        <WeightedScoringTable
          solutions={solutions}
          criteria={criteria}
          ratings={ratings}
          editSolution={editSolution}
          removeSolution={removeSolution}
          editCriterion={editCriterion}
          removeCriterion={removeCriterion}
          editWeight={editWeight}
          editRating={editRating}
          addSolution={addSolution}
          addCriterion={addCriterion}
          scores={scores}
          bestScore={bestScore}
          isWeightValid={isWeightValid}
          totalWeight={totalWeight()}
          isEditable={isEditable}
        />
      </div>
    </div>
  );
}

export default WeightedScoringPanel;
