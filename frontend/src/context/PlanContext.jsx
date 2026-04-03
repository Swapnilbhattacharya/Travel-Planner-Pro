import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  // MMT Paradigm: We only track ONE active trip at a time
  const [activeTrip, setActiveTrip] = useState(null);

  // Local Storage Sync
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activeTrip'));
    if (saved) setActiveTrip(saved);
  }, []);

  const startPlanning = (destination) => {
    const newTrip = {
      id: destination.id,
      baseData: destination, 
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

  // --- NEW FUNNEL LOGIC ---

  // Select a Hotel (Replaces any previously selected hotel)
  const selectHotel = (hotel) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, selectedHotel: hotel };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  // Add or Remove an Activity
  const toggleActivity = (activity) => {
    if (!activeTrip) return;
    
    // Safety check in case it's undefined
    const currentActivities = activeTrip.selectedActivities || [];
    
    // Check if the activity is already in the array
    const exists = currentActivities.find(a => a.activityId === activity.activityId);
    
    let newActivities;
    if (exists) {
      // If it exists, filter it out (Remove)
      newActivities = currentActivities.filter(a => a.activityId !== activity.activityId);
    } else {
      // If it doesn't exist, append it (Add)
      newActivities = [...currentActivities, activity];
    }

    const updatedTrip = { ...activeTrip, selectedActivities: newActivities };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  return (
    <PlanContext.Provider value={{ 
      activeTrip, setActiveTrip, startPlanning, clearTrip, selectHotel, toggleActivity 
    }}>
      {children}
    </PlanContext.Provider>
  );
};