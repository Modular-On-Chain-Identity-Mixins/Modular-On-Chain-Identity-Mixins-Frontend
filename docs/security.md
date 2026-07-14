# Content-Security-Policy for Soroban dApps

## Overview

Content-Security-Policy (CSP) is a critical security layer for Soroban-based decentralized applications. It restricts which resources the browser can load, mitigating XSS and data injection attacks.

## Required Directives

### `connect-src` — Stellar RPC Endpoints

Soroban smart contract communication requires RPC endpoints:

```
connect-src 'self' https://soroban-testnet.stellar.org https://soroban.stellar.org
```

- **Testnet**: `https://soroban-testnet.stellar.org`
- **Mainnet**: `https://soroban.stellar.org`

Include both if your app supports network switching.

### `connect-src` — Freighter Wallet

Freighter uses `chrome-extension://` connections for signing. If you use `@stellar/freighter-api`, the extension handles messaging internally; no extra CSP entry is typically needed since Freighter injects a content script. However, some setups may require:

```
connect-src 'self' https://soroban-testnet.stellar.org https://soroban.stellar.org ws://localhost:*
```

### `style-src` — Fonts & Tailwind

```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

Tailwind CSS generates inline styles. Google Fonts stylesheets are loaded from `fonts.googleapis.com`.

### `font-src`

```
font-src 'self' https://fonts.gstatic.com
```

### `img-src`

```
img-src 'self' data:
```

### `script-src`

```
script-src 'self'
```

If you use Freighter, the extension injects a content script that is not blocked by CSP because it runs in an isolated world.

## Recommended Policy

```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://soroban-testnet.stellar.org https://soroban.stellar.org;
  img-src 'self' data:;
  object-src 'none';
  frame-ancestors 'none';
" always;
```

## Deploying via nginx

This policy is pre-configured in the project's `nginx.conf`. When building the Docker image, the CSP is automatically applied to all served responses.

## Verifying CSP

1. Open browser DevTools → Console
2. Look for CSP violation warnings
3. Test both TESTNET and MAINNET RPC connections
4. Verify Freighter wallet popup opens correctly

## References

- [Stellar Soroban RPC](https://soroban.stellar.org)
- [Freighter Wallet](https://freighter.app)
- [MDN CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
