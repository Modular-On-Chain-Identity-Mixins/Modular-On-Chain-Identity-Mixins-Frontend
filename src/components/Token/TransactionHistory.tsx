import { useTransactionStore } from '../../store/transactionStore';
import { Card, CardHeader, CardTitle, CardContent } from '../UI/Card';
import { Badge } from '../UI/Badge';
import { Button } from '../UI/Button';
import { EmptyState } from '../UI/EmptyState';
import { formatAddress, formatRelativeTime } from '../../services/format';

const STATUS_VARIANT: Record<string, 'success' | 'warning' | 'danger'> = {
  PENDING: 'warning',
  SUCCESS: 'success',
  FAILED: 'danger',
};

export function TransactionHistory() {
  const { transactions, clearHistory } = useTransactionStore();

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        {transactions.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearHistory}>
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState icon="📜" title="No transactions yet" description="Completed transfers will appear here" />
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {transactions.map((tx) => (
              <div
                key={tx.hash}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-[#13131a]"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-[#e8e8f0] truncate">
                    {formatAddress(tx.hash, 16)}
                  </p>
                  <p className="text-xs text-[#606080] mt-0.5">
                    {formatRelativeTime(tx.timestamp)}
                  </p>
                </div>
                <Badge variant={STATUS_VARIANT[tx.status]} size="sm">
                  {tx.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
