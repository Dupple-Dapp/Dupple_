import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-100 rounded-xl shadow-md overflow-hidden h-96 flex items-center justify-center">
        <div className="text-center p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Sarah, 25</h2>
          <p className="text-gray-600">5 miles away</p>
          <div className="flex justify-center mt-6 gap-6">
            <button className="bg-white rounded-full p-4 shadow-md">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <button className="bg-gradient-to-r from-pink-500 to-red-500 rounded-full p-4 shadow-md">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;