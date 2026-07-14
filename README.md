# Modular Compliance & On-Chain Identity Mixins — Frontend

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
│   └── contract.ts   Typed wrappers over Identity Registry & Token contract calls
├── contexts/
│   └── WalletContext.ts   Zustand store (wallet state, balances)
├── hooks/
│   ├── useWallet.ts
│   ├── useIdentity.ts
│   └── useCompliance.ts
├── components/
│   ├── UI/           Design system (Button, Card, Badge, Input, Modal, Toast, etc.)
│   ├── Wallet/       Connect/disconnect, account status, auth guard
│   ├── Identity/     KYC proof, registration, verification badges
│   ├── Compliance/   Rule list, rule editor, compliance check runner
│   ├── Token/        Transfer form with compliance gate, balance viewer
│   └── Admin/        Whitelist manager, registry config editor
├── pages/
│   ├── Dashboard         Overview with stats
│   ├── IdentityPage      DID / KYC management
│   ├── CompliancePage    Rules configuration & testing
│   ├── TransferPage      Permissioned token transfers
│   └── AdminPage         Registry & whitelist admin
├── components/UI/ErrorBoundary.tsx
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
| `npm run lint` | Lint with oxlint |
| `npm run preview` | Preview production build |

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
- **Run**: `npm test`

---

## License

MIT
