import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

test('renders ingredient inventory', () => {
  render(<App />);
  expect(screen.getByText('Eggs')).toBeInTheDocument();
});

test('renders recipe catalog', () => {
  render(<App />);
  expect(screen.getByText('Omelette')).toBeInTheDocument();
});

test('schedule has 21 cells', () => {
  render(<App />);
  expect(screen.getAllByTestId('slot')).toHaveLength(21);
});

test('dragging recipe updates schedule cell', () => {
  render(<App />);
  const recipe = screen.getByText('Omelette');
  const slot = screen.getAllByTestId('slot')[0];
  const data = { getData: () => '1', setData: () => {} } as unknown as DataTransfer;
  fireEvent.dragStart(recipe, { dataTransfer: data });
  fireEvent.drop(slot, { dataTransfer: data });
  expect(slot).toHaveTextContent('Omelette');
});
