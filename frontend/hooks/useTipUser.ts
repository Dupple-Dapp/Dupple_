import { useWriteContract } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";

export const useTipUser = () => {
  const { writeContractAsync, isPending, isSuccess, error } =
    useWriteContract();

  const tipUser = async (user: string, valueInEth: string) => {
    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "tip",
        args: [user],
        value: BigInt(parseFloat(valueInEth) * 1e18), // Convert ETH string to wei
      });
    } catch (err) {
      console.error("tipUser error:", err);
    }
  };

  return { tipUser, isPending, isSuccess, error };
};
