/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IDENTITY_REGISTRY_ID: string;
  readonly VITE_TOKEN_CONTRACT_ID: string;
  readonly VITE_NETWORK?: 'TESTNET' | 'MAINNET';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
