# Modular Compliance & On-Chain Identity Mixins — Frontend

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success" alt="Status" />
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/Stellar-Soroban-7B2FBE" alt="Stellar Soroban" />
  <img src="https://img.shields.io/badge/SEP--57-T--REX-6c5ce7" alt="SEP-57 / T-REX" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6" alt="TypeScript Strict" />
  <img src="https://img.shields.io/badge/React-19-61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/vite-8-646CFF" alt="Vite 8" />
  <img src="https://img.shields.io/badge/tailwindcss-4-06B6D4" alt="Tailwind CSS 4" />
</p>

Production-grade React frontend for **SEP-57 / T-REX permissioned tokens on Soroban (Stellar)**.

Manages decentralized identities (DIDs/KYC), configurable compliance rules, and permissioned token transfers — all interacting with Soroban smart contracts via Freighter wallet.

---

## Quick Start

```bash
npm install
cp .env.example .env   # then fill in your contract IDs
npm run dev             # http://localhost:5173
```

### Prerequisites

- [Freighter Wallet](https://freighter.app) browser extension
- Node.js 20+

### Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_IDENTITY_REGISTRY_ID` | **Yes** | — | Soroban contract ID for the Identity Registry |
| `VITE_TOKEN_CONTRACT_ID` | **Yes** | — | Soroban contract ID for the permissioned token |
| `VITE_NETWORK` | No | `TESTNET` | `TESTNET` or `MAINNET` |

---

## Project Structure

```
src/
├── types/            TypeScript interfaces (IdentityProof, ComplianceRule, etc.)
├── services/
│   ├── stellar.ts    Freighter wallet, Soroban RPC, transaction building/signing
│   ├── contract.ts   Typed wrappers over Identity Registry & Token contract calls
│   └── format.ts     Date, address, and balance formatting utilities
├── contexts/
│   └── WalletContext.ts   Zustand store (wallet state, balances, network preference)
├── store/
│   └── transactionStore.ts  Zustand store for recent transaction history
├── hooks/
│   ├── useWallet.ts
│   ├── useIdentity.ts
│   ├── useCompliance.ts
│   ├── useClipboard.ts
│   ├── useRateLimit.ts
│   ├── useKeyboardShortcut.ts
│   └── usePageTitle.ts
├── components/
│   ├── UI/           Design system (Button, Card, Badge, Input, Modal, Toast, etc.)
│   ├── Wallet/       Connect/disconnect, network selector, account status, auth guard
│   ├── Identity/     KYC proof, registration, verification badges
│   ├── Compliance/   Rule list, rule editor, compliance check runner
│   ├── Token/        Transfer form with compliance gate, balance viewer, transaction history
│   └── Admin/        Whitelist manager, registry config editor
├── pages/
│   ├── Dashboard         Overview with stats
│   ├── IdentityPage      DID / KYC management
│   ├── CompliancePage    Rules configuration & testing
│   ├── TransferPage      Permissioned token transfers
│   ├── AdminPage         Registry & whitelist admin
│   └── NotFoundPage      404 catch-all
├── e2e/              Playwright end-to-end tests
├── .storybook/       Storybook configuration (dark theme)
├── components/UI/ErrorBoundary.tsx
├── components/UI/PageErrorBoundary.tsx
├── App.tsx                Lazy-loaded routes
└── main.tsx
```

---

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (Vite) |
| `npm run build` | Type-check + production build |
| `npm run test` | Run all tests (Vitest) |
| `npm run test:watch` | Watch mode |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview production build |
| `npm run analyze` | Build and open bundle visualizer |

---

## Architecture

```
[User] ──> [Freighter Wallet]
                │
                ▼
        [Compliance Kit Frontend]
                │
    ┌───────────┴───────────┐
    ▼                       ▼
[Identity Registry]    [Token Contract]
   (KYC / DID)         (Compliance Rules)
```

Every transfer is intercepted by the compliance mixin:

1. Sender/recipient identities fetched from Identity Registry
2. All active compliance rules evaluated (jurisdiction, tier, volume, etc.)
3. Transfer executed only if all checks pass

---

## Testing

- **Unit tests** mock the Stellar SDK and test service logic (`src/test/services/contract.test.ts`)
- **Integration tests** render full components with mocked stores (`src/test/integration/`)
- **E2E tests** run with Playwright against the preview server (`e2e/`)
- **Run**: `npm test` or `npm run test:e2e`

---

## License

MIT
