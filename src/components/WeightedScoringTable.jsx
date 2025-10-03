import React from 'react';

function WeightedScoringTable({
  solutions,
  criteria,
  ratings,
  editSolution,
  removeSolution,
  editCriterion,
  removeCriterion,
  editWeight,
  editRating,
  addSolution,
  addCriterion,
  scores,
  bestScore,
  isWeightValid,
  totalWeight,
  isEditable,
}) {
  return (
    <>
      <div className="flex gap-4 mb-4">
        {isEditable && (
          <>
            <button
              onClick={addSolution}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Solution
            </button>
            <button
              onClick={addCriterion}
              className="px-4 py-2 rounded transition bg-green-600 text-white hover:bg-green-700"
            >
              Add Criterion
            </button>
          </>
        )}
      </div>
      <div className="overflow-auto">
        <table className="min-w-full border rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Criterion</th>
              <th
                className={`px-3 py-2 ${isEditable ? 'text-left' : 'text-right'}`}
              >
                Weight (%)
              </th>
              <th className="px-3 py-2 text-right">Weight (%)</th>
              {solutions.map((sol, sIdx) => (
                <th
                  key={sIdx}
                  className="px-3 py-2 text-right"
                >
                  {isEditable ? (
                    <>
                      <input
                        value={sol}
                        onChange={(e) => editSolution(sIdx, e.target.value)}
                        className="border rounded px-2 py-1 w-28 text-right focus:outline-blue-500"
                        disabled={!isEditable}
                      />
                      <button
                        onClick={() => removeSolution(sIdx)}
                        disabled={solutions.length <= 2}
                        className={`ml-2 px-2 py-1 rounded ${solutions.length <= 2 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                        title="Remove solution"
                      >
                        &minus;
                      </button>
                    </>
                  ) : (
                    <span className="font-medium text-gray-800">{sol}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c, cIdx) => (
              <tr key={cIdx} className="border-t">
                <td
                  className="px-3 py-2"
                  data-testid={`criterion-${c.name}`}
                  data-criterion={c.name}
                >
                  {isEditable ? (
                    <>
                      <input
                        value={c.name}
                        onChange={(e) => editCriterion(cIdx, e.target.value)}
                        className="border rounded px-2 py-1 w-32 focus:outline-blue-500"
                        disabled={!isEditable}
                      />
                      <button
                        onClick={() => removeCriterion(cIdx)}
                        disabled={criteria.length <= 2}
                        className={`ml-2 px-2 py-1 rounded ${criteria.length <= 2 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                        title="Remove criterion"
                      >
                        &minus;
                      </button>
                    </>
                  ) : (
                    <span className="font-medium text-gray-800">{c.name}</span>
                  )}
                </td>
                <td className="px-3 py-2 text-right" data-testid={`weight-${c.name}`}>
                  {isEditable ? (
                    <input
                      type="number"
                      value={c.weight}
                      min={0}
                      max={100}
                      onChange={(e) => editWeight(cIdx, e.target.value)}
                      className="border rounded px-2 py-1 w-16 text-right focus:outline-blue-500"
                      disabled={!isEditable}
                    />
                  ) : (
                    <span className="font-medium text-gray-800">
                      {c.weight}
                    </span>
                  )}
                </td>
                {solutions.map((_, sIdx) => (
                  <td
                    key={sIdx}
                    className="px-3 py-2 text-right"
                    data-testid={`rating-${c.name}-solution-${solutions[sIdx]}`}
                    data-rating-criterion={c.name}
                    data-rating-solution={solutions[sIdx]}
                  >
                    {isEditable ? (
                      <select
                        value={ratings[cIdx][sIdx]}
                        onChange={(e) => editRating(cIdx, sIdx, e.target.value)}
                        className="border rounded px-2 py-1 w-20 text-right focus:outline-blue-500"
                        disabled={!isEditable}
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="font-medium text-gray-800">
                        {ratings[cIdx][sIdx]}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-blue-50">
              <td colSpan={2} className="px-3 py-2 font-semibold">
                Total Weighted Score
              </td>
              {scores.map((score, sIdx) => (
                <td
                  key={sIdx}
                  className={`px-3 py-2 font-semibold text-right ${isWeightValid && score === bestScore ? 'bg-green-100 text-green-700 border-2 border-green-400' : ''}`}
                  data-testid={`score-solution-${solutions[sIdx]}`}
                  data-score-solution={solutions[sIdx]}
                >
                  {isWeightValid ? score.toFixed(2) : 'N/A'}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="mt-4 flex flex-col gap-2 items-start">
        <span className="font-medium">
          Total Weight: <span className="text-blue-700">{totalWeight}%</span>
        </span>
        {!isWeightValid && (
          <span className="text-red-600 font-semibold">
            Weights must add up to 100% for calculations to be valid.
          </span>
        )}
      </div>
    </>
  );
}

export default WeightedScoringTable;
