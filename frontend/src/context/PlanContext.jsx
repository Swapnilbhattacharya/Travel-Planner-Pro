import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  // MMT Paradigm: We only track ONE active trip at a time, not a shopping cart.
  const [activeTrip, setActiveTrip] = useState(null);

  // Local Storage Sync: Keep the trip alive if they refresh the page
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activeTrip'));
    if (saved) setActiveTrip(saved);
  }, []);

  // This replaces "addToPlan". It wipes any previous trip and focuses entirely on the new destination.
  const startPlanning = (destination) => {
    const newTrip = {
      id: destination.id,
      baseData: destination, // Holds Alisha's nested data (images, overviews)
      dates: { start: null, end: null },
      selectedHotel: null,
      selectedActivities: [],
      totalBudget: 0
    };
    
    setActiveTrip(newTrip);
    localStorage.setItem('activeTrip', JSON.stringify(newTrip));
  };

  const clearTrip = () => {
    setActiveTrip(null);
    localStorage.removeItem('activeTrip');
  };

  return (
    <PlanContext.Provider value={{ activeTrip, setActiveTrip, startPlanning, clearTrip }}>
      {children}
    </PlanContext.Provider>
  );
};