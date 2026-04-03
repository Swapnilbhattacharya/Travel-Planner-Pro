import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Map, Loader2, Info, Headphones } from 'lucide-react';

// ✅ BACK TO THE STANDARD IMPORT (This fixes the runtime error)
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";

import destinationsData from '../data/destinations.json';
import DestinationCard from '../components/DestinationCard';
import { PlanContext } from '../context/PlanContext';
const Home = () => {
  const { startPlanning } = useContext(PlanContext);
  const navigate = useNavigate();
  
  // State for Search & Dates
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filter, setFilter] = useState('All');
  
  // Infinite Scroll State
  const [displayCount, setDisplayCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef(null);

  // 1. IMPROVED SEARCH & FILTER LOGIC
  const filteredData = destinationsData.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'All' || dest.type === filter || dest.tags?.includes(filter);
    return matchesSearch && matchesFilter;
  });

  const visibleDestinations = Array.from({ length: displayCount }).map((_, index) => {
    if (filteredData.length === 0) return null;
    const actualItem = filteredData[index % filteredData.length]; 
    return { ...actualItem, uniqueDemoId: `${actualItem.id}-loop-${index}` };
  }).filter(Boolean);

  // 2. SEARCH HANDLER
  const handleSearchTrigger = () => {
    if (!startDate || !endDate) {
      alert("Please select your travel dates first!");
      return;
    }
    // If they searched for a specific place that exists, go there
    const exactMatch = filteredData.find(d => d.name.toLowerCase() === searchQuery.toLowerCase());
    if (exactMatch) {
      handleSelectDestination(exactMatch);
    } else {
      // Otherwise just scroll them to the results
      window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  const handleSelectDestination = (item) => {
    if (!startDate || !endDate) {
      alert("Please pick your dates in the search bar above before exploring!");
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    startPlanning(item, { start: startDate, end: endDate });
    navigate(`/trip/${item.id}`);
  };

  // Infinite Scroll Observer
  useEffect(() => {
    if (filteredData.length === 0) return;
    const currentTarget = observerTarget.current;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsLoading(true);
        setTimeout(() => {
          setDisplayCount(prev => prev + 8); 
          setIsLoading(false);
        }, 600); 
      }
    }, { threshold: 0.1 });
    if (currentTarget) observer.observe(currentTarget);
    return () => { if (currentTarget) observer.unobserve(currentTarget); };
  }, [displayCount, filteredData.length]);

  return (
    <div className="w-full pb-20 bg-white dark:bg-gray-950 transition-colors duration-500">
      
      {/* 1. HERO & SEARCH SECTION */}
      <div className="relative h-[500px] w-full flex items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200" className="absolute w-full h-full object-cover brightness-[0.4]" alt="Hero" />
        
        {/* NEW TOP RIGHT TABS */}
        <div className="absolute top-6 right-10 z-20 flex gap-6">
          <button className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm transition-colors">
            <Info size={18} /> About Us
          </button>
          <button className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm transition-colors">
            <Headphones size={18} /> Support
          </button>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-6">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-8 text-center leading-tight drop-shadow-2xl">The world is yours <br/> to explore.</h1>
          
          {/* SEARCH BAR ENGINE */}
          <div className="bg-white/95 dark:bg-gray-900/90 p-3 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center gap-2 backdrop-blur-xl">
            <div className="flex-1 w-full flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-gray-700">
              <Map className="text-blue-600 mr-3" size={24} />
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Destination</span>
                <input 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-bold text-slate-800 dark:text-gray-100 text-sm outline-none bg-transparent" 
                  placeholder="Where to?" 
                />
              </div>
            </div>
            
            <div className="flex-1 w-full flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-gray-700">
              <Calendar className="text-blue-600 mr-3" size={24} />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Dates</span>
                <div className="flex gap-1">
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    placeholderText="Start"
                    className="w-16 bg-transparent font-bold text-sm dark:text-white outline-none"
                  />
                  <span className="dark:text-white">-</span>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    placeholderText="End"
                    className="w-16 bg-transparent font-bold text-sm dark:text-white outline-none"
                  />
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSearchTrigger}
              className="w-full md:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/30"
            >
              <Search size={18} /> SEARCH
            </button>
          </div>
        </div>
      </div>

      {/* 2. GRID SECTION */}
      <div className="max-w-7xl mx-auto pt-20 px-6">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Popular Escapes</h2>
          <div className="flex gap-2">
            {['All', 'Adventure', 'Leisure', 'Cultural'].map(t => (
              <button key={t} onClick={() => setFilter(t)} className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${filter === t ? 'bg-slate-900 dark:bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 dark:text-white border dark:border-gray-700'}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {visibleDestinations.map(item => (
            <DestinationCard key={item.uniqueDemoId} data={item} onAdd={() => handleSelectDestination(item)} />
          ))}
        </div>

        <div ref={observerTarget} className="w-full flex justify-center py-10">
          {isLoading && <div className="flex items-center gap-3 text-blue-600 font-bold bg-blue-50 dark:bg-blue-900/30 px-6 py-3 rounded-full"><Loader2 className="animate-spin" size={20} /> Loading...</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;