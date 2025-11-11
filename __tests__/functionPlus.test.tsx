
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '@/components/counter/Counter';

describe('Counter', () => {
  test('renderiza el contador con valor inicial 0', () => {
    render(<Counter />);
    expect(screen.getByText(/Counter: 0/i)).toBeInTheDocument();
  });

  test('Incrementar el contador al hacer clic en el botón +', () => {
    render(<Counter />);
    const incrementButton = screen.getByText('+');
    fireEvent.click(incrementButton);
    expect(screen.getByText(/Counter: 1/i)).toBeInTheDocument();
  });

  test('Decrementar el contador al hacer clic en el botón -', () => {
    render(<Counter />);
    const decrementButton = screen.getByText('-');
    fireEvent.click(decrementButton);
    expect(screen.getByText(/Counter: -1/i)).toBeInTheDocument();
  });
})