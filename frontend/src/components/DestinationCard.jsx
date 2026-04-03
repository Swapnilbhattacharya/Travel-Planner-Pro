import React from 'react';

const DestinationCard = ({ data, onAdd }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow">
      <img src={data.image} alt={data.name} className="h-48 w-full object-cover" />
      <div className="p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold">{data.name}</h3>
          <span className="text-xs font-semibold px-2 py-1 bg-blue-50 text-blue-600 rounded-md uppercase">{data.budget}</span>
        </div>
        <p className="text-gray-500 text-sm mb-4">{data.description}</p>
        <button 
          onClick={() => onAdd(data)}
          className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition-all"
        >
          Add to Trip
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;