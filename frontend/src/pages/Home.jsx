import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Map } from 'lucide-react';
import destinationsData from '../data/destinations.json';
import DestinationCard from '../components/DestinationCard';
import { PlanContext } from '../context/PlanContext';

const Home = () => {
  const { startPlanning } = useContext(PlanContext);
  const navigate = useNavigate(); // The navigation engine
  const [filter, setFilter] = useState('All');

  // Filter logic remains, but now searches through Alisha's new data
  const filteredData = filter === 'All' 
    ? destinationsData 
    : destinationsData.filter(d => d.type === filter || (d.tags && d.tags.includes(filter)));

  // THE MMT LOGIC: When a user clicks a destination
  const handleSelectDestination = (item) => {
    startPlanning(item);          // 1. Lock this in as the active trip
    navigate(`/trip/${item.id}`); // 2. Send them to the dedicated dashboard page
  };

  return (
    <div className="w-full">
      {/* 1. MMT STYLE HERO SECTION */}
      <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800" 
          className="absolute w-full h-full object-cover brightness-[0.4]"
          alt="Travel Hero"
        />
        <div className="relative z-10 w-full max-w-5xl px-6">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter text-center leading-tight">
            The world is yours <br/> to explore.
          </h1>
          
          {/* THE SEARCH BOX */}
          <div className="bg-white/95 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-2 border border-white/40 backdrop-blur-xl">
            <div className="flex-1 w-full flex items-center px-4 py-3 hover:bg-slate-50/80 rounded-2xl transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-slate-200">
              <Map className="text-blue-600 mr-3" size={24} />
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destination</span>
                <input className="font-bold text-slate-800 text-sm outline-none bg-transparent placeholder-slate-800" placeholder="Where to?" />
              </div>
            </div>
            <div className="flex-1 w-full flex items-center px-4 py-3 hover:bg-slate-50/80 rounded-2xl transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-slate-200">
              <Calendar className="text-blue-600 mr-3" size={24} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Check In - Out</span>
                <span className="font-bold text-slate-800 text-sm">Select Dates</span>
              </div>
            </div>
            <button className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-200">
              <Search size={18} />
              SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* 2. THE INSPIRATION GRID */}
      <div className="max-w-7xl mx-auto py-20 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Popular Escapes</h2>
            <p className="text-slate-500 font-medium mt-1">Handpicked journeys to inspire you</p>
          </div>
          
          {/* Enhanced Filter Buttons */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['All', 'Adventure', 'Leisure', 'Cultural'].map(type => (
              <button 
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                  filter === type 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredData.map(item => (
            <DestinationCard 
              key={item.id} 
              data={item} 
              onAdd={() => handleSelectDestination(item)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;