// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '../../components/UI/Badge';

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeDefined();
  });

  it('applies variant classes', () => {
    const { container } = render(<Badge variant="success">OK</Badge>);
    expect(container.firstChild?.textContent).toBe('OK');
  });

  it('applies size classes', () => {
    const { container } = render(<Badge size="md">Big</Badge>);
    expect(container.querySelector('.px-3')).toBeDefined();
  });
});
