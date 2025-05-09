import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useBlockUser = () => {
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const blockUser = async (user: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "blockUser",
        args: [user],
      });
    } catch (err) {
      console.error("blockUser error:", err);
    }
  };

  return { blockUser, isPending, isSuccess, error };
};
