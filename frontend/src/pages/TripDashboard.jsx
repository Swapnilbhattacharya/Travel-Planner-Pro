import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// Added X icon for the error prompt
import { ArrowLeft, Star, Clock, MapPin, Check, ChevronRight, Plane, Calendar, X } from 'lucide-react';

const TripDashboard = () => {
  const { activeTrip, selectHotel, selectFlight, toggleActivity, setTripDates } = useContext(PlanContext);
  const [activeTab, setActiveTab] = useState('hotels');
  const [showDateError, setShowDateError] = useState(false); // NEW: State for custom prompt
  const navigate = useNavigate();

  // 1. CALCULATE NIGHTS
  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const start = new Date(activeTrip.dates.start);
    const end = new Date(activeTrip.dates.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; 
  }, [activeTrip?.dates]);

  // 2. SAFETY CHECK
  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">Trip session expired.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  const dest = activeTrip.baseData;
  const hotels = dest.hotels || [];
  const activities = dest.sightseeing || [];
  const flights = dest.flights || [];

  const isActivitySelected = (activityId) => {
    return activeTrip.selectedActivities?.some(a => a.activityId === activityId);
  };

  // 3. CALCULATIONS
  const hotelBasePrice = activeTrip.selectedHotel?.pricePerNight || 0;
  const hotelTotal = hotelBasePrice * nights; 
  const flightTotal = activeTrip.selectedFlight?.price || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal + flightTotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-40 transition-colors duration-500 relative">
      
      {/* --- PROPER UI PROMPT --- */}
      {showDateError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-red-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-red-500/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Calendar size={20} />
              </div>
              <p className="font-bold text-sm tracking-tight">Please select your travel dates first!</p>
            </div>
            <button 
              onClick={() => setShowDateError(false)} 
              className="hover:bg-white/10 p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <Link to="/" className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold w-fit transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Search
        </Link>

        {/* DATE PLANNING SECTION */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border-2 border-blue-100 dark:border-blue-900/30 mb-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 transition-all">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-1">Planning for {dest.name}</h2>
            <p className={`font-medium text-sm transition-colors ${showDateError ? 'text-red-500 animate-pulse' : 'text-slate-500 dark:text-gray-400'}`}>
              {activeTrip.dates?.end 
                ? `Staying for ${nights} ${nights === 1 ? 'night' : 'nights'}` 
                : 'Pick your travel dates to calculate total cost'}
            </p>
          </div>
          <div className={`p-5 rounded-2xl flex items-center gap-4 w-full md:w-auto border transition-all duration-500 ${showDateError ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 scale-105' : 'bg-slate-50 dark:bg-gray-800 border-slate-100 dark:border-gray-700'}`}>
            <Calendar className={showDateError ? 'text-red-500' : 'text-blue-600'} size={24} />
            <DatePicker
              selectsRange={true}
              startDate={activeTrip.dates?.start ? new Date(activeTrip.dates.start) : null}
              endDate={activeTrip.dates?.end ? new Date(activeTrip.dates.end) : null}
              onChange={(update) => {
                setTripDates({ start: update[0], end: update[1] });
                if (update[0] && update[1]) setShowDateError(false); // Hide error once dates picked
              }}
              minDate={new Date()} 
              placeholderText="Choose your date range"
              className="bg-transparent font-black text-slate-800 dark:text-white outline-none cursor-pointer text-lg w-full"
            />
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="w-full h-80 md:h-[450px] rounded-[2rem] overflow-hidden relative mb-12 shadow-2xl">
          <img src={dest.media?.heroImage || dest.image} alt={dest.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex items-end p-8 md:p-12">
            <div>
              <span className="bg-blue-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">
                {dest.type || dest.tags?.[0] || 'Destination'}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-3 drop-shadow-lg leading-none">{dest.name}</h1>
              <p className="text-slate-200 font-medium text-xl flex items-center gap-2 drop-shadow-md"><MapPin size={20} /> {dest.country}</p>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-10 border-b-2 border-slate-200 dark:border-gray-800 mb-10 pb-0 overflow-x-auto whitespace-nowrap scrollbar-hide">
          {['hotels', 'activities', 'flights'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`text-xl font-black capitalize transition-all pb-4 border-b-4 -mb-[2px] ${activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-400 dark:text-gray-500 border-transparent hover:text-slate-600 dark:hover:text-gray-300'}`}>{tab}</button>
          ))}
        </div>

        {/* DYNAMIC CONTENT */}
        <div className="space-y-6">
          {activeTab === 'hotels' && hotels.map(hotel => {
            const isSelected = activeTrip.selectedHotel?.hotelId === hotel.hotelId;
            return (
              <div key={hotel.hotelId} className={`flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-blue-600 shadow-xl' : 'border-slate-100 dark:border-gray-800 shadow-sm'}`}>
                <img src={hotel.image} className="w-full md:w-72 h-56 md:h-auto object-cover" alt={hotel.name} />
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{hotel.name}</h3>
                    <span className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-3 py-1 rounded-xl text-sm"><Star size={16} className="mr-1 fill-current" /> {hotel.rating}</span>
                  </div>
                  <div className="flex justify-between items-end mt-6">
                    <div>
                      <p className="text-4xl font-black text-slate-900 dark:text-white">${hotel.pricePerNight}</p>
                      <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">per night</span>
                    </div>
                    <button onClick={() => selectHotel(hotel)} className={`px-8 py-4 rounded-2xl font-black transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-gray-800 dark:text-white hover:bg-slate-200'}`}>{isSelected ? 'SELECTED' : 'SELECT ROOM'}</button>
                  </div>
                </div>
              </div>
            );
          })}
          {/* ... Activities and Flights maps go here ... */}
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-gray-800 p-6 z-50 transition-colors">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="hidden sm:flex items-center gap-6">
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Trip Status</p>
              <div className="flex gap-2">
                <span className={`min-w-[110px] text-center px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${activeTrip.selectedFlight ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>FLIGHT {activeTrip.selectedFlight ? '✓' : '—'}</span>
                <span className={`min-w-[110px] text-center px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${activeTrip.selectedHotel ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>HOTEL {activeTrip.selectedHotel ? '✓' : '—'}</span>
                <span className={`min-w-[110px] text-center px-3 py-1 rounded-lg text-[10px] font-black transition-colors ${activeTrip.selectedActivities?.length > 0 ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>ACTIVITIES {activeTrip.selectedActivities?.length > 0 ? `(${activeTrip.selectedActivities.length})` : '—'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">TOTAL ESTIMATED ({nights} NIGHTS)</p>
              <div className="flex items-baseline gap-1 justify-end">
                <p className="text-4xl font-black dark:text-white leading-none">${tripTotal}</p>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">+ additional costs</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (!activeTrip.dates?.start || !activeTrip.dates?.end) {
                  // TRIGGER CUSTOM UI
                  setShowDateError(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Auto-dismiss after 4 seconds
                  setTimeout(() => setShowDateError(false), 4000);
                } else { 
                  navigate('/checkout'); 
                }
              }} 
              className={`px-10 py-5 rounded-2xl font-black text-xl flex items-center gap-3 transition-all ${tripTotal > 0 ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30 hover:bg-blue-500 active:scale-95' : 'bg-slate-200 dark:bg-gray-800 text-slate-400 dark:text-gray-600 cursor-not-allowed'}`}
              disabled={tripTotal === 0}
            >
              REVIEW TRIP <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;