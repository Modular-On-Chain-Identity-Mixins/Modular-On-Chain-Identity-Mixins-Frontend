export interface WalletState {
  address: string | null;
  publicKey: string | null;
  network: 'TESTNET' | 'MAINNET' | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export interface IdentityProof {
  address: string;
  did: string;
  jurisdiction: string;
  countryCode: string;
  tier: VerificationTier;
  kycStatus: KYCStatus;
  accredited: boolean;
  expiry: number;
  issuer: string;
}

export type VerificationTier = 'NONE' | 'TIER_1' | 'TIER_2' | 'TIER_3';
export type KYCStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'EXPIRED' | 'REVOKED';

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  ruleType: RuleType;
  enabled: boolean;
  params: Record<string, string | number | boolean>;
  priority: number;
}

export type RuleType =
  | 'JURISDICTION_RESTRICTION'
  | 'TIER_THRESHOLD'
  | 'DAILY_VOLUME_LIMIT'
  | 'ACCREDITED_ONLY'
  | 'TRANSFER_TAX'
  | 'COOLDOWN_PERIOD'
  | 'WHITELIST_ONLY'
  | 'CUSTOM';

export interface TransferRequest {
  from: string;
  to: string;
  amount: string;
  asset: string;
  memo?: string;
}

export interface ComplianceCheckResult {
  passed: boolean;
  rule: string;
  reason?: string;
  timestamp: number;
}

export interface WhitelistEntry {
  address: string;
  label?: string;
  addedBy: string;
  addedAt: number;
  active: boolean;
}

export interface RegistryConfig {
  owner: string;
  contractId: string;
  networkPassphrase: string;
  verificationRequired: boolean;
  allowedJurisdictions: string[];
  minTier: VerificationTier;
  dailyVolumeLimit: string;
}

export interface TransactionStatus {
  hash: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  error?: string;
  timestamp: number;
}

export interface Balance {
  asset: string;
  balance: string;
  contractId?: string;
}
