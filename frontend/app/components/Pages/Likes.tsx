// pages/likes.tsx
import React, { useState } from "react";
// import { useAccount } from "wagmi";
import { User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUserProfiles } from "@/hooks/useUserProfile";
import { useYourLikes } from "@/hooks/useYourLikes";

const Likes: React.FC = () => {
//   const { address } = useAccount();
  const { likes, loading, acceptLike, dislikeUser } = useYourLikes();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { data: userProfile } = useUserProfiles(selectedUser);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
        <div className="text-xl mb-4">No likes yet</div>
        <p className="text-gray-600 mb-6">
          Keep using the app to get more likes!
        </p>
        <div className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center">
          <User className="text-pink-500 w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        People who liked you
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {likes.map((userAddress) => (
          <motion.div
            key={userAddress}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
          >
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {formatAddress(userAddress)}
                  </h3>
                  <p className="text-sm text-gray-500">Liked your profile</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedUser(userAddress)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition"
                >
                  View Profile
                </button>
                <button
                  onClick={() => acceptLike(userAddress)}
                  className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition"
                >
                  Accept
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedUser && userProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 bg-gray-200 relative overflow-hidden">
                  {userProfile.profilePictureNFT ? (
                    <img
                      src={userProfile.profilePictureNFT}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No profile image
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2"
                >
                  <svg
                    className="w-6 h-6"
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
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {userProfile.ens || formatAddress(selectedUser)}
                </h2>
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <span>{userProfile.gender === 0 ? "Male" : "Female"}</span>
                  {userProfile.height && <span>{userProfile.height} ft</span>}
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">About</h3>
                  <p className="text-gray-700">
                    {userProfile.description || "No description provided"}
                  </p>
                </div>
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Hobbies</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.hobbies?.map(
                      (hobby: string, index: number) => (
                        <span
                          key={index}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                        >
                          {hobby}
                        </span>
                      ),
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">
                      Relationship Status
                    </h4>
                    <p className="font-medium">
                      {userProfile.relationshipStatus === 0
                        ? "Single"
                        : userProfile.relationshipStatus === 1
                          ? "In a relationship"
                          : "Prefer not to say"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Drinking</h4>
                    <p className="font-medium">
                      {userProfile.drinking === 0
                        ? "No"
                        : userProfile.drinking === 1
                          ? "Occasionally"
                          : "Yes"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Smoking</h4>
                    <p className="font-medium">
                      {userProfile.smoking === 0
                        ? "No"
                        : userProfile.smoking === 1
                          ? "Occasionally"
                          : "Yes"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">
                      Reason for Joining
                    </h4>
                    <p className="font-medium">
                      {userProfile.reason === 0
                        ? "Dating"
                        : userProfile.reason === 1
                          ? "Friendship"
                          : "Networking"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      dislikeUser(selectedUser);
                      setSelectedUser(null);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition"
                  >
                    Dislike
                  </button>
                  <button
                    onClick={() => {
                      acceptLike(selectedUser);
                      setSelectedUser(null);
                    }}
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg transition"
                  >
                    Accept Like
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Likes;
