import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import WeightedScoringTable from '../components/WeightedScoringTable';
import '@testing-library/jest-dom';

const solutions = ['Solution 1', 'Solution 2'];
const criteria = [
  { name: 'Monetary', weight: 50 },
  { name: 'Time', weight: 50 },
];
const ratings = [
  [5, 7],
  [8, 6],
];
const scores = [6.5, 6.5];
const bestScore = 6.5;
const isWeightValid = true;
const totalWeight = 100;
const isEditable = true;

describe('WeightedScoringTable user interactions', () => {
  test('renders solutions and criteria', () => {
    render(
      <WeightedScoringTable
        solutions={solutions}
        criteria={criteria}
        ratings={ratings}
        editSolution={() => {}}
        removeSolution={() => {}}
        editCriterion={() => {}}
        removeCriterion={() => {}}
        editWeight={() => {}}
        editRating={() => {}}
        addSolution={() => {}}
        addCriterion={() => {}}
        scores={scores}
        bestScore={bestScore}
        isWeightValid={isWeightValid}
        totalWeight={totalWeight}
        isEditable={isEditable}
      />
    );
    const container = screen.getByRole('table');
    expect(
      container.querySelector('[data-criterion="Monetary"]')
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-score-solution="Solution 1"]')
    ).toBeInTheDocument();
  });

  test('shows best solution highlight', () => {
    render(
      <WeightedScoringTable
        solutions={solutions}
        criteria={criteria}
        ratings={ratings}
        editSolution={() => {}}
        removeSolution={() => {}}
        editCriterion={() => {}}
        removeCriterion={() => {}}
        editWeight={() => {}}
        editRating={() => {}}
        addSolution={() => {}}
        addCriterion={() => {}}
        scores={scores}
        bestScore={bestScore}
        isWeightValid={isWeightValid}
        totalWeight={totalWeight}
        isEditable={isEditable}
      />
    );
    const container = screen.getByRole('table');
    const bestCell = container.querySelector(
      '[data-score-solution="Solution 1"]'
    );
    expect(bestCell).toHaveClass('bg-green-100');
  });

  test('can edit rating if editable', async () => {
    const editRating = vi.fn();
    render(
      <WeightedScoringTable
        solutions={solutions}
        criteria={criteria}
        ratings={ratings}
        editSolution={() => {}}
        removeSolution={() => {}}
        editCriterion={() => {}}
        removeCriterion={() => {}}
        editWeight={() => {}}
        editRating={editRating}
        addSolution={() => {}}
        addCriterion={() => {}}
        scores={scores}
        bestScore={bestScore}
        isWeightValid={isWeightValid}
        totalWeight={totalWeight}
        isEditable={isEditable}
      />
    );
    const container = screen.getByRole('table');
    const ratingCell = container.querySelector(
      '[data-rating-criterion="Monetary"][data-rating-solution="Solution 1"]'
    );
    const select = within(ratingCell).getByDisplayValue('5');
    await userEvent.selectOptions(select, '8');
    expect(editRating).toHaveBeenCalled();
  });
});
