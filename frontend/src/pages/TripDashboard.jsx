import React, { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  ArrowLeft, MapPin, Check, ChevronRight, Plane, 
  Calendar, X, Hotel, CheckCircle, Map as MapIcon, Trash2 
} from 'lucide-react';

const TripDashboard = () => {
  const { 
    activeTrip, toggleActivity, setTripDates, 
    clearHotelSelection, clearFlightSelection 
  } = useContext(PlanContext);
  
  const [showDateError, setShowDateError] = useState(false);
  const navigate = useNavigate();

  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const start = new Date(activeTrip.dates.start);
    const end = new Date(activeTrip.dates.end);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1; 
  }, [activeTrip?.dates]);

  if (!activeTrip) return null;
  const dest = activeTrip.baseData;

  // MASTER PRICE CALCULATION
  const flightClassMultipliers = { 'Economy': 1, 'Premium': 1.5, 'Business': 3, 'First Class': 5 };
  const currentMultiplier = flightClassMultipliers[activeTrip.flightClass] || 1;
  const flightTotal = ((activeTrip.outboundFlight?.price || 0) + (activeTrip.returnFlight?.price || 0)) * currentMultiplier;

  const hotelTotal = activeTrip.selectedHotel 
    ? (activeTrip.selectedHotel.pricePerNight + (activeTrip.selectedRoom?.price || 0)) * nights 
    : 0;

  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = Math.round(hotelTotal + activitiesTotal + flightTotal);

  const hasSelections = activeTrip.outboundFlight || activeTrip.selectedHotel || activeTrip.selectedActivities.length > 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-44 transition-colors relative">
      {showDateError && (
        <div className="fixed top-24 left-0 right-0 z-[100] flex justify-center px-6 animate-in fade-in slide-in-from-top-4">
          <div className="bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <Calendar size={20} /><p className="font-bold text-sm tracking-tight">Please select travel dates first!</p>
            <button onClick={() => setShowDateError(false)} className="ml-4"><X size={18} /></button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <Link to="/" className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold"><ArrowLeft size={18} className="mr-2" /> Back</Link>

        {/* DATE PICKER */}
        <div className={`bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border-2 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${showDateError ? 'border-red-500' : 'border-blue-100 dark:border-blue-900/30'}`}>
          <div>
            <h2 className="text-2xl font-black dark:text-white">Planning for {dest.name}</h2>
            <p className="text-sm font-medium text-slate-500">{activeTrip.dates?.end ? `Adventure for ${nights} nights` : 'Pick dates to enable calculation'}</p>
          </div>
          <div className="bg-slate-50 dark:bg-gray-800 p-5 rounded-2xl flex items-center gap-4 w-full md:w-auto border dark:border-gray-700">
            <Calendar className="text-blue-600" size={24} />
            <DatePicker
              selectsRange startDate={activeTrip.dates?.start ? new Date(activeTrip.dates.start) : null}
              endDate={activeTrip.dates?.end ? new Date(activeTrip.dates.end) : null}
              onChange={(u) => { setTripDates({ start: u[0], end: u[1] }); if (u[1]) setShowDateError(false); }}
              minDate={new Date()} placeholderText="Choose date range" className="bg-transparent font-black dark:text-white outline-none cursor-pointer w-full"
            />
          </div>
        </div>

        {/* LAUNCHER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div onClick={() => navigate('/book-flight')} className={`group p-10 rounded-[3rem] border-2 cursor-pointer transition-all flex flex-col justify-between h-[340px] relative ${activeTrip.outboundFlight ? 'border-green-500 bg-white dark:bg-gray-900 shadow-xl' : 'border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
            <div className="flex justify-between items-start w-full">
              <div className={`p-5 rounded-2xl ${activeTrip.outboundFlight ? 'bg-green-100 text-green-600' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}><Plane size={36} /></div>
              {activeTrip.outboundFlight && <button onClick={(e) => { e.stopPropagation(); clearFlightSelection(); }} className="p-2 text-red-500"><Trash2 size={20} /></button>}
            </div>
            <div><h3 className="text-3xl font-black dark:text-white mb-2 tracking-tighter">Transport</h3><p className="text-slate-500 font-medium">{activeTrip.outboundFlight ? `${activeTrip.outboundFlight.airline} • ${activeTrip.flightClass}` : 'Select your journey flights'}</p></div>
            <div className="flex items-center gap-2 font-black text-xs tracking-widest text-blue-600 uppercase">
              {activeTrip.outboundFlight ? <span className="text-green-500 flex items-center gap-2"><CheckCircle size={18}/> Flights Confirmed</span> : 'Choose Flights'} <ChevronRight size={18}/>
            </div>
          </div>

          <div onClick={() => navigate('/book-hotel')} className={`group p-10 rounded-[3rem] border-2 cursor-pointer transition-all flex flex-col justify-between h-[340px] relative ${activeTrip.selectedHotel ? 'border-green-500 bg-white dark:bg-gray-900 shadow-xl' : 'border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900'}`}>
            <div className="flex justify-between items-start w-full">
              <div className={`p-5 rounded-2xl ${activeTrip.selectedHotel ? 'bg-green-100 text-green-600' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600'}`}><Hotel size={36} /></div>
              {activeTrip.selectedHotel && <button onClick={(e) => { e.stopPropagation(); clearHotelSelection(); }} className="p-2 text-red-500"><Trash2 size={20} /></button>}
            </div>
            <div><h3 className="text-3xl font-black dark:text-white mb-2 tracking-tighter">Stay</h3><p className="text-slate-500 font-medium">{activeTrip.selectedHotel ? `${activeTrip.selectedHotel.name} • ${activeTrip.selectedRoom?.name || 'Standard'}` : 'Pick a top-rated hotel'}</p></div>
            <div className="flex items-center gap-2 font-black text-xs tracking-widest text-purple-600 uppercase">
              {activeTrip.selectedHotel ? <span className="text-green-500 flex items-center gap-2"><CheckCircle size={18}/> Hotel Confirmed</span> : 'Choose Stay'} <ChevronRight size={18}/>
            </div>
          </div>
        </div>

        {/* EXPERIENCES */}
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border dark:border-gray-800 shadow-sm">
           <h3 className="text-2xl font-black dark:text-white mb-8 flex items-center gap-3"><MapIcon className="text-blue-600"/> Local Experiences</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dest.sightseeing?.map(act => {
                const isSelected = activeTrip.selectedActivities?.some(a => a.activityId === act.activityId);
                return (
                  <div key={act.activityId} className={`p-6 rounded-3xl border-2 transition-all flex flex-col justify-between ${isSelected ? 'border-blue-600 bg-blue-50/10' : 'border-slate-50 dark:border-gray-800'}`}>
                     <div><h4 className="font-bold dark:text-white mb-1">{act.title}</h4><p className="text-xs text-slate-400 font-bold mb-4">{act.duration} • {act.type}</p></div>
                     <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800"><span className="font-black text-lg dark:text-white">${act.price}</span><button onClick={() => toggleActivity(act)} className={`p-2 rounded-xl ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}>{isSelected ? <Check size={18}/> : <ChevronRight size={18}/>}</button></div>
                  </div>
                );
              })}
           </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t dark:border-gray-800 p-6 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-4">
            <div className={`flex flex-col items-center px-4 py-2 rounded-2xl ${activeTrip.outboundFlight ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}><p className="text-[9px] font-black uppercase tracking-tighter">Transport</p><Check size={14} className={activeTrip.outboundFlight ? 'opacity-100' : 'opacity-20'} /></div>
            <div className={`flex flex-col items-center px-4 py-2 rounded-2xl ${activeTrip.selectedHotel ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 dark:bg-gray-800 text-slate-400'}`}><p className="text-[9px] font-black uppercase tracking-tighter">Stay</p><Check size={14} className={activeTrip.selectedHotel ? 'opacity-100' : 'opacity-20'} /></div>
          </div>
          <div className="flex items-center gap-10">
            <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Estimated ({nights} Nights)</p><div className="flex items-baseline gap-1 justify-end"><p className="text-4xl font-black dark:text-white leading-none">${tripTotal}</p><span className="text-[10px] font-bold text-blue-600 uppercase">incl. tax</span></div></div>
            <button onClick={() => { if (!activeTrip.dates?.start) { setShowDateError(true); window.scrollTo({ top: 0, behavior: 'smooth' }); } else if (!hasSelections) { alert("Select at least one item to proceed."); } else { navigate('/checkout'); } }} className={`px-12 py-5 rounded-3xl font-black text-xl flex items-center gap-3 transition-all ${tripTotal > 0 ? 'bg-blue-600 text-white shadow-2xl' : 'bg-slate-200 text-slate-400'}`}>REVIEW ITINERARY <ChevronRight size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;