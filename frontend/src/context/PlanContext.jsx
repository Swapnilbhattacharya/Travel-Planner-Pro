import React, { createContext, useState, useEffect } from 'react';

export const PlanContext = createContext();

export const PlanProvider = ({ children }) => {
  const [plan, setPlan] = useState([]);

  // Local Storage Sync (Bonus Feature)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tripPlan')) || [];
    setPlan(saved);
  }, []);

  const addToPlan = (item) => {
    if (!plan.some(p => p.id === item.id)) {
      const newPlan = [...plan, item];
      setPlan(newPlan);
      localStorage.setItem('tripPlan', JSON.stringify(newPlan));
    }
  };

  return (
    <PlanContext.Provider value={{ plan, addToPlan }}>
      {children}
    </PlanContext.Provider>
  );
};