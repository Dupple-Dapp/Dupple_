import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useUnblockUser = () => {
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const unblockUser = async (user: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "unBlockUser",
        args: [user],
      });
    } catch (err) {
      console.error("unblockUser error:", err);
    }
  };

  return { unblockUser, isPending, isSuccess, error };
};
