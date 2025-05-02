import React from 'react';
import { User } from "lucide-react";

const MessagesPage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search messages..." 
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <div className="space-y-4 mt-4">
        {['Sarah', 'Mike', 'Emma', 'John', 'Lisa'].map((name, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="text-gray-500" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{name}</h3>
              <p className="text-sm text-gray-500 truncate">Hey, how are you doing?</p>
            </div>
            <div className="text-xs text-gray-400">
              {index === 0 ? 'Now' : `${index}h ago`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessagesPage;