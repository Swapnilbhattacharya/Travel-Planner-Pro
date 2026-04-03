import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  // MMT Paradigm: We only track ONE active trip at a time
  const [activeTrip, setActiveTrip] = useState(null);

  // 1. Initial Sync: Pull the trip back into state on page load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activeTrip'));
    if (saved) setActiveTrip(saved);
  }, []);

  /**
   * Initialize a new trip
   * @param {Object} destination - The raw destination object from destinations.json
   * @param {Object} selectedDates - { start: Date, end: Date } from Home.jsx
   */
  const startPlanning = (destination, selectedDates) => {
    const newTrip = {
      id: destination.id,
      baseData: destination, // Holds hotels, flights, and sightseeing data
      // If dates weren't passed (fallback), we keep them null
      dates: selectedDates || { start: null, end: null }, 
      selectedHotel: null,
      selectedActivities: [],
      selectedFlight: null,
      totalBudget: 0
    };
    
    setActiveTrip(newTrip);
    localStorage.setItem('activeTrip', JSON.stringify(newTrip));
  };

  /**
   * Wipes the current planning session (Used after successful payment)
   */
  const clearTrip = () => {
    setActiveTrip(null);
    localStorage.removeItem('activeTrip');
  };

  // --- MMT FUNNEL LOGIC ---

  /**
   * 1. Select a Hotel (Replaces any previously selected hotel)
   */
  const selectHotel = (hotel) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, selectedHotel: hotel };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  /**
   * 2. Select a Flight (Replaces any previously selected flight)
   */
  const selectFlight = (flight) => {
    if (!activeTrip) return;
    const updatedTrip = { ...activeTrip, selectedFlight: flight };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  /**
   * 3. Add or Remove an Activity (Toggle logic for multi-select)
   */
  const toggleActivity = (activity) => {
    if (!activeTrip) return;
    
    const currentActivities = activeTrip.selectedActivities || [];
    const exists = currentActivities.find(a => a.activityId === activity.activityId);
    
    let newActivities;
    if (exists) {
      // Remove if already in itinerary
      newActivities = currentActivities.filter(a => a.activityId !== activity.activityId);
    } else {
      // Add if new
      newActivities = [...currentActivities, activity];
    }

    const updatedTrip = { ...activeTrip, selectedActivities: newActivities };
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  return (
    <PlanContext.Provider value={{ 
      activeTrip, 
      setActiveTrip, 
      startPlanning, 
      clearTrip, 
      selectHotel, 
      selectFlight, 
      toggleActivity 
    }}>
      {children}
    </PlanContext.Provider>
  );
};