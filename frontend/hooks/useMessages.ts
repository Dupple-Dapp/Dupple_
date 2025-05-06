// hooks/useMessages.ts
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import abi from "../contract/abi.json";
import { CONTRACT_ADDRESS } from "@/contract/address";
import { useEffect, useState } from "react";

export const useMessages = (matchAddress: string | null) => {
  const { address } = useAccount();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const { writeContractAsync } = useWriteContract();

  const { data: sentMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMessages",
    args: [address, matchAddress],
    query: {
      enabled: !!matchAddress,
    },
  });

  const { data: receivedMessages } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi,
    functionName: "getMessages",
    args: [matchAddress, address],
    query: {
      enabled: !!matchAddress,
    },
  });

  useEffect(() => {
    if (matchAddress) {
      setLoading(true);
      const combined = [
        ...(sentMessages || []).map((msg: any) => ({
          ...msg,
          sender: address,
        })),
        ...(receivedMessages || []).map((msg: any) => ({
          ...msg,
          sender: matchAddress,
        })),
      ].sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

      setMessages(combined);
      setLoading(false);
    }
  }, [sentMessages, receivedMessages, matchAddress]);

  const sendMessage = async (content: string) => {
    if (!matchAddress) return;

    try {
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi,
        functionName: "sendMessage",
        args: [matchAddress, content],
      });
      // Refetch messages after sending
      setMessages((prev) => [
        ...prev,
        {
          content,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          sender: address,
        },
      ]);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return { messages, loading, sendMessage };
};
