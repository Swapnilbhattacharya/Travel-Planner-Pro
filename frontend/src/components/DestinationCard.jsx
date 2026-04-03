import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

const DestinationCard = ({ data, onAdd }) => {
  // 1. Safely locate the raw image URL from the database
  let rawUrl = data.media?.heroImage || data.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800";
  
  // 2. PERFORMANCE COMPRESSOR: If it's an Unsplash image, force it to be lightweight!
  // This squashes the file size down to 600px wide at 80% quality.
  const imageUrl = rawUrl.includes('unsplash.com') && !rawUrl.includes('w=') 
    ? (rawUrl.includes('?') ? `${rawUrl}&w=600&q=80&auto=format` : `${rawUrl}?w=600&q=80&auto=format`)
    : rawUrl;
  
  // 3. Safely grab the location/country
  const locationText = data.country || data.location || "Global";

  return (
    <div 
      onClick={onAdd}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-slate-100 cursor-pointer flex flex-col h-full"
    >
      {/* IMAGE SECTION */}
      <div className="relative h-60 overflow-hidden bg-slate-100 flex-shrink-0">
        <img 
          src={imageUrl} 
          alt={data.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"; }} // Fallback if link is broken
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-800 shadow-sm">
            {data.type || data.tags?.[0] || 'Explore'}
          </span>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center text-blue-500 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-[11px] font-bold uppercase tracking-wider">{locationText}</span>
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{data.name}</h3>
        
        {/* We use flex-grow here to push the button to the bottom so all cards are equal height */}
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium flex-grow">
          {data.overview || data.description || "Discover the beauty and culture of this amazing destination."}
        </p>
        
        <button className="w-full bg-slate-50 text-blue-600 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-50">
          Plan This Trip
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default DestinationCard;