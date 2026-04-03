import React, { useContext } from 'react';
import { PlanContext } from '../context/PlanContext';

const ItinerarySidebar = () => {
  const { plan } = useContext(PlanContext); // This pulls data from your Brain!

  return (
    <div className="w-80 bg-white shadow-2xl h-screen p-6 fixed right-0 top-0 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6">Your Trip Plan</h2>
      {plan.length === 0 ? (
        <p className="text-gray-400">No destinations added yet. Start exploring!</p>
      ) : (
        <div className="space-y-4">
          {plan.map(item => (
            <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
              <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItinerarySidebar;