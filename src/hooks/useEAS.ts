import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Hex } from 'viem';
import { EAS_CONFIG, encodeIdeaData, encodeUpvoteData, encodeClaimData, encodeRemixData } from '~/lib/eas';
import type { IdeaAttestationData, UpvoteAttestationData, ClaimAttestationData, RemixAttestationData } from '~/lib/eas';

// EAS Contract ABI (minimal required functions)
const EAS_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'schema', type: 'bytes32' },
          { name: 'data', type: 'bytes' },
        ],
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'payable',
    type: 'function',
  },
] as const;

export function useEAS() {
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const attestIdea = async (data: IdeaAttestationData) => {
    const encodedData = encodeIdeaData(data);

    return writeContract({
      address: EAS_CONFIG.contractAddress,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [
        {
          schema: '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // Temporary schema
          data: encodedData,
        },
      ],
    });
  };

  const attestUpvote = async (data: UpvoteAttestationData) => {
    const encodedData = encodeUpvoteData(data);

    return writeContract({
      address: EAS_CONFIG.contractAddress,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [
        {
          schema: '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // Temporary schema
          data: encodedData,
        },
      ],
    });
  };

  const attestClaim = async (data: ClaimAttestationData) => {
    const encodedData = encodeClaimData(data);

    return writeContract({
      address: EAS_CONFIG.contractAddress,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [
        {
          schema: '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // Temporary schema
          data: encodedData,
        },
      ],
    });
  };

  const attestRemix = async (data: RemixAttestationData) => {
    const encodedData = encodeRemixData(data);

    return writeContract({
      address: EAS_CONFIG.contractAddress,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [
        {
          schema: '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex, // Temporary schema
          data: encodedData,
        },
      ],
    });
  };

  return {
    attestIdea,
    attestUpvote,
    attestClaim,
    attestRemix,
    isLoading: isPending || isConfirming,
    isSuccess,
    transactionHash: hash,
  };
}