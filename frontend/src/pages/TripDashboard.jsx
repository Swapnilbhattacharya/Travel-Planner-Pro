import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  ArrowLeft, MapPin, Check, ChevronRight, Plane, 
  Calendar, X, Hotel, CheckCircle, Map as MapIcon, 
  Trash2, Info, ChevronUp, ChevronDown, Sparkles 
} from 'lucide-react';

const TripDashboard = () => {
  const { 
    activeTrip, toggleActivity, setTripDates, 
    clearHotelSelection, clearFlightSelection, reorderActivities 
  } = useContext(PlanContext);
  
  const [showDateError, setShowDateError] = useState(false);
  const navigate = useNavigate();

  // 1. CALCULATE NIGHTS FOR PRICING
  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const start = new Date(activeTrip.dates.start);
    const end = new Date(activeTrip.dates.end);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; 
  }, [activeTrip?.dates]);

  if (!activeTrip) return null;
  const dest = activeTrip.baseData;

  // 2. BONUS FEATURE: DYNAMIC TRAVEL TIPS
  const getTips = () => {
    const tips = ["Book tickets for local attractions in advance to skip lines."];
    if (dest.tags?.includes("Nature")) tips.push("Pack waterproof gear and sturdy hiking boots.");
    if (dest.tags?.includes("Urban")) tips.push("Download the local metro map for offline navigation.");
    if (dest.tags?.includes("Beach")) tips.push("Apply high-SPF sunscreen every 2 hours.");
    if (dest.budget === "High") tips.push("Make dinner reservations at least 48 hours early.");
    return tips;
  };

  // 3. BONUS FEATURE: ITINERARY REORDERING (DRAG-AND-DROP LOGIC)
  const moveActivity = (index, direction) => {
    const newArr = [...activeTrip.selectedActivities];
    const target = index + direction;
    if (target < 0 || target >= newArr.length) return;
    [newArr[index], newArr[target]] = [newArr[target], newArr[index]];
    reorderActivities(newArr);
  };

  // 4. MASTER PRICE CALCULATION
  const multipliers = { 'Economy': 1, 'Premium': 1.5, 'Business': 3, 'First Class': 5 };
  const currentMultiplier = multipliers[activeTrip.flightClass] || 1;
  
  const flightTotal = ((activeTrip.outboundFlight?.price || 0) + (activeTrip.returnFlight?.price || 0)) * currentMultiplier;
  const hotelTotal = activeTrip.selectedHotel 
    ? (activeTrip.selectedHotel.pricePerNight + (activeTrip.selectedRoom?.price || 0)) * nights 
    : 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  
  const tripTotal = Math.round(hotelTotal + activitiesTotal + flightTotal);
  const hasSelections = activeTrip.outboundFlight || activeTrip.selectedHotel || activeTrip.selectedActivities.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-44 transition-colors relative animate-in fade-in duration-700">
      
      {/* --- NOTIFICATION: DATE ERROR --- */}
      {showDateError && (
        <div className="fixed top-24 left-0 right-0 z-[100] flex justify-center px-6 animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-white/20">
            <Calendar size={20} />
            <div>
              <p className="font-black text-sm tracking-tight uppercase">Dates Required</p>
              <p className="text-xs font-bold opacity-90">Please select travel dates at the top first!</p>
            </div>
            <button onClick={() => setShowDateError(false)} className="ml-4 hover:bg-white/10 p-1 rounded-lg"><X size={18} /></button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <Link to="/home" className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-bold transition-colors w-fit">
          <ArrowLeft size={18} className="mr-2" /> Back to Search
        </Link>

        {/* 1. DATE PLANNING SECTION */}
        <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border-2 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm transition-all duration-500 ${showDateError ? 'border-red-500 ring-4 ring-red-500/10' : 'border-blue-100 dark:border-blue-900/30'}`}>
          <div>
            <h2 className="text-2xl font-black dark:text-white leading-tight uppercase tracking-tighter">Planning for {dest.name}</h2>
            <p className={`text-sm font-medium transition-colors ${showDateError ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
              {activeTrip.dates?.end ? `Adventure for ${nights} ${nights === 1 ? 'night' : 'nights'}` : 'Pick dates to enable calculations'}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl flex items-center gap-4 w-full md:w-auto border dark:border-gray-700 shadow-inner">
            <Calendar className={showDateError ? 'text-red-500' : 'text-blue-600'} size={24} />
            <DatePicker
              selectsRange startDate={activeTrip.dates?.start ? new Date(activeTrip.dates.start) : null}
              endDate={activeTrip.dates?.end ? new Date(activeTrip.dates.end) : null}
              onChange={(u) => { setTripDates({ start: u[0], end: u[1] }); if (u[1]) setShowDateError(false); }}
              minDate={new Date()} placeholderText="Choose date range"
              className="bg-transparent font-black dark:text-white outline-none cursor-pointer w-full"
            />
          </div>
        </div>

        {/* 2. BONUS FEATURE: INTERACTIVE MAP INTEGRATION */}
        <div className="mb-12 h-80 w-full rounded-[3rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl relative group">
           <iframe
             width="100%"
             height="100%"
             frameBorder="0"
             style={{ border: 0 }}
             title="destination-map"
             src={`https://maps.google.com/maps?q=${encodeURIComponent(dest.name + "," + dest.country)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
             allowFullScreen
             className="grayscale group-hover:grayscale-0 transition-all duration-1000"
           ></iframe>

           <div className="absolute bottom-6 left-6 z-10 pointer-events-none">
              <div className="bg-white/90 dark:bg-gray-900/90 px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 border dark:border-gray-800 backdrop-blur-md">
                <MapPin size={20} className="text-blue-600 animate-bounce" />
                <span className="font-black dark:text-white uppercase tracking-widest text-xs">Explore {dest.name}</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <div className="lg:col-span-2 space-y-8">
            
            {/* 3. SELECTION HUB (Transport & Stay) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transport Launcher */}
              <div onClick={() => navigate('/book-flight')} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all hover:-translate-y-1 ${activeTrip.outboundFlight ? 'border-green-500 bg-white dark:bg-gray-900 shadow-xl' : 'border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-blue-400'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-xl ${activeTrip.outboundFlight ? 'bg-green-100 text-green-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}><Plane size={28} /></div>
                  {activeTrip.outboundFlight && <button onClick={(e) => { e.stopPropagation(); clearFlightSelection(); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={18} /></button>}
                </div>
                <h3 className="text-xl font-black dark:text-white leading-tight">{activeTrip.outboundFlight ? activeTrip.outboundFlight.airline : 'Transport'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{activeTrip.outboundFlight ? activeTrip.flightClass : 'Tap to select flights'}</p>
                <div className="mt-6 flex items-center gap-2 font-black text-[10px] text-blue-600 uppercase tracking-widest">
                  {activeTrip.outboundFlight ? <span className="text-green-500 flex items-center gap-2"><Check size={14}/> Confirmed</span> : 'Choose Airline'} <ChevronRight size={14}/>
                </div>
              </div>

              {/* Stay Launcher */}
              <div onClick={() => navigate('/book-hotel')} className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all hover:-translate-y-1 ${activeTrip.selectedHotel ? 'border-green-500 bg-white dark:bg-gray-900 shadow-xl' : 'border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-purple-400'}`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-xl ${activeTrip.selectedHotel ? 'bg-green-100 text-green-600' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600'}`}><Hotel size={28} /></div>
                  {activeTrip.selectedHotel && <button onClick={(e) => { e.stopPropagation(); clearHotelSelection(); }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"><Trash2 size={18} /></button>}
                </div>
                <h3 className="text-xl font-black dark:text-white leading-tight">{activeTrip.selectedHotel ? activeTrip.selectedHotel.name : 'Stay'}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{activeTrip.selectedHotel ? (activeTrip.selectedRoom?.name || 'Standard') : 'Tap to select hotel'}</p>
                <div className="mt-6 flex items-center gap-2 font-black text-[10px] text-purple-600 uppercase tracking-widest">
                  {activeTrip.selectedHotel ? <span className="text-green-500 flex items-center gap-2"><Check size={14}/> Confirmed</span> : 'Choose Room'} <ChevronRight size={14}/>
                </div>
              </div>
            </div>

            {/* 4. BONUS FEATURE: ITINERARY BUILDER (Activity Schedule) */}
            {activeTrip.selectedActivities.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border-2 border-blue-50 dark:border-gray-800 shadow-sm animate-in slide-in-from-left duration-500">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <Sparkles className="text-blue-600" size={24}/>
                    <h3 className="text-2xl font-black dark:text-white tracking-tighter uppercase">Daily Itinerary</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase">Reorder using arrows</span>
                </div>
                <div className="space-y-4">
                  {activeTrip.selectedActivities.map((act, index) => (
                    <div key={act.activityId} className="group flex items-center gap-4 bg-slate-50 dark:bg-gray-800/50 p-6 rounded-3xl border border-transparent hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                      <div className="flex flex-col gap-2">
                        <button onClick={() => moveActivity(index, -1)} className="text-slate-300 hover:text-blue-600 transition-colors"><ChevronUp size={20}/></button>
                        <button onClick={() => moveActivity(index, 1)} className="text-slate-300 hover:text-blue-600 transition-colors"><ChevronDown size={20}/></button>
                      </div>
                      <div className="flex-1">
                         <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">Activity {index + 1}</p>
                         <p className="font-bold text-lg dark:text-white leading-tight">{act.title}</p>
                         <p className="text-xs text-slate-400 font-medium mt-1">{act.duration} • {act.type}</p>
                      </div>
                      <button onClick={() => toggleActivity(act)} className="p-3 bg-white dark:bg-gray-700 text-slate-400 hover:text-red-500 rounded-xl shadow-sm transition-all"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. SIDEBAR: TIPS & ACTIVITY FEED */}
          <div className="space-y-6 lg:sticky lg:top-28">
             {/* Dynamic Recommendations */}
             <div className="bg-amber-500 dark:bg-amber-600/20 p-8 rounded-[2.5rem] text-white dark:text-amber-200 shadow-xl shadow-amber-500/10">
                <div className="flex items-center gap-2 mb-6 opacity-90"><Info size={18}/><h4 className="font-black uppercase tracking-widest text-xs">Travel Smart</h4></div>
                <ul className="space-y-4">
                   {getTips().map((tip, i) => (
                     <li key={i} className="text-sm font-bold leading-relaxed flex gap-3"><div className="w-1.5 h-1.5 rounded-full bg-white/50 mt-2 shrink-0"/> {tip}</li>
                   ))}
                </ul>
             </div>

             {/* Activity Discovery Panel */}
             <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Local Experiences</p>
                <div className="space-y-3">
                   {dest.sightseeing?.map(act => {
                     const isSelected = activeTrip.selectedActivities?.some(a => a.activityId === act.activityId);
                     return (
                       <button key={act.activityId} onClick={() => toggleActivity(act)} className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex justify-between items-center group ${isSelected ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent bg-slate-50 dark:bg-gray-800 hover:border-slate-200'}`}>
                          <div>
                            <span className="text-sm font-bold block dark:text-gray-200">{act.title}</span>
                            <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors">${act.price} • {act.duration}</span>
                          </div>
                          {isSelected ? <CheckCircle size={18} className="text-blue-600 animate-in zoom-in duration-300"/> : <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform"/>}
                       </button>
                     );
                   })}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 6. STICKY FOOTER (Final Action) */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t dark:border-gray-800 p-6 z-50 transition-all">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Status Indicators */}
          <div className="flex gap-4">
            <div className={`flex flex-col items-center px-5 py-2 rounded-2xl border transition-all ${activeTrip.outboundFlight ? 'bg-green-100/50 border-green-200 text-green-700' : 'bg-slate-100 dark:bg-gray-800 border-transparent text-slate-400'}`}>
              <p className="text-[9px] font-black uppercase tracking-tight">Transport</p>
              <Check size={14} className={activeTrip.outboundFlight ? 'opacity-100' : 'opacity-20'} />
            </div>
            <div className={`flex flex-col items-center px-5 py-2 rounded-2xl border transition-all ${activeTrip.selectedHotel ? 'bg-green-100/50 border-green-200 text-green-700' : 'bg-slate-100 dark:bg-gray-800 border-transparent text-slate-400'}`}>
              <p className="text-[9px] font-black uppercase tracking-tight">Stay</p>
              <Check size={14} className={activeTrip.selectedHotel ? 'opacity-100' : 'opacity-20'} />
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Grand Total ({nights} Nights)</p>
              <div className="flex items-baseline gap-1 justify-end">
                <p className="text-4xl font-black dark:text-white leading-none">${tripTotal}</p>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">incl. tax</span>
              </div>
            </div>
            <button 
              onClick={() => {
                if (!activeTrip.dates?.start || !activeTrip.dates?.end) {
                  setShowDateError(true);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (!hasSelections) {
                  alert("Please select at least one item (Transport, Stay, or Experience) to proceed.");
                } else {
                  navigate('/checkout');
                }
              }} 
              className={`px-12 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all ${tripTotal > 0 ? 'bg-blue-600 text-white shadow-2xl hover:bg-blue-500 active:scale-95 shadow-blue-500/30' : 'bg-slate-200 dark:bg-gray-800 text-slate-400 cursor-not-allowed'}`}
            >
              REVIEW ITINERARY <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;