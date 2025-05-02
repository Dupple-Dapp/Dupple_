import React from 'react';
import { User } from "lucide-react";

const ProfilePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
          <User size={48} className="text-gray-500" />
        </div>
        <h2 className="text-xl font-bold">Your Name</h2>
        <p className="text-gray-500">Edit your profile</p>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">About Me</h3>
          <p className="text-gray-600">Adventure enthusiast and coffee lover. Looking for someone to share experiences with.</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {['Travel', 'Photography', 'Hiking', 'Music', 'Food'].map((interest, i) => (
              <span key={i} className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200">
                {interest}
              </span>
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">My Photos</h3>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-md flex items-center justify-center">
                <span className="text-gray-400 text-xs">Photo {i}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;