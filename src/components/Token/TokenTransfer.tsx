import { useState } from 'react';
import { Card, CardTitle, CardContent } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { Badge } from '../UI/Badge';
import { useWalletStore } from '../../contexts/WalletContext';
import { useTransactionStore } from '../../store/transactionStore';
import { toast } from '../UI/Toast';
import * as contract from '../../services/contract';

export function TokenTransfer() {
  const { publicKey, address } = useWalletStore();
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [complianceOk, setComplianceOk] = useState<boolean | null>(null);

  const handleCheck = async () => {
    if (!publicKey || !address || !to || !amount) {
      toast('Fill all fields', 'warning');
      return;
    }
    setChecking(true);
    setComplianceOk(null);
    try {
      const results = await contract.checkCompliance(address, to, amount, publicKey);
      const passed = results.length > 0 && results.every((r) => r.passed);
      setComplianceOk(passed);
      if (passed) {
        toast('Compliance check passed', 'success');
      } else {
        const failed = results.find((r) => !r.passed);
        toast(failed?.reason || 'Compliance check failed', 'error');
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Check failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleTransfer = async () => {
    if (!publicKey || !address || !to || !amount) {
      toast('Fill all fields', 'warning');
      return;
    }
    setSending(true);
    try {
      const txHash = await contract.executeTransfer(
        { from: address, to, amount, asset: 'SOROBAN_TOKEN' },
        publicKey,
      );
      addTransaction({ hash: txHash, status: 'PENDING', timestamp: Date.now() });
      toast(`Transfer submitted: ${txHash.slice(0, 8)}...`, 'success');
      setTo('');
      setAmount('');
      setComplianceOk(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Transfer failed', 'error');
    } finally {
      setSending(false);
    }
  };

  return (
    <Card variant="default">
      <CardTitle>Transfer Tokens</CardTitle>
      <CardContent className="space-y-3">
        <Input
          label="From"
          value={address || ''}
          disabled
        />
        <Input
          label="Recipient"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="GABCDEF..."
        />
        <Input
          label="Amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />

        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleCheck}
            loading={checking}
            className="flex-1"
          >
            Check Compliance
          </Button>
          <Button
            onClick={handleTransfer}
            loading={sending}
            disabled={complianceOk === false}
            className="flex-1"
          >
            Transfer
          </Button>
        </div>

        {complianceOk === true && (
          <Badge variant="success" size="md">Compliance Verified - Ready to Transfer</Badge>
        )}
        {complianceOk === false && (
          <Badge variant="danger" size="md">Compliance Check Failed - Transfer Blocked</Badge>
        )}
      </CardContent>
    </Card>
  );
}
