import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Map, Info, Headphones, MapPin, Loader2 } from 'lucide-react';
import destinationsData from '../data/destinations.json';
import DestinationCard from '../components/DestinationCard';
import { PlanContext } from '../context/PlanContext';

const Home = () => {
  const { startPlanning } = useContext(PlanContext);
  const navigate = useNavigate();
  
  // 1. STATE FOR SEARCH & FILTERS
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState('All');

  // 2. STATE FOR INFINITE SCROLL
  const [displayCount, setDisplayCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  // --- LOGIC: AUTOCOMPLETE (Search Bar Only) ---
  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = destinationsData.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.country.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // --- LOGIC: GRID DATA (Filtered by Category) ---
  const gridData = filter === 'All' 
    ? destinationsData 
    : destinationsData.filter(d => d.type === filter || d.tags?.includes(filter));

  // The "Loop Hack" for infinite demo scrolling
  const visibleDestinations = Array.from({ length: displayCount }).map((_, index) => {
    const actualItem = gridData[index % gridData.length]; 
    return { ...actualItem, uniqueDemoId: `${actualItem.id}-loop-${index}` };
  });

  // --- THE SCROLL ENGINE (Intersection Observer) ---
  useEffect(() => {
    if (gridData.length === 0) return;

    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(entries => {
      // When the trigger box at the bottom is seen...
      if (entries[0].isIntersecting && !isLoading) {
        setIsLoading(true);
        // Fake a network delay
        setTimeout(() => {
          setDisplayCount(prev => prev + 8); 
          setIsLoading(false);
        }, 600); 
      }
    }, { threshold: 0.1 });

    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [displayCount, gridData.length, isLoading]);

  const handleSelectDestination = (item) => {
    startPlanning(item, { start: null, end: null }); 
    navigate(`/trip/${item.id}`);
  };

  return (
    <div className="w-full pb-20 bg-white dark:bg-gray-950 transition-colors duration-500">
      
      {/* HERO SECTION */}
      <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200" className="absolute w-full h-full object-cover brightness-[0.4]" alt="Hero" />
        
        {/* TOP RIGHT LINKS */}
        <div className="absolute top-6 right-10 z-20 flex gap-6">
          <button className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm transition-colors"><Info size={18} /> About Us</button>
          <button className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm transition-colors"><Headphones size={18} /> Support</button>
        </div>

        <div className="relative z-30 w-full max-w-4xl px-6">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 text-center leading-tight drop-shadow-2xl">The world is yours <br/> to explore.</h1>
          
          {/* SEARCH BOX */}
          <div className="relative group">
            <div className="bg-white dark:bg-gray-900 p-2 rounded-3xl shadow-2xl flex items-center gap-2 border border-white/20 dark:border-gray-800 backdrop-blur-xl transition-all">
              <div className="flex-1 flex items-center px-6 py-4">
                <Map className="text-blue-600 mr-4" size={24} />
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full font-bold text-slate-800 dark:text-gray-100 text-lg outline-none bg-transparent" 
                  placeholder="Where to? (e.g. Santorini, Banff)" 
                />
              </div>
              <button className="bg-blue-600 text-white p-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30">
                <Search size={24} />
              </button>
            </div>

            {/* AUTOCOMPLETE DROPDOWN */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map(dest => (
                  <button 
                    key={dest.id}
                    onClick={() => handleSelectDestination(dest)}
                    className="w-full flex items-center gap-4 p-5 hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors border-b last:border-0 border-slate-50 dark:border-gray-800 text-left"
                  >
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600"><MapPin size={20} /></div>
                    <div>
                      <p className="font-black text-slate-900 dark:text-white">{dest.name}</p>
                      <p className="text-sm font-bold text-slate-400 dark:text-gray-500">{dest.country}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* POPULAR ESCAPES GRID */}
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">Popular Escapes</h2>
            <p className="text-slate-500 dark:text-gray-400 font-medium">Click any card to start planning</p>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {['All', 'Adventure', 'Leisure', 'Cultural'].map(t => (
              <button key={t} onClick={() => { setFilter(t); setDisplayCount(8); }} className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${filter === t ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleDestinations.map(item => (
            <DestinationCard 
              key={item.uniqueDemoId} 
              data={item} 
              onAdd={() => handleSelectDestination(item)} 
            />
          ))}
        </div>

        {/* 🌟 THE TRIGGER BOX FOR INFINITE SCROLL */}
        <div ref={observerTarget} className="w-full flex justify-center py-20">
          {isLoading && (
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-8 py-4 rounded-full shadow-sm">
              <Loader2 className="animate-spin" size={24} />
              Finding more escapes...
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Home;