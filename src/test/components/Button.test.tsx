// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../../components/UI/Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('shows spinner when loading', () => {
    const { container } = render(<Button loading>Submit</Button>);
    expect(container.querySelector('.animate-spin')).toBeDefined();
  });

  it('disables button when loading', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Submit').closest('button')).toBeDisabled();
  });

  it('disables button when disabled prop is set', () => {
    render(<Button disabled>Submit</Button>);
    expect(screen.getByText('Submit').closest('button')).toBeDisabled();
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="danger">Delete</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('bg-[#ff1744]');
  });

  it('applies size classes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    const btn = container.querySelector('button');
    expect(btn?.className).toContain('px-6');
  });
});
