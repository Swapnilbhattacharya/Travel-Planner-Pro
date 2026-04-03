import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const DestinationCard = ({ data, onAdd }) => {
  // 1. Safely locate the raw image URL from the database
  let rawUrl = data.media?.heroImage || data.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";
  
  // 2. PERFORMANCE COMPRESSOR: If it's an Unsplash image, force it to be lightweight!
  const imageUrl = rawUrl.includes('unsplash.com') && !rawUrl.includes('w=') 
    ? (rawUrl.includes('?') ? `${rawUrl}&w=600&q=80&auto=format` : `${rawUrl}?w=600&q=80&auto=format`)
    : rawUrl;
  
  // 3. Safely grab the location/country
  const locationText = data.country || data.location || "Global";

  return (
    <div 
      onClick={() => onAdd(data)}
      // Merged Layout: V2's stacked design + V1's Dark Mode classes
      className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 dark:border-gray-800 cursor-pointer flex flex-col h-full"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-gray-800 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"; }}
        />
        
        {/* V1's gradient overlay ported over for better image contrast on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:from-black/70" />

        <div className="absolute top-4 left-4 flex gap-2">
          {/* Main Category Badge (V2) */}
          <span className="px-3 py-1 bg-white/90 dark:bg-black/70 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800 dark:text-white shadow-sm">
            {data.type || data.tags?.[0] || 'Explore'}
          </span>
          
          {/* Budget Badge (V1 preserved) - Only shows if budget exists in data */}
          {data.budget && (
            <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
              {data.budget}
            </span>
          )}
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="p-6 flex flex-col flex-grow relative z-10">
        <div className="flex items-center text-blue-500 dark:text-blue-400 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">{locationText}</span>
        </div>
        
        {/* Dark Mode text colors integrated */}
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">{data.name}</h3>
        
        <p className="text-slate-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 font-medium flex-grow">
          {data.overview || data.description || "Discover the beauty and culture of this amazing destination."}
        </p>
        
        {/* The Button: Combines V1's stopPropagation & Dark Mode with V2's MMT Styling */}
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevents the card's root onClick from firing twice
            onAdd(data);
          }}
          className="w-full bg-slate-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-600 dark:group-hover:text-white transition-colors border border-blue-50 dark:border-gray-700 shadow-sm"
        >
          Plan This Trip
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;