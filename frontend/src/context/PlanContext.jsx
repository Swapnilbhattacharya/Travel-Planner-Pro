import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('activeTrip'));
    if (saved) setActiveTrip(saved);
  }, []);

  const updateAndSaveTrip = (updatedTrip) => {
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  const startPlanning = (destination, selectedDates) => {
    const newTrip = {
      id: destination.id,
      baseData: destination,
      dates: selectedDates || { start: null, end: null },
      selectedHotel: null,
      selectedRoom: null,
      outboundFlight: null,
      returnFlight: null,
      flightClass: 'Economy',
      selectedActivities: [],
      totalBudget: 0
    };
    updateAndSaveTrip(newTrip);
  };

  const setTripDates = (dates) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, dates });
  };

  // UNIFIED FIX: Prevents the race condition between hotel and room selection
  const confirmHotelSelection = (hotel, room) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ 
      ...activeTrip, 
      selectedHotel: hotel, 
      selectedRoom: room 
    });
  };

  const clearHotelSelection = () => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, selectedHotel: null, selectedRoom: null });
  };

  const selectFlightSelection = (outbound, inbound, seatClass) => {
    if (!activeTrip) return;
    updateAndSaveTrip({
      ...activeTrip,
      outboundFlight: outbound,
      returnFlight: inbound,
      flightClass: seatClass
    });
  };

  const clearFlightSelection = () => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, outboundFlight: null, returnFlight: null });
  };

  const toggleActivity = (activity) => {
    if (!activeTrip) return;
    const current = activeTrip.selectedActivities || [];
    const exists = current.find(a => a.activityId === activity.activityId);
    let newActivities = exists 
      ? current.filter(a => a.activityId !== activity.activityId)
      : [...current, activity];
    updateAndSaveTrip({ ...activeTrip, selectedActivities: newActivities });
  };

  const clearTrip = () => {
    setActiveTrip(null);
    localStorage.removeItem('activeTrip');
  };

  return (
    <PlanContext.Provider value={{ 
      activeTrip, startPlanning, clearTrip, 
      confirmHotelSelection, clearHotelSelection, 
      selectFlightSelection, clearFlightSelection, 
      toggleActivity, setTripDates 
    }}>
      {children}
    </PlanContext.Provider>
  );
};