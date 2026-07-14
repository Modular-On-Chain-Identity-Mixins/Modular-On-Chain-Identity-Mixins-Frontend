import { useCompliance } from '../../hooks/useCompliance';
import { useWalletStore } from '../../contexts/WalletContext';
import { Card, CardTitle, CardContent } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { toast } from '../UI/Toast';
import { useState } from 'react';

export function ComplianceCheck() {
  const { checkResults, loading, checkTransfer } = useCompliance();
  const { publicKey, address } = useWalletStore();
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const handleCheck = async () => {
    if (!publicKey || !address || !to || !amount) {
      toast('Fill all fields', 'warning');
      return;
    }
    await checkTransfer(address, to, amount, publicKey);
  };

  const allPassed = checkResults.length > 0 && checkResults.every((r) => r.passed);

  return (
    <Card variant="default">
      <CardTitle>Compliance Check</CardTitle>
      <CardContent className="space-y-3">
        <Input
          label="Recipient Address"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="G..."
        />
        <Input
          label="Amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="1000"
        />
        <Button onClick={handleCheck} loading={loading} className="w-full">
          Check Compliance
        </Button>

        {checkResults.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={allPassed ? 'success' : 'danger'}>
                {allPassed ? 'All Checks Passed' : 'Checks Failed'}
              </Badge>
            </div>
            {checkResults.map((r, i) => (
              <div
                key={i}
                className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                  r.passed ? 'bg-[#00c853]/5' : 'bg-[#ff1744]/5'
                }`}
              >
                <span className={r.passed ? 'text-[#00c853]' : 'text-[#ff1744]'}>
                  {r.passed ? '✓' : '✕'}
                </span>
                <span className="text-[#e8e8f0]">{r.rule}</span>
                {r.reason && <span className="text-[#606080] text-xs ml-auto">{r.reason}</span>}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
