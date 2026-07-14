import {
  BASE_FEE,
  Networks,
  TransactionBuilder,
  rpc,
  Contract,
} from '@stellar/stellar-sdk';
import { isAllowed, signTransaction, getAddress } from '@stellar/freighter-api';
import type { WalletState, Balance } from '../types';

const TESTNET_RPC = 'https://soroban-testnet.stellar.org';
const MAINNET_RPC = 'https://soroban.stellar.org';

const NETWORK_PASSPHRASE: Record<string, string> = {
  TESTNET: Networks.TESTNET,
  MAINNET: Networks.PUBLIC,
};

const RPC_URLS: Record<string, string> = {
  TESTNET: TESTNET_RPC,
  MAINNET: MAINNET_RPC,
};

function getServer(network: string): rpc.Server {
  return new rpc.Server(RPC_URLS[network]);
}

export async function connectWallet(): Promise<WalletState> {
  try {
    const supported = await isAllowed();
    if (!supported) {
      throw new Error('Freighter extension not found.');
    }
    const { address: publicKey } = await getAddress();
    const network = 'TESTNET';

    return {
      address: publicKey,
      publicKey,
      network,
      isConnected: true,
      isConnecting: false,
      error: null,
    };
  } catch (err) {
    return {
      address: null,
      publicKey: null,
      network: null,
      isConnected: false,
      isConnecting: false,
      error: err instanceof Error ? err.message : 'Failed to connect wallet',
    };
  }
}

export async function signWithFreighter(
  txXdr: string,
  network: string,
): Promise<string> {
  const signed = await signTransaction(txXdr, {
    networkPassphrase: NETWORK_PASSPHRASE[network],
  });
  return typeof signed === 'string' ? signed : signed.signedTxXdr;
}

export async function getBalances(
  publicKey: string,
  network: string,
): Promise<Balance[]> {
  try {
    const server = getServer(network);
    const account = await server.getAccount(publicKey);
    const balances: Array<{
      asset_type: string;
      asset_code?: string;
      balance: string;
      asset_contract_id?: string;
    }> = (account as any).balances ?? [];
    return balances.map((b) => ({
      asset: b.asset_type === 'native' ? 'XLM' : (b.asset_code ?? 'Unknown'),
      balance: b.balance,
      contractId: b.asset_contract_id,
    }));
  } catch {
    return [];
  }
}

export async function simulateContractCall(
  contractId: string,
  method: string,
  args: any[],
  network: string,
  source: string,
): Promise<rpc.Api.SimulateTransactionResponse> {
  const server = getServer(network);
  const contract = new Contract(contractId);
  const account = await server.getAccount(source);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE[network],
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  return server.simulateTransaction(tx);
}

export async function sendContractCall(
  contractId: string,
  method: string,
  args: any[],
  network: string,
  source: string,
): Promise<string> {
  const server = getServer(network);
  const contract = new Contract(contractId);
  const account = await server.getAccount(source);
  const passphrase = NETWORK_PASSPHRASE[network];

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: passphrase,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const simulated = await server.simulateTransaction(tx);
  if (!simulated) {
    throw new Error('Transaction simulation returned no result');
  }

  if (rpc.Api.isSimulationError(simulated)) {
    throw new Error(`Simulation error: ${simulated.error}`);
  }

  const preparedTx = rpc.assembleTransaction(tx, simulated).build();
  const envelopeXdr = preparedTx.toEnvelope().toXDR('base64');
  const signedXdr = await signWithFreighter(envelopeXdr, network);
  const signedTx = TransactionBuilder.fromXDR(signedXdr, passphrase);

  const response = await server.sendTransaction(signedTx);

  if (response.status === 'PENDING' || response.status === 'DUPLICATE') {
    return response.hash;
  }
  const errorMsg =
    response.errorResult instanceof Object
      ? String(response.errorResult)
      : 'Unknown error';
  throw new Error(`Transaction failed: ${errorMsg}`);
}
