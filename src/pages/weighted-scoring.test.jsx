import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeightedScoringPanel from '../components/WeightedScoringPanel';
import '@testing-library/jest-dom';

describe('WeightedScoringPanel user interactions', () => {
  test('renders initial solutions and criteria', () => {
    render(<WeightedScoringPanel />);
    expect(screen.getByTestId('criterion-Monetary')).toBeInTheDocument();
    expect(screen.getByTestId('criterion-Time')).toBeInTheDocument();
    expect(screen.getByTestId('weight-Monetary')).toBeInTheDocument();
    expect(screen.getByTestId('weight-Time')).toBeInTheDocument();
  });

  test('can add a solution', async () => {
    render(<WeightedScoringPanel />);
    await userEvent.click(screen.getByText(/add solution/i));
    expect(screen.getByTestId('score-solution-Solution 3')).toBeInTheDocument();
  });

  test('can remove a solution', async () => {
    render(<WeightedScoringPanel />);
    await userEvent.click(screen.getAllByTitle('Remove solution')[0]);
    expect(screen.getByTestId('score-solution-Solution 1')).toBeInTheDocument();
    expect(screen.getByTestId('score-solution-Solution 2')).toBeInTheDocument();
  });

  test('can add a criterion', async () => {
    render(<WeightedScoringPanel />);
    await userEvent.click(screen.getByText(/add criterion/i));
    expect(screen.getByTestId('criterion-Criterion 6')).toBeInTheDocument();
  });

  test('can remove a criterion', async () => {
    render(<WeightedScoringPanel />);
    await userEvent.click(screen.getAllByTitle('Remove criterion')[0]);
    expect(screen.queryByTestId('criterion-Monetary')).not.toBeInTheDocument();
    expect(screen.getByTestId('criterion-Time')).toBeInTheDocument();
  });

  test('can edit solution name', async () => {
    render(<WeightedScoringPanel />);
    const input = screen.getAllByDisplayValue('Solution 1')[0];
    await userEvent.clear(input);
    await userEvent.type(input, 'New Solution');
    expect(
      screen.getByTestId('score-solution-New Solution')
    ).toBeInTheDocument();
  });

  test('can edit criterion name', async () => {
    render(<WeightedScoringPanel />);
    const cell = screen.getByTestId('criterion-Monetary');
    const input = within(cell).getByDisplayValue('Monetary');
    await userEvent.clear(input);
    await userEvent.type(input, 'Cost');
    expect(screen.getByTestId('criterion-Cost')).toBeInTheDocument();
  });

  test('can toggle presentation mode', async () => {
    render(<WeightedScoringPanel />);
    const checkbox = screen.getByLabelText(/presentation mode/i);
    expect(checkbox).not.toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
