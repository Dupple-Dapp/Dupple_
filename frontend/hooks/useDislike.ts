import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useAccount } from "wagmi";
import { useState } from "react";

export const useDislike = () => {
  const { address } = useAccount();
  const [txError, setTxError] = useState<Error | null>(null);
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const dislikeUser = async (userAddress: string) => {
    if (!address) {
      setTxError(new Error("No connected account"));
      return;
    }

    if (address.toLowerCase() === userAddress.toLowerCase()) {
      setTxError(new Error("Cannot dislike yourself"));
      return;
    }

    setTxError(null);

    try {
      return await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "dislike",
        args: [userAddress],
      });
    } catch (err) {
      console.error("Error disliking user:", err);
      setTxError(
        err instanceof Error ? err : new Error("Failed to dislike user"),
      );
      throw err; // Re-throw for additional error handling if needed
    }
  };

  return {
    dislikeUser,
    isPending,
    isSuccess,
    error: error || txError,
  };
};
