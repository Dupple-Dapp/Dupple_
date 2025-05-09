// import React from 'react';
// import { User } from "lucide-react";

// const ProfilePage: React.FC = () => {
//   return (
//     <div className="p-4">
//       <div className="flex flex-col items-center mb-6">
//         <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
//           <User size={48} className="text-gray-500" />
//         </div>
//         <h2 className="text-xl font-bold">Your Name</h2>
//         <p className="text-gray-500">Edit your profile</p>
//       </div>

//       <div className="space-y-4">
//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium mb-2">About Me</h3>
//           <p className="text-gray-600">Adventure enthusiast and coffee lover. Looking for someone to share experiences with.</p>
//         </div>

//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium mb-2">Interests</h3>
//           <div className="flex flex-wrap gap-2">
//             {['Travel', 'Photography', 'Hiking', 'Music', 'Food'].map((interest, i) => (
//               <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
//                 {interest}
//               </span>
//             ))}
//           </div>
//         </div>

//         <div className="p-4 bg-gray-50 rounded-lg">
//           <h3 className="font-medium mb-2">My Photos</h3>
//           <div className="grid grid-cols-3 gap-2">
//             {[1, 2, 3, 4, 5, 6].map((i) => (
//               <div key={i} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
//                 <span className="text-gray-400 text-xs">Photo {i}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;

import React, { useState, useEffect } from "react";
import { User, Edit, X } from "lucide-react";
import { useAccount } from "wagmi";
import { useGetUser } from "@/hooks/useGetUser";
import { useEditProfile } from "@/hooks/useEditProfile";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import IPFSUploader from "../IPFSUploader";

const ProfilePage: React.FC = () => {
  const [userPhotos, setUserPhotos] = useState<string[]>([]);
  // const handleDeletePhoto = (index: number) => {
  //   setUserPhotos((prev) => prev.filter((_, i) => i !== index));
  // };

  const { address } = useAccount();
  const { data: userProfile } = useGetUser(address || null);
  const { editProfile, isPending: isEditing } = useEditProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    ens: "",
    description: "",
    profilePic: "",
    interestedIn: 0,
    relationshipStatus: 0,
    hobbies: [] as string[],
    drinking: 0,
    smoking: 0,
  });

  // Initialize form with user data when profile loads or modal opens
  useEffect(() => {
    if (userProfile && isEditModalOpen) {
      setEditForm({
        ens: userProfile.ens || "",
        description: userProfile.description || "",
        profilePic: userProfile.profilePictureNFT || "",
        interestedIn: userProfile.interestedIn || 0,
        relationshipStatus: userProfile.relationshipStatus || 0,
        hobbies: userProfile.hobbies || [],
        drinking: userProfile.drinking || 0,
        smoking: userProfile.smoking || 0,
      });
    }
  }, [userProfile, isEditModalOpen]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await editProfile({
        ens: editForm.ens,
        description: editForm.description,
        profilePic: editForm.profilePic,
        interestedIn: editForm.interestedIn,
        relationshipStatus: editForm.relationshipStatus,
        hobbyIndices: editForm.hobbies.map((hobby) =>
          HOBBY_OPTIONS.indexOf(hobby),
        ),
        drinking: editForm.drinking,
        smoking: editForm.smoking,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing profile:", error);
    }
  };

  const HOBBY_OPTIONS = [
    "Travel",
    "Photography",
    "Hiking",
    "Music",
    "Food",
    "Sports",
    "Reading",
    "Gaming",
    "Art",
    "Dancing",
  ];

  const GENDER_OPTIONS = ["Male", "Female", "Other"];
  const RELATIONSHIP_OPTIONS = [
    "Single",
    "In a relationship",
    "Prefer not to say",
  ];
  const DRINKING_OPTIONS = ["No", "Occasionally", "Yes"];
  const SMOKING_OPTIONS = ["No", "Occasionally", "Yes"];

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        {/* <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
          {userProfile.profilePictureNFT ? (
            <Image
              src={userProfile.profilePictureNFT}
              alt="Profile"
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          ) : (
            <User size={48} className="text-gray-500" />
          )}
        </div> */}
        <h2 className="text-xl font-bold">
          {userProfile.ens || "Your Profile"}
        </h2>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-1 text-pink-500 text-sm mt-1"
        >
          <Edit size={16} />
          Edit your profile
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {userProfile.hobbies?.length > 0 ? (
              userProfile.hobbies.map((hobby, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
                >
                  {hobby}
                </span>
              ))
            ) : (
              <p className="text-gray-400">No interests added</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Gender</p>
              <p>{GENDER_OPTIONS[userProfile.gender] || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Relationship</p>
              <p>
                {RELATIONSHIP_OPTIONS[userProfile.relationshipStatus] ||
                  "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Drinking</p>
              <p>{DRINKING_OPTIONS[userProfile.drinking] || "Not specified"}</p>
            </div>
            <div>
              <p className="text-gray-500">Smoking</p>
              <p>{SMOKING_OPTIONS[userProfile.smoking] || "Not specified"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg mt-4">
        <h3 className="font-medium mb-2">Photos</h3>

        <div className="grid grid-cols-3 gap-2">
          {/* Upload Button - appears first */}
          <IPFSUploader
            onUploadSuccess={(ipfsHash) => {
              const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${ipfsHash.replace("ipfs://", "")}`;
              setUserPhotos((prev) => [gatewayUrl, ...prev]);
            }}
            className="border-2 border-dashed border-gray-300 hover:border-gray-400"
          />

          {/* Existing Photos */}
          {userPhotos.map((photoUrl, index) => (
            <div key={index} className="aspect-square relative group">
              <Image
                width={200}
                height={200}
                src={photoUrl}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
                unoptimized={true}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setUserPhotos((prev) => prev.filter((_, i) => i !== index));
                }}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleEditSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ENS Name
                      </label>
                      <input
                        type="text"
                        value={editForm.ens}
                        onChange={(e) =>
                          setEditForm({ ...editForm, ens: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="yourname.eth"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture URL
                      </label>
                      <input
                        type="text"
                        value={editForm.profilePic}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            profilePic: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About Me
                      </label>
                      <textarea
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                        rows={3}
                        placeholder="Tell others about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {HOBBY_OPTIONS.map((hobby) => (
                          <button
                            key={hobby}
                            type="button"
                            onClick={() => {
                              const newHobbies = editForm.hobbies.includes(
                                hobby,
                              )
                                ? editForm.hobbies.filter((h) => h !== hobby)
                                : [...editForm.hobbies, hobby];
                              setEditForm({ ...editForm, hobbies: newHobbies });
                            }}
                            className={`px-3 py-1 rounded-full text-sm border ${
                              editForm.hobbies.includes(hobby)
                                ? "bg-pink-100 border-pink-300 text-pink-800"
                                : "bg-white border-gray-200 text-gray-700"
                            }`}
                          >
                            {hobby}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Relationship Status
                        </label>
                        <select
                          value={editForm.relationshipStatus}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              relationshipStatus: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          {RELATIONSHIP_OPTIONS.map((status, index) => (
                            <option key={status} value={index}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Drinking
                        </label>
                        <select
                          value={editForm.drinking}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              drinking: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          {DRINKING_OPTIONS.map((option, index) => (
                            <option key={option} value={index}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Smoking
                        </label>
                        <select
                          value={editForm.smoking}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              smoking: Number(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        >
                          {SMOKING_OPTIONS.map((option, index) => (
                            <option key={option} value={index}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isEditing}
                        className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 disabled:opacity-50"
                      >
                        {isEditing ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
