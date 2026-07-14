import { SeoHead } from '../components/UI/SeoHead';
import { RequireWallet } from '../components/Wallet/RequireWallet';
import { WhitelistManager } from '../components/Admin/WhitelistManager';
import { RegistryConfig } from '../components/Admin/RegistryConfig';

export function AdminPage() {
  return (
    <RequireWallet>
      <div className="space-y-6">
        <SeoHead title="Admin Panel" description="Manage the Identity Registry and whitelist" />
        <div>
          <h2 className="text-2xl font-bold text-[#e8e8f0]">Admin Panel</h2>
          <p className="text-sm text-[#606080] mt-1">
            Manage the Identity Registry and whitelist
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RegistryConfig />
          <WhitelistManager />
        </div>
      </div>
    </RequireWallet>
  );
}
