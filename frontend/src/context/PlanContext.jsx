import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [activeTrip, setActiveTrip] = useState(null);
  const [user, setUser] = useState(null);
  const [tripHistory, setTripHistory] = useState([]);

  useEffect(() => {
    const savedTrip = JSON.parse(localStorage.getItem('activeTrip'));
    if (savedTrip) setActiveTrip(savedTrip);

    const savedUser = JSON.parse(localStorage.getItem('travel_user'));
    if (savedUser) setUser(savedUser);

    const savedHistory = JSON.parse(localStorage.getItem('trip_history'));
    if (savedHistory) setTripHistory(savedHistory || []);
  }, []);

  const updateAndSaveTrip = (updatedTrip) => {
    setActiveTrip(updatedTrip);
    localStorage.setItem('activeTrip', JSON.stringify(updatedTrip));
  };

  // AUTH LOGIC
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('travel_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travel_user');
    localStorage.removeItem('activeTrip');
  };

  // TRIP & SELECTION LOGIC
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
    };
    updateAndSaveTrip(newTrip);
  };

  // REORDER LOGIC (Itinerary Builder Feature)
  const reorderActivities = (newOrder) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, selectedActivities: newOrder });
  };

  const setTripDates = (dates) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, dates });
  };

  const confirmHotelSelection = (hotel, room) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, selectedHotel: hotel, selectedRoom: room });
  };

  const clearHotelSelection = () => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, selectedHotel: null, selectedRoom: null });
  };

  const selectFlightSelection = (outbound, inbound, seatClass) => {
    if (!activeTrip) return;
    updateAndSaveTrip({ ...activeTrip, outboundFlight: outbound, returnFlight: inbound, flightClass: seatClass });
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

  // FINALIZATION (Save to Local Storage Feature)
  const completeBooking = () => {
    if (!activeTrip) return;
    const bookedTrip = {
      ...activeTrip,
      bookingId: `TRV-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed',
      bookedAt: new Date().toISOString()
    };
    const updatedHistory = [bookedTrip, ...tripHistory];
    setTripHistory(updatedHistory);
    localStorage.setItem('trip_history', JSON.stringify(updatedHistory));
    setActiveTrip(null);
    localStorage.removeItem('activeTrip');
  };

  return (
    <PlanContext.Provider value={{ 
      user, login, logout,
      activeTrip, startPlanning, 
      confirmHotelSelection, clearHotelSelection, 
      selectFlightSelection, clearFlightSelection, 
      toggleActivity, setTripDates,
      reorderActivities, completeBooking, tripHistory
    }}>
      {children}
    </PlanContext.Provider>
  );
};