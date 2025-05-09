import { useWriteContract, useAccount } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useState } from "react";

export const useAccept = () => {
  const { address } = useAccount();
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { writeContractAsync } = useWriteContract();

  const acceptLike = async (userAddress: string) => {
    if (!address) {
      setError(new Error("No connected account"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "accept",
        args: [userAddress],
      });
    } catch (err) {
      console.error("Error accepting like:", err);
      setError(err instanceof Error ? err : new Error("Failed to accept like"));
    } finally {
      setLoading(false);
    }
  };

  return { acceptLike, isLoading, error };
};
