import { render, screen } from '@testing-library/react';
import Button from '@/components/ui/button/Button';

describe('Button', () => {
  test('renderiza con el texto correcto', () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  test('llama a la función onClick cuando se hace clic', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('está deshabilitado cuando la prop disabled es true', () => {
    render(<Button label="Click me" disabled />);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });

    test('tiene el tipo correcto cuando se pasa la prop type', () => {
      render(<Button label="Submit" type="submit" />);
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toHaveAttribute('type', 'submit');
    });
  });