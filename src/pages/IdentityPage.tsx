import { SeoHead } from '../components/UI/SeoHead';
import { RequireWallet } from '../components/Wallet/RequireWallet';
import { IdentityCard } from '../components/Identity/IdentityCard';
import { Card, CardTitle, CardContent } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';

export function IdentityPage() {
  return (
    <RequireWallet>
      <div className="space-y-6">
        <SeoHead title="Identity Registry" description="Manage your decentralized identity and KYC proofs" />
        <div>
          <h2 className="text-2xl font-bold text-[#e8e8f0]">Identity Registry</h2>
          <p className="text-sm text-[#606080] mt-1">
            Manage your decentralized identity and KYC proofs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <IdentityCard />
          </div>
          <div className="space-y-4">
            <Card variant="glass">
              <CardTitle>How It Works</CardTitle>
              <CardContent className="space-y-3 text-sm text-[#9090b0]">
                <div className="flex items-start gap-3">
                  <Badge variant="accent">1</Badge>
                  <p>Register your DID and jurisdiction</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="accent">2</Badge>
                  <p>Complete KYC verification with an authorized issuer</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="accent">3</Badge>
                  <p>Your identity is stored on-chain in the Identity Registry</p>
                </div>
                <div className="flex items-start gap-3">
                  <Badge variant="accent">4</Badge>
                  <p>Compliance mixins check your identity before transfers</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireWallet>
  );
}
