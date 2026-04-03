import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activeTrip'));
    if (saved) setActiveTrip(saved);
  }, []);

  const startPlanning = (destination, selectedDates) => {
    const newTrip = {
      id: destination.id,
      baseData: destination,
      dates: selectedDates || { start: null, end: null }, 
      selectedHotel: null,
      selectedActivities: [],
      selectedFlight: null,
      totalBudget: 0
    };
    
    setActiveTrip(newTrip);
    localStorage.setItem('activeTrip', JSON.stringify(newTrip));
  };

  // NEW: Update dates from the Dashboard
  const setTripDates = (dates) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, dates };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  const clearTrip = () => {
    setActiveTrip(null);
    localStorage.removeItem('activeTrip');
  };

  const selectHotel = (hotel) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, selectedHotel: hotel };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  const selectFlight = (flight) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, selectedFlight: flight };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  const toggleActivity = (activity) => {
    if (!activeTrip) return;
    const currentActivities = activeTrip.selectedActivities || [];
    const exists = currentActivities.find(a => a.activityId === activity.activityId);
    let newActivities = exists 
      ? currentActivities.filter(a => a.activityId !== activity.activityId)
      : [...currentActivities, activity];

    const updatedTrip = { ...activeTrip, selectedActivities: newActivities };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  return (
    <PlanContext.Provider value={{ 
      activeTrip, setActiveTrip, startPlanning, clearTrip, 
      selectHotel, selectFlight, toggleActivity, setTripDates 
    }}>
      {children}
    </PlanContext.Provider>
  );
};