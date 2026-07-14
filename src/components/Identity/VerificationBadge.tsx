import { Badge } from '../UI/Badge';
import type { IdentityProof } from '../../types';

interface VerificationBadgeProps {
  identity: IdentityProof | null;
}

export function VerificationBadge({ identity }: VerificationBadgeProps) {
  if (!identity) {
    return <Badge variant="neutral">Unverified</Badge>;
  }

  if (identity.kycStatus !== 'VERIFIED') {
    return <Badge variant="warning">{identity.kycStatus}</Badge>;
  }

  if (identity.expiry > 0 && identity.expiry * 1000 < Date.now()) {
    return <Badge variant="danger">Expired</Badge>;
  }

  return <Badge variant="success">Verified</Badge>;
}
