// hooks/useLikeDislike.ts
import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useLikeDislike = () => {
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const likeUser = (userAddress: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "like",
      args: [userAddress],
    });
  };

  const dislikeUser = (userAddress: string) => {
    return writeContract({
      address: CONTRACT_ADDRESS,
      abi,
      functionName: "dislike",
      args: [userAddress],
    });
  };

  return { likeUser, dislikeUser, isPending, isSuccess, error };
};
