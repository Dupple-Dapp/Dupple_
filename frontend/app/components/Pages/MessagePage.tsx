// pages/messages.tsx
import React, { useState, useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMatches } from "@/hooks/useMatches";
import { useMessages } from "@/hooks/useMessages";

const MessagesPage: React.FC = () => {
  const { address } = useAccount();
  const { matches } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { messages, loading, sendMessage } = useMessages(selectedMatch);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-select first match if none selected
  useEffect(() => {
    if (matches && matches.length > 0 && !selectedMatch) {
      setSelectedMatch(matches[0]);
    }
  }, [matches]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedMatch) return;

    await sendMessage(messageInput);
    setMessageInput("");
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!matches || matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <div className="text-xl mb-4">You don't have any matches yet</div>
        <p className="text-gray-600 mb-6">
          Keep swiping to find your perfect match!
        </p>
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
          <User className="text-pink-500 w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Match List */}
      <div className="w-full md:w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search matches..."
            className="w-full p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 px-4"
          />
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {matches.map((matchAddress) => (
            <div
              key={matchAddress}
              className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 ${
                selectedMatch === matchAddress ? "bg-pink-50" : ""
              }`}
              onClick={() => setSelectedMatch(matchAddress)}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="text-gray-500 w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">
                  {matchAddress.slice(0, 6)}...{matchAddress.slice(-4)}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {messages.find((m) => m.sender === matchAddress)?.content ||
                    "No messages yet"}
                </p>
              </div>
              {messages.filter((m) => m.sender === matchAddress).length > 0 && (
                <div className="text-xs text-gray-400">
                  {formatTime(
                    messages
                      .filter((m) => m.sender === matchAddress)
                      .slice(-1)[0]?.timestamp,
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedMatch ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500 w-5 h-5" />
            </div>
            <h3 className="font-medium">
              {selectedMatch.slice(0, 6)}...{selectedMatch.slice(-4)}
            </h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm">Say hello to start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <AnimatePresence key={`${message.timestamp}-${index}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === address ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                          message.sender === address
                            ? "bg-pink-500 text-white rounded-br-none"
                            : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.sender === address
                              ? "text-pink-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-gray-200 bg-white"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 px-4"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="bg-pink-500 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-gray-500">Select a match to start chatting</div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
