import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useGetAllUsersAddresses } from "@/hooks/useGetAllUsersAddresses";
import { useGetUser } from "@/hooks/useGetUser";
import { useLike } from "@/hooks/useLike";
import { useDislike } from "@/hooks/useDislike";
import { useTipUser } from "@/hooks/useTipUser";

const HomePage: React.FC = () => {
  const { profiles: userAddresses, isLoading: addressesLoading } =
    useGetAllUsersAddresses();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipAmount, setTipAmount] = useState("0.01");
  const constraintsRef = useRef(null);

  const currentUserAddress = userAddresses[currentProfileIndex];
  const { data: currentProfile, isLoading: profileLoading } =
    useGetUser(currentUserAddress);

  const { likeUser: like } = useLike();
  const { dislikeUser: dislike } = useDislike();
  const { tipUser } = useTipUser();

  const handleSwipe = (action: "like" | "dislike") => {
    if (isAnimating || !currentProfile) return;

    setIsAnimating(true);
    setDirection(action === "like" ? 1 : -1);

    if (action === "like") {
      like(currentProfile.user);
    } else {
      dislike(currentProfile.user);
    }

    setTimeout(() => {
      setCurrentProfileIndex((prev) => (prev + 1) % userAddresses.length);
      setIsAnimating(false);
    }, 500);
  };

  const handleDragEnd = (info: any) => {
    if (info.offset.x > 100) {
      handleSwipe("like");
    } else if (info.offset.x < -100) {
      handleSwipe("dislike");
    }
  };

  const handleTip = () => {
    if (!currentProfile) return;
    tipUser(currentProfile.user, tipAmount);
    setShowTipModal(false);
  };

  const loading = addressesLoading || profileLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading potential matches...</div>
      </div>
    );
  }

  if (!userAddresses.length || !currentProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">
          No more profiles to show. Check back later!
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <div ref={constraintsRef} className="w-full max-w-md h-96 relative">
          <AnimatePresence>
            <motion.div
              key={currentProfile.user}
              className="bg-white rounded-xl shadow-md overflow-hidden h-96 w-full absolute"
              drag="x"
              dragConstraints={constraintsRef}
              onDragEnd={handleDragEnd}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                x: isAnimating ? direction * 500 : 0,
                rotate: isAnimating ? direction * 15 : 0,
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="h-full flex flex-col">
                <div className="flex-1 bg-gray-200 flex items-center justify-center relative">
                  {currentProfile.profilePictureNFT &&
                  (currentProfile.profilePictureNFT.startsWith("/") ||
                    currentProfile.profilePictureNFT.startsWith("http")) ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={currentProfile.profilePictureNFT}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setShowTipModal(true)}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition"
                      >
                        <svg
                          className="w-6 h-6 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-gray-500">No valid profile image</div>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {currentProfile.ens || `User ${currentProfileIndex + 1}`}
                  </h2>
                  <p className="text-gray-600 mb-3">
                    {currentProfile.gender === 0 ? "Male" : "Female"},{" "}
                    {currentProfile.height}
                  </p>
                  <p className="text-gray-700 mb-4">
                    {currentProfile.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.hobbies?.map(
                      (hobby: string, index: number) => (
                        <span
                          key={index}
                          className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded"
                        >
                          {hobby}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showTipModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">Send Tip</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Amount (ETH)</label>
              <input
                type="number"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
                className="w-full p-2 border rounded"
                min="0.001"
                step="0.001"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTipModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTip}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
              >
                Send Tip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-6 gap-6 pb-8">
        <button
          onClick={() => handleSwipe("dislike")}
          disabled={isAnimating}
          className="bg-white rounded-full p-4 shadow-md hover:bg-gray-100 disabled:opacity-50 transition"
        >
          <svg
            className="w-8 h-8 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <button
          onClick={() => handleSwipe("like")}
          disabled={isAnimating}
          className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-4 shadow-md hover:from-pink-600 hover:to-red-600 disabled:opacity-50 transition"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default HomePage;
