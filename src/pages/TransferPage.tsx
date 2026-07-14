import { SeoHead } from '../components/UI/SeoHead';
import { RequireWallet } from '../components/Wallet/RequireWallet';
import { TokenTransfer } from '../components/Token/TokenTransfer';
import { TokenBalance } from '../components/Token/TokenBalance';
import { TransactionHistory } from '../components/Token/TransactionHistory';
import { Card, CardTitle, CardContent } from '../components/UI/Card';

export function TransferPage() {
  return (
    <RequireWallet>
      <div className="space-y-6">
        <SeoHead title="Token Transfers" description="Transfer tokens with built-in compliance verification" />
        <div>
          <h2 className="text-2xl font-bold text-[#e8e8f0]">Token Transfers</h2>
          <p className="text-sm text-[#606080] mt-1">
            Transfer tokens with built-in compliance verification
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <TokenTransfer />
          </div>
          <div className="lg:col-span-2 space-y-4">
            <TokenBalance />
            <TransactionHistory />
            <Card variant="glass">
              <CardTitle>Compliance Flow</CardTitle>
              <CardContent className="space-y-2 text-sm">
                {[
                  { step: '1', text: 'Enter recipient and amount', done: true },
                  { step: '2', text: 'Compliance mixin intercepts transfer', done: true },
                  { step: '3', text: 'Identity Registry verifies KYC', done: false },
                  { step: '4', text: 'Rules engine checks all constraints', done: false },
                  { step: '5', text: 'Transfer executed if all checks pass', done: false },
                ].map((s) => (
                  <div key={s.step} className="flex items-center gap-3 p-2 rounded-lg bg-[#13131a]">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      s.done ? 'bg-[#6c5ce7]/20 text-[#6c5ce7]' : 'bg-[#2a2a3d] text-[#606080]'
                    }`}>
                      {s.step}
                    </div>
                    <span className={s.done ? 'text-[#e8e8f0]' : 'text-[#606080]'}>{s.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </RequireWallet>
  );
}
