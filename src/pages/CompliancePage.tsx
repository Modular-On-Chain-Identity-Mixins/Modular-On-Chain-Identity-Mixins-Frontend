import { useState, useCallback } from 'react';
import { SeoHead } from '../components/UI/SeoHead';
import { usePageTitle } from '../hooks/usePageTitle';
import { RequireWallet } from '../components/Wallet/RequireWallet';
import { RuleList } from '../components/Compliance/RuleList';
import { ComplianceCheck } from '../components/Compliance/ComplianceCheck';
import { RuleEditor } from '../components/Compliance/RuleEditor';
import { Button } from '../components/UI/Button';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export function CompliancePage() {
  usePageTitle('Compliance Rules');
  const [showEditor, setShowEditor] = useState(false);
  useKeyboardShortcut('n', useCallback(() => setShowEditor((v) => !v), []));

  return (
    <RequireWallet>
      <div className="space-y-6">
        <SeoHead title="Compliance Rules" description="Configure granular compliance rules for permissioned tokens" />
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
