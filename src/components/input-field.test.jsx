import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import InputField from './InputField.jsx';

describe('InputField', () => {
  it('renders label and controls and calls handlers on change', () => {
    const onValueChange = vi.fn();
    const onUnitChange = vi.fn();

    render(
      <InputField
        label="Frequency"
        value={2}
        onValueChange={onValueChange}
        unit="days"
        onUnitChange={onUnitChange}
      />
    );

    expect(screen.getByText('Frequency')).toBeInTheDocument();

    const input = screen.getByRole('spinbutton');
    const select = screen.getByRole('combobox');

    // change the numeric input
    fireEvent.change(input, { target: { value: '3' } });
    expect(onValueChange).toHaveBeenCalled();
    // value should be numeric 3
    expect(onValueChange.mock.calls[0][0]).toBe(3);

    // change the unit
    fireEvent.change(select, { target: { value: 'hours' } });
    expect(onUnitChange).toHaveBeenCalledWith('hours');
  });
});
