import type { ReactNode } from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  children?: ReactNode;
}

export function EmptyState({ icon = '📭', title, description, action, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="text-sm font-medium text-[#e8e8f0]">{title}</p>
      {description && (
        <p className="text-xs text-[#606080] mt-1 max-w-xs">{description}</p>
      )}
      {action && (
        <Button size="sm" variant="secondary" className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
      {children}
    </div>
  );
}
