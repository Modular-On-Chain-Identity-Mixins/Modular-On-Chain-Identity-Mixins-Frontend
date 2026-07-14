import { useIdentity } from '../../hooks/useIdentity';
import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { toast } from '../UI/Toast';
import { useState, useEffect } from 'react';

const JURISDICTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'EU', label: 'European Union' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'SG', label: 'Singapore' },
  { value: 'AE', label: 'UAE' },
  { value: 'JP', label: 'Japan' },
  { value: 'HK', label: 'Hong Kong' },
];

const TIERS = [
  { value: 'TIER_1', label: 'Tier 1 - Basic' },
  { value: 'TIER_2', label: 'Tier 2 - Enhanced' },
  { value: 'TIER_3', label: 'Tier 3 - Institutional' },
];

export function IdentityCard() {
  const { identity, loading, error, fetchIdentity, registerIdentity } = useIdentity();
  const { address, isConnected, publicKey } = useWalletStore();
  const [showRegister, setShowRegister] = useState(false);
  const [did, setDid] = useState('');
  const [jurisdiction, setJurisdiction] = useState('US');
  const [countryCode, setCountryCode] = useState('US');
  const [tier, setTier] = useState('TIER_1');

  useEffect(() => {
    if (isConnected && address && publicKey) {
      fetchIdentity(address, publicKey);
    }
  }, [isConnected, address, publicKey, fetchIdentity]);

  const handleRegister = async () => {
    if (!publicKey) return;
    if (!did || !jurisdiction || !countryCode) {
      toast('Please fill in all fields', 'warning');
      return;
    }
    const txHash = await registerIdentity(did, jurisdiction, countryCode, tier, publicKey);
    if (txHash) {
      toast('Identity registered successfully', 'success');
      setShowRegister(false);
      if (address && publicKey) fetchIdentity(address, publicKey);
    } else if (error) {
      toast(error, 'error');
    }
  };

  const kycVariant = identity?.kycStatus === 'VERIFIED' ? 'success'
    : identity?.kycStatus === 'PENDING' ? 'warning'
    : identity?.kycStatus === 'EXPIRED' || identity?.kycStatus === 'REVOKED' ? 'danger'
    : 'neutral';

  const tierVariant = identity?.tier === 'TIER_3' ? 'accent'
    : identity?.tier === 'TIER_2' ? 'info'
    : identity?.tier === 'TIER_1' ? 'success'
    : 'neutral';

  if (!isConnected) {
    return (
      <Card variant="glass">
        <CardTitle>Identity Verification</CardTitle>
        <CardContent>
          <p className="text-sm text-[#606080]">Connect wallet to view identity</p>
        </CardContent>
      </Card>
    );
  }

  if (loading && !identity) {
    return (
      <Card variant="glass">
        <CardTitle>Identity Verification</CardTitle>
        <CardContent>
          <div className="flex items-center gap-3 text-sm text-[#606080]">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Loading identity...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!identity) {
    return (
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Identity Verification</CardTitle>
          <Button size="sm" onClick={() => setShowRegister(!showRegister)}>
            Register
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[#606080]">No identity registered yet</p>
          {showRegister && (
            <div className="mt-4 space-y-3">
              <Input
                label="DID (Decentralized Identifier)"
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="did:stellar:abc123..."
              />
              <Select
                label="Jurisdiction"
                value={jurisdiction}
                onChange={(e) => { setJurisdiction(e.target.value); setCountryCode(e.target.value); }}
                options={JURISDICTIONS}
              />
              <Select
                label="Verification Tier"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                options={TIERS}
              />
              <Button onClick={handleRegister} loading={loading} className="w-full">
                Register Identity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="gradient">
      <CardHeader>
        <CardTitle>Identity Verification</CardTitle>
        <Badge variant={kycVariant}>{identity.kycStatus}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Tier</p>
            <div className="mt-1">
              <Badge variant={tierVariant} size="sm">
                {identity.tier.replace('_', ' ')}
              </Badge>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Jurisdiction</p>
            <p className="text-sm font-medium text-[#e8e8f0] mt-1">{identity.jurisdiction}</p>
          </div>
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Accredited</p>
            <div className="mt-1">
              <Badge variant={identity.accredited ? 'success' : 'neutral'} size="sm">
                {identity.accredited ? 'Yes' : 'No'}
              </Badge>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#13131a]">
            <p className="text-xs text-[#606080]">Country Code</p>
            <p className="text-sm font-medium text-[#e8e8f0] mt-1">{identity.countryCode}</p>
          </div>
        </div>
        <div className="text-xs text-[#606080] truncate">
          DID: {identity.did}
        </div>
        {identity.expiry > 0 && (
          <div className="text-xs text-[#606080]">
            Expires: {new Date(identity.expiry * 1000).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
