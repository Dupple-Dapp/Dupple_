import React from 'react';

const ExplorePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4, 6].map((i) => (
          <div key={i} className="bg-gray-100 rounded-lg overflow-hidden h-48 shadow-md flex items-end">
            <div className="bg-gradient-to-t from-black/70 to-transparent text-white p-3 w-full">
              <h3 className="font-bold">Name, {20 + i}</h3>
              <p className="text-xs">{i + 2} miles away</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;