import { rpc, scValToNative } from '@stellar/stellar-sdk';
import type {
  IdentityProof,
  ComplianceRule,
  ComplianceCheckResult,
  RegistryConfig,
  WhitelistEntry,
  VerificationTier,
  KYCStatus,
  TransferRequest,
} from '../types';
import { simulateContractCall, sendContractCall } from './stellar';

const IDENTITY_REGISTRY_ID =
  import.meta.env.VITE_IDENTITY_REGISTRY_ID ?? '';
const TOKEN_CONTRACT_ID =
  import.meta.env.VITE_TOKEN_CONTRACT_ID ?? '';
const NETWORK =
  (import.meta.env.VITE_NETWORK as 'TESTNET' | 'MAINNET') ?? 'TESTNET';

function extractResult(
  res: rpc.Api.SimulateTransactionResponse,
): unknown {
  if (rpc.Api.isSimulationError(res)) {
    throw new Error(`Simulation error: ${res.error}`);
  }
  if (!res.result?.retval) return null;
  return scValToNative(res.result.retval);
}

export async function getIdentityProof(
  address: string,
  source: string,
): Promise<IdentityProof> {
  const raw = await simulateContractCall(
    IDENTITY_REGISTRY_ID,
    'get_identity',
    [address],
    NETWORK,
    source,
  );
  const value = extractResult(raw);
  if (!value) throw new Error('No identity found for address');
  return parseIdentityProof(value);
}

export async function registerIdentity(
  did: string,
  jurisdiction: string,
  countryCode: string,
  tier: VerificationTier,
  source: string,
): Promise<string> {
  return sendContractCall(
    IDENTITY_REGISTRY_ID,
    'register_identity',
    [{ did, jurisdiction, country_code: countryCode, tier }],
    NETWORK,
    source,
  );
}

export async function checkCompliance(
  from: string,
  to: string,
  amount: string,
  source: string,
): Promise<ComplianceCheckResult[]> {
  try {
    const raw = await simulateContractCall(
      TOKEN_CONTRACT_ID,
      'check_compliance',
      [{ from, to, amount }],
      NETWORK,
      source,
    );
    const value = extractResult(raw);
    return parseComplianceResults(value);
  } catch {
    return [];
  }
}

export async function executeTransfer(
  request: TransferRequest,
  source: string,
): Promise<string> {
  return sendContractCall(
    TOKEN_CONTRACT_ID,
    'transfer_with_compliance',
    [request.from, request.to, request.amount],
    NETWORK,
    source,
  );
}

export async function getComplianceRules(
  source: string,
): Promise<ComplianceRule[]> {
  const raw = await simulateContractCall(
    TOKEN_CONTRACT_ID,
    'get_rules',
    [],
    NETWORK,
    source,
  );
  const value = extractResult(raw);
  return parseRules(value);
}

export async function addComplianceRule(
  rule: Omit<ComplianceRule, 'id'>,
  source: string,
): Promise<string> {
  return sendContractCall(
    TOKEN_CONTRACT_ID,
    'add_rule',
    [{ ...rule, rule_type: rule.ruleType }],
    NETWORK,
    source,
  );
}

export async function toggleRule(
  ruleId: string,
  enabled: boolean,
  source: string,
): Promise<string> {
  return sendContractCall(
    TOKEN_CONTRACT_ID,
    'toggle_rule',
    [{ rule_id: ruleId, enabled }],
    NETWORK,
    source,
  );
}

export async function getRegistryConfig(
  source: string,
): Promise<RegistryConfig> {
  const raw = await simulateContractCall(
    IDENTITY_REGISTRY_ID,
    'get_config',
    [],
    NETWORK,
    source,
  );
  const value = extractResult(raw);
  if (!value) throw new Error('Failed to fetch registry config');
  return parseConfig(value);
}

export async function updateRegistryConfig(
  config: Partial<RegistryConfig>,
  source: string,
): Promise<string> {
  return sendContractCall(
    IDENTITY_REGISTRY_ID,
    'update_config',
    [config],
    NETWORK,
    source,
  );
}

export async function getWhitelist(
  source: string,
): Promise<WhitelistEntry[]> {
  const raw = await simulateContractCall(
    IDENTITY_REGISTRY_ID,
    'get_whitelist',
    [],
    NETWORK,
    source,
  );
  const value = extractResult(raw);
  return parseWhitelist(value);
}

export async function addToWhitelist(
  address: string,
  label: string,
  source: string,
): Promise<string> {
  return sendContractCall(
    IDENTITY_REGISTRY_ID,
    'add_to_whitelist',
    [address, label],
    NETWORK,
    source,
  );
}

export async function removeFromWhitelist(
  address: string,
  source: string,
): Promise<string> {
  return sendContractCall(
    IDENTITY_REGISTRY_ID,
    'remove_from_whitelist',
    [address],
    NETWORK,
    source,
  );
}

function parseIdentityProof(value: unknown): IdentityProof {
  const raw = (value ?? {}) as Record<string, unknown>;
  return {
    address: String(raw.address ?? ''),
    did: String(raw.did ?? ''),
    jurisdiction: String(raw.jurisdiction ?? ''),
    countryCode: String(raw.country_code ?? ''),
    tier: (raw.tier as VerificationTier) ?? 'NONE',
    kycStatus: (raw.kyc_status as KYCStatus) ?? 'UNVERIFIED',
    accredited: Boolean(raw.accredited),
    expiry: Number(raw.expiry) || 0,
    issuer: String(raw.issuer ?? ''),
  };
}

function parseComplianceResults(value: unknown): ComplianceCheckResult[] {
  if (!Array.isArray(value)) return [];
  return value.map((r: any) => ({
    passed: Boolean(r.passed),
    rule: String(r.rule ?? ''),
    reason: r.reason != null ? String(r.reason) : undefined,
    timestamp: Number(r.timestamp) || Date.now(),
  }));
}

function parseRules(value: unknown): ComplianceRule[] {
  if (!Array.isArray(value)) return [];
  return value.map((r: any) => ({
    id: String(r.id ?? crypto.randomUUID()),
    name: String(r.name ?? ''),
    description: String(r.description ?? ''),
    ruleType: (r.rule_type as ComplianceRule['ruleType']) ?? 'CUSTOM',
    enabled: Boolean(r.enabled),
    params: (r.params as Record<string, string | number | boolean>) ?? {},
    priority: Number(r.priority) || 0,
  }));
}

function parseConfig(value: unknown): RegistryConfig {
  const raw = (value ?? {}) as Record<string, unknown>;
  return {
    owner: String(raw.owner ?? ''),
    contractId: IDENTITY_REGISTRY_ID,
    networkPassphrase:
      NETWORK === 'TESTNET'
        ? 'Test SDF Network ; September 2015'
        : 'Public Global Stellar Network ; September 2015',
    verificationRequired: Boolean(raw.verification_required),
    allowedJurisdictions: Array.isArray(raw.allowed_jurisdictions)
      ? (raw.allowed_jurisdictions as string[])
      : [],
    minTier: (raw.min_tier as VerificationTier) ?? 'NONE',
    dailyVolumeLimit: String(raw.daily_volume_limit ?? '0'),
  };
}

function parseWhitelist(value: unknown): WhitelistEntry[] {
  if (!Array.isArray(value)) return [];
  return value.map((e: any) => ({
    address: String(e.address ?? ''),
    label: e.label != null ? String(e.label) : undefined,
    addedBy: String(e.added_by ?? ''),
    addedAt: Number(e.added_at) || Date.now(),
    active: Boolean(e.active),
  }));
}
