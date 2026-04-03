import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Map, Loader2 } from 'lucide-react';
import destinationsData from '../data/destinations.json';
import DestinationCard from '../components/DestinationCard';
import { PlanContext } from '../context/PlanContext';

const Home = () => {
  const { startPlanning } = useContext(PlanContext);
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  
  // --- INFINITE SCROLL STATE ---
  const [displayCount, setDisplayCount] = useState(8); // Start by showing 8 cards
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null); // This is our invisible trigger at the bottom

  // 1. Filter the base data from your JSON file
  const filteredData = filter === 'All' 
    ? destinationsData 
    : destinationsData.filter(d => d.type === filter || (d.tags && d.tags.includes(filter)));

  // 2. THE INFINITE LOOP HACK (For Demos without an API)
  // Instead of stopping when we run out of data, we use the remainder operator (%) 
  // to loop back to the beginning of your JSON file automatically!
  const visibleDestinations = Array.from({ length: displayCount }).map((_, index) => {
    const actualItem = filteredData[index % filteredData.length]; 
    return { 
      ...actualItem, 
      // React needs a unique key, so we generate a fake one for the duplicates
      uniqueDemoId: `${actualItem.id}-loop-${index}` 
    };
  });

  // 3. THE SCROLL ENGINE (With Memory Leak Fix)
  useEffect(() => {
    // If there is no data to show, don't run the observer
    if (filteredData.length === 0) return;

    // 🌟 THE FIX: Lock the current ref into a local constant right away
    const currentObserverTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        // When the invisible trigger box hits the screen...
        if (entries[0].isIntersecting) {
          setIsLoading(true);
          
          // ...wait for 800ms (to fake network lag), then add 8 more cards!
          setTimeout(() => {
            setDisplayCount(prev => prev + 8); 
            setIsLoading(false);
          }, 600); 
        }
      },
      { threshold: 0.1 }
    );

    // Use the locked constant to observe
    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    // Use the locked constant to cleanup safely!
    return () => {
      if (currentObserverTarget) observer.unobserve(currentObserverTarget);
    };
  }, [displayCount, filteredData.length]);

  // Reset the scroll back to 8 items if the user clicks a filter button
  useEffect(() => {
    setDisplayCount(8);
  }, [filter]);

  const handleSelectDestination = (item) => {
    startPlanning(item);
    navigate(`/trip/${item.id}`); // Important: use item.id, NOT the fake uniqueDemoId
  };

  return (
    <div className="w-full pb-20">
      {/* 1. MMT STYLE HERO SECTION */}
      <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80" 
          className="absolute w-full h-full object-cover brightness-[0.4]"
          alt="Travel Hero"
        />
        <div className="relative z-10 w-full max-w-5xl px-6 mt-10">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 tracking-tighter text-center leading-tight drop-shadow-xl">
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
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Popular Escapes</h2>
            <p className="text-slate-500 font-medium mt-1">Handpicked journeys to inspire you</p>
          </div>
          
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

        {/* 3. MAPPING THE INFINITE LOOP DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredData.length > 0 ? (
            visibleDestinations.map(item => (
              <DestinationCard 
                key={item.uniqueDemoId} // Use the fake ID here
                data={item} 
                onAdd={() => handleSelectDestination(item)} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-slate-500 font-bold">
              No destinations found for this filter.
            </div>
          )}
        </div>

        {/* 4. THE INVISIBLE TRIGGER BOX */}
        <div ref={observerTarget} className="w-full flex justify-center py-10 mt-8">
          {isLoading && filteredData.length > 0 && (
            <div className="flex items-center gap-3 text-blue-600 font-bold bg-blue-50 px-6 py-3 rounded-full shadow-sm">
              <Loader2 className="animate-spin" size={20} />
              Loading more adventures...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;