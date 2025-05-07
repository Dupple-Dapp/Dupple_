import { useReadContract, useWriteContract, useAccount } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useState, useEffect } from "react";

export const useYourLikes = () => {
  const { address } = useAccount();
  const [likes, setLikes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Get users who liked current user
  const { data: userProfile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getUser",
    args: [address],
  });

  // Get like status for each user
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (userProfile) {
      const likedBy = (userProfile as any).likes || [];
      setLikes(likedBy);
      setLoading(false);
    }
  }, [userProfile]);

  const acceptLike = async (userAddress: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "accept",
        args: [userAddress],
      });
      // Remove from likes list after accepting
      setLikes((prev) => prev.filter((addr) => addr !== userAddress));
    } catch (error) {
      console.error("Error accepting like:", error);
    }
  };

  const dislikeUser = async (userAddress: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "dislike",
        args: [userAddress],
      });
      // Remove from likes list after disliking
      setLikes((prev) => prev.filter((addr) => addr !== userAddress));
    } catch (error) {
      console.error("Error disliking user:", error);
    }
  };

  return { likes, loading, acceptLike, dislikeUser };
};
