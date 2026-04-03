import React, { useState, useContext } from 'react';
import destinationsData from '../data/destinations.json'; // Alisha's 50 spots
import DestinationCard from '../components/DestinationCard';
import { PlanContext } from '../context/PlanContext';

const Home = () => {
  const { addToPlan } = useContext(PlanContext);
  const [filter, setFilter] = useState('All');

  // Logic: Filter the 50+ items based on the button clicked
  const filteredData = filter === 'All' 
    ? destinationsData 
    : destinationsData.filter(d => d.type === filter);

  return (
    <div className="p-8">
      {/* 1. Filter Buttons (Chitresh can style these) */}
      <div className="flex gap-4 mb-10 overflow-x-auto pb-2">
        {['All', 'Adventure', 'Leisure', 'Cultural'].map(type => (
          <button 
            key={type}
            onClick={() => setFilter(type)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 2. The Dynamic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredData.map(item => (
          <DestinationCard 
            key={item.id} 
            data={item} 
            onAdd={addToPlan} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;