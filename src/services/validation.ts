import { StrKey } from '@stellar/stellar-sdk';

export function isValidStellarAddress(value: string): boolean {
  return StrKey.isValidEd25519PublicKey(value);
}

export function isValidAmount(value: string): boolean {
  if (!value) return false;
  const num = Number(value);
  return !Number.isNaN(num) && num > 0 && /^\d+(\.\d+)?$/.test(value);
}

export const ADDRESS_PLACEHOLDER = 'G...';
export const AMOUNT_PLACEHOLDER = '0.00';
