import { useReadContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useGetIsLike = (user: string, likedUser: string) => {
  const result = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "liked",
    args: [user, likedUser],
  });

  return {
    isLiked: result.data as boolean | undefined,
    isLoading: result.isLoading,
    error: result.error,
    refetch: result.refetch,
  };
};
