import { Modal } from './Modal';

interface ShortcutHelpProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { combo: '?', label: 'Toggle this help modal' },
  { combo: 'n', label: 'Add new compliance rule' },
  { combo: 't', label: 'Go to Transfer page' },
  { combo: 'd', label: 'Go to Dashboard' },
];

export function ShortcutHelp({ open, onClose }: ShortcutHelpProps) {
  return (
    <Modal open={open} onClose={onClose} title="Keyboard Shortcuts" size="sm">
      <div className="space-y-3">
        {SHORTCUTS.map((s) => (
          <div key={s.combo} className="flex items-center justify-between">
            <span className="text-sm text-[#9090b0]">{s.label}</span>
            <kbd className="px-2 py-0.5 rounded bg-[#2a2a3d] text-xs font-mono text-[#e8e8f0] border border-[#3b3b5c]">
              {s.combo}
            </kbd>
          </div>
        ))}
      </div>
    </Modal>
  );
}
