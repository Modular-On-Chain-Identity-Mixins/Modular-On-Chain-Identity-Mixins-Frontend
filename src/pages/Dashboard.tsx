import { SeoHead } from '../components/UI/SeoHead';
import { usePageTitle } from '../hooks/usePageTitle';
import { useWalletStore } from '../contexts/WalletContext';
import { WalletStatus } from '../components/Wallet/WalletStatus';
import { IdentityCard } from '../components/Identity/IdentityCard';
import { RuleList } from '../components/Compliance/RuleList';
import { TokenBalance } from '../components/Token/TokenBalance';
import { Card, CardTitle, CardContent } from '../components/UI/Card';

export function Dashboard() {
  usePageTitle('Dashboard');
  const { isConnected } = useWalletStore();

  return (
    <div className="space-y-6">
      <SeoHead title="Dashboard" description="Modular On-Chain Identity & Compliance Framework overview" />
      <div>
        <h2 className="text-2xl font-bold text-[#e8e8f0]">Dashboard</h2>
        <p className="text-sm text-[#606080] mt-1">
          Modular On-Chain Identity & Compliance Framework
        </p>
      </div>

      {!isConnected && (
        <Card variant="gradient" className="text-center py-12">
          <div className="text-5xl mb-4">🛡️</div>
          <CardTitle className="text-xl">Soroban Compliance Kit</CardTitle>
          <CardContent>
            <p className="text-[#9090b0] text-sm max-w-md mx-auto mt-2">
              Connect your Freighter wallet to manage identities, configure compliance rules,
              and execute permissioned token transfers on Stellar.
            </p>
          </CardContent>
        </Card>
      )}

      {isConnected && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <IdentityCard />
            </div>
            <WalletStatus />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RuleList />
            <TokenBalance />
          </div>

          <Card variant="glass">
            <CardTitle>Quick Stats</CardTitle>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Network', value: 'Testnet', variant: 'info' as const },
                  { label: 'Standard', value: 'SEP-57', variant: 'accent' as const },
                  { label: 'Status', value: 'Operational', variant: 'success' as const },
                  { label: 'Protocol', value: 'Soroban', variant: 'neutral' as const },
                ].map((stat) => (
                  <div key={stat.label} className="p-3 rounded-lg bg-[#13131a] text-center">
                    <p className="text-xs text-[#606080]">{stat.label}</p>
                    <p className="text-sm font-semibold text-[#e8e8f0] mt-1">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
