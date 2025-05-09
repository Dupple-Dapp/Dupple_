import { useReadContract, useAccount, UseReadContractReturnType } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useGetMatches = (): {
  matches: string[] | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} => {
  const { address } = useAccount();

  const {
    data,
    isLoading,
    error,
    refetch: originalRefetch,
  }: UseReadContractReturnType = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMatches",
    args: [address],
    query: {
      enabled: !!address, // Only enable query if address exists
    },
  });

  // Properly typed refetch function
  const refetch = async () => {
    try {
      await originalRefetch();
    } catch (err) {
      console.error("Error refetching matches:", err);
    }
  };

  return {
    matches: data as string[] | undefined,
    isLoading,
    error,
    refetch,
  };
};
