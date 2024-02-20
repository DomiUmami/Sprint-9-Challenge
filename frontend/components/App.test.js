// Write your tests here
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import AppFunctional from './AppFunctional'
import '@testing-library/jest-dom/extend-expect'

describe('AppFunctional component', () => {
  test('renders headings, buttons, links, etc.', () => {
    const { getByText } = render(<AppFunctional />);
    
    // Test that headings are rendered
  
    expect(getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(getByText('You moved 0 times')).toBeInTheDocument();

    // Test that buttons are rendered
    expect(getByText('LEFT')).toBeInTheDocument();
    expect(getByText('UP')).toBeInTheDocument();
    expect(getByText('RIGHT')).toBeInTheDocument();
    expect(getByText('DOWN')).toBeInTheDocument();
    expect(getByText('reset')).toBeInTheDocument();

    // Test that input field is rendered
    expect(document.querySelector('input[type="email"]')).toBeInTheDocument();
  });

  test('typing on the input changes its value', () => {
    const { getByPlaceholderText } = render(<AppFunctional />);
    const input = getByPlaceholderText('type email');

    // Simulate typing in the input field
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    // Verify that the input value changes accordingly
    expect(input.value).toBe('test@example.com');
  });
});
