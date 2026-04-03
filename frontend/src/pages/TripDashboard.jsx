import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import ItinerarySidebar from '../components/Itinerary/ItinerarySidebar';
import { ArrowLeft } from 'lucide-react';

const TripDashboard = () => {
  const { activeTrip } = useContext(PlanContext);

  // Safety catch: If they refresh and lose the state, tell them to go back
  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Trip session expired.</h2>
        <Link to="/" className="text-blue-600 underline">Return to Search</Link>
      </div>
    );
  }

  const dest = activeTrip.baseData;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* LEFT SIDE: The Elaborate Planning Area */}
      <div className="flex-1 p-8 lg:pr-[380px]">
        
        <Link to="/" className="flex items-center text-slate-500 hover:text-blue-600 mb-6 font-semibold w-fit transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Search
        </Link>

        {/* The Destination Hero Banner */}
        <div className="w-full h-80 rounded-3xl overflow-hidden relative mb-10 shadow-xl">
          <img src={dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
            <div>
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block">
                {dest.type || 'Destination'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white">{dest.name}</h1>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation Placeholder (Flights, Hotels, Activities) */}
        <div className="flex gap-8 border-b-2 border-slate-200 mb-8 pb-2">
          <button className="text-lg font-black text-blue-600 border-b-4 border-blue-600 pb-2 -mb-[10px]">Hotels</button>
          <button className="text-lg font-bold text-slate-400 hover:text-slate-600 transition-colors">Activities</button>
          <button className="text-lg font-bold text-slate-400 hover:text-slate-600 transition-colors">Flights</button>
        </div>

        <div className="text-slate-500 text-center py-20 border-2 border-dashed border-slate-300 rounded-2xl">
          <p className="font-bold text-xl">Hotel & Activity Cards will go here!</p>
          <p className="text-sm">Waiting for Alisha's nested database...</p>
        </div>

      </div>

      {/* RIGHT SIDE: The Sidebar is now scoped specifically to THIS trip */}
      <aside className="hidden lg:block w-[350px] fixed right-0 h-[calc(100vh-80px)] border-l bg-white z-10 shadow-2xl">
        <ItinerarySidebar />
      </aside>
    </div>
  );
};

export default TripDashboard;