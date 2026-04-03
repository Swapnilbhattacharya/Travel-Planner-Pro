import React from 'react';

const DestinationCard = ({ data, onAdd }) => {
  return (
    /* Changed aspect-[3/4] to aspect-square for a perfect square shape */
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square cursor-pointer">
      
      {/* 1. The Background Image */}
      <img 
        src={data.image} 
        alt={data.name} 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
      />

      {/* 2. The Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* 3. The Hover Content */}
      {/* Reduced padding from p-6 to p-4 to fit better in the shorter square shape */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-lg font-bold text-white truncate mr-2">{data.name}</h3>
          <span className="text-[9px] font-bold px-2 py-0.5 bg-blue-500 text-white rounded-md uppercase shrink-0">
            {data.budget}
          </span>
        </div>
        
        {/* line-clamp-2 ensures the text doesn't overflow the shorter card */}
        <p className="text-gray-200 text-xs mb-3 line-clamp-2">
          {data.description}
        </p>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAdd(data);
          }}
          className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
        >
          Add to Trip
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;