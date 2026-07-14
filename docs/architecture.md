# Architecture

## System Design

```
┌─────────────────────────────────────────────┐
│              Compliance Kit UI               │
│  (React + TypeScript + Vite + Tailwind CSS)  │
├─────────────────────────────────────────────┤
│  Pages    │  Components  │  Hooks            │
│  Services │  Contexts    │  Types            │
├─────────────────────────────────────────────┤
│         @stellar/stellar-sdk + rpc           │
├─────────────────────────────────────────────┤
│         @stellar/freighter-api               │
├─────────────────────────────────────────────┤
│         Soroban Smart Contracts              │
│  Identity Registry  │  Token (Compliant)     │
└─────────────────────────────────────────────┘
```

## Data Flow

1. User connects Freighter wallet → `stellar.ts:connectWallet()`
2. Wallet state stored in Zustand → `WalletContext`
3. On identity page → `contract.ts:getIdentityProof()` → Soroban RPC → Identity Registry
4. On compliance page → `contract.ts:getComplianceRules()` → Soroban RPC → Token Contract
5. On transfer → `contract.ts:checkCompliance()` → all rules evaluated → `executeTransfer()` if pass

## Route Design

| Route | Page | Lazy |
|-------|------|------|
| `/` | Dashboard | Yes |
| `/identity` | IdentityPage | Yes |
| `/compliance` | CompliancePage | Yes |
| `/transfer` | TransferPage | Yes |
| `/admin` | AdminPage | Yes |
| `*` | NotFoundPage | No |

## Key Design Decisions

- **Zustand** over Redux for minimal boilerplate
- **Tailwind CSS** for utility-first styling with dark theme variables
- **Error boundary** at root + per-page for graceful failure recovery
- **Code splitting** via React.lazy — each page is its own JS chunk
- **30s polling** on token balances for near-realtime updates
- **Rate limiting** on compliance checks to prevent RPC spam
