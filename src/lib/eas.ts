import { Hex } from 'viem';

// EAS Configuration for Base network
export const EAS_CONFIG = {
  contractAddress: '0x4200000000000000000000000000000000000021' as Hex, // EAS contract on Base
  schemaRegistry: '0x4200000000000000000000000000000000000020' as Hex, // Schema Registry on Base
  chainId: 8453, // Base mainnet
  graphqlUrl: 'https://base.easscan.org/graphql',
};

// Schema UIDs - these need to be created on EAS
export const SCHEMAS = {
  IDEA: '0x0', // Will be updated with actual schema UID after creation
  UPVOTE: '0x0', // Will be updated with actual schema UID after creation
  CLAIM: '0x0', // Will be updated with actual schema UID after creation
  REMIX: '0x0', // Will be updated with actual schema UID after creation
};

// Types for attestation data
export interface IdeaAttestationData {
  title: string;
  description: string;
  category?: string;
}

export interface UpvoteAttestationData {
  ideaAttestationUID: string;
}

export interface ClaimAttestationData {
  ideaAttestationUID: string;
  builderAddress: string;
  status: 'claimed' | 'in_progress' | 'completed';
}

export interface RemixAttestationData {
  originalIdeaUID: string;
  title: string;
  description: string;
  changes: string;
}

// Encode attestation data
export function encodeIdeaData(data: IdeaAttestationData): Hex {
  // For now, we'll use simple JSON encoding
  // In production, use proper ABI encoding
  const encoded = JSON.stringify(data);
  return `0x${Buffer.from(encoded).toString('hex')}` as Hex;
}

export function encodeUpvoteData(data: UpvoteAttestationData): Hex {
  const encoded = JSON.stringify(data);
  return `0x${Buffer.from(encoded).toString('hex')}` as Hex;
}

export function encodeClaimData(data: ClaimAttestationData): Hex {
  const encoded = JSON.stringify(data);
  return `0x${Buffer.from(encoded).toString('hex')}` as Hex;
}

export function encodeRemixData(data: RemixAttestationData): Hex {
  const encoded = JSON.stringify(data);
  return `0x${Buffer.from(encoded).toString('hex')}` as Hex;
}

// Decode attestation data
export function decodeAttestationData<T>(encodedData: string): T {
  try {
    const hex = encodedData.startsWith('0x') ? encodedData.slice(2) : encodedData;
    const decoded = Buffer.from(hex, 'hex').toString();
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode attestation data:', error);
    throw new Error('Invalid attestation data');
  }
}