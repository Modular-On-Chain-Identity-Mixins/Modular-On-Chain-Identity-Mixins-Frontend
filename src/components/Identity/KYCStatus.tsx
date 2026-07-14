import type { KYCStatus as KYCStatusType } from '../../types';
import { Badge } from '../UI/Badge';

interface KYCStatusProps {
  status: KYCStatusType;
  address: string;
}

export function KYCStatus({ status, address }: KYCStatusProps) {
  const variant = status === 'VERIFIED' ? 'success'
    : status === 'PENDING' ? 'warning'
    : status === 'REVOKED' || status === 'EXPIRED' ? 'danger'
    : 'neutral';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#13131a]">
      <div className="w-8 h-8 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center">
        <svg className="w-4 h-4 text-[#6c5ce7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[#e8e8f0] truncate">
          {address.slice(0, 8)}...{address.slice(-6)}
        </p>
        <p className="text-xs text-[#606080]">KYC Status</p>
      </div>
      <Badge variant={variant}>{status}</Badge>
    </div>
  );
}
