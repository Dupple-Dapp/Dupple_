import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useSendMessage = () => {
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const sendMessageToUser = async (to: string, content: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "sendMessage",
        args: [to, content],
      });
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  };

  return { sendMessageToUser, isPending, isSuccess, error };
};
