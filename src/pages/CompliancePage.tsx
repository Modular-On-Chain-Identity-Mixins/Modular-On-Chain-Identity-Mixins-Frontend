import { useState } from 'react';
import { RequireWallet } from '../components/Wallet/RequireWallet';
import { RuleList } from '../components/Compliance/RuleList';
import { ComplianceCheck } from '../components/Compliance/ComplianceCheck';
import { RuleEditor } from '../components/Compliance/RuleEditor';
import { Button } from '../components/UI/Button';

export function CompliancePage() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <RequireWallet>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#e8e8f0]">Compliance Rules</h2>
            <p className="text-sm text-[#606080] mt-1">
              Configure granular compliance rules for permissioned tokens
            </p>
          </div>
          <Button onClick={() => setShowEditor(true)}>
            Add Rule
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RuleList />
          <ComplianceCheck />
        </div>

        <RuleEditor open={showEditor} onClose={() => setShowEditor(false)} />
      </div>
    </RequireWallet>
  );
}
