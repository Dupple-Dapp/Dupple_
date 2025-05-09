import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useLike = () => {
  const { data, writeContractAsync, isPending, isSuccess, error, status } =
    useWriteContract();

  // Call this to like a user
  const likeUser = async (userAddress: string) => {
    try {
      const tx = await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "like",
        args: [userAddress],
      });
      return tx;
    } catch (err) {
      console.error("Like failed:", err);
      throw err;
    }
  };

  return {
    likeUser,
    isPending,
    isSuccess,
    error,
    status,
    data,
  };
};
