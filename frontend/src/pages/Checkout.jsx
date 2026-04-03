import React, { useContext, useMemo } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { 
  ArrowLeft, CheckCircle2, ShieldCheck, MapPin, 
  Plane, Hotel, Map, Sparkles 
} from 'lucide-react';

const Checkout = () => {
  const { activeTrip } = useContext(PlanContext);
  const navigate = useNavigate();

  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const start = new Date(activeTrip.dates.start);
    const end = new Date(activeTrip.dates.end);
    const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [activeTrip?.dates]);

  if (!activeTrip) return <Navigate to="/" />;

  // --- REPAIRED PRICE LOGIC ---
  const multipliers = { 'Economy': 1, 'Premium': 1.5, 'Business': 3, 'First Class': 5 };
  const currentMult = multipliers[activeTrip.flightClass] || 1;
  
  // Calculate Flight Total (Outbound + Return) * Multiplier
  const flightSub = ((activeTrip.outboundFlight?.price || 0) + (activeTrip.returnFlight?.price || 0)) * currentMult;
  
  // Calculate Hotel Total (Base + Room Premium) * Nights
  const hotelSub = activeTrip.selectedHotel 
    ? (activeTrip.selectedHotel.pricePerNight + (activeTrip.selectedRoom?.price || 0)) * nights 
    : 0;

  // Calculate Activities
  const activitiesSub = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;

  const subtotal = flightSub + hotelSub + activitiesSub;
  const taxAmount = Math.round(subtotal * 0.05);
  const tripTotal = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-bold transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
        </button>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tighter">
            Confirm your trip to {activeTrip.baseData.name}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium">Finalize your curated adventure itinerary.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: DETAILED SUMMARY */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. FLIGHT DETAILS */}
            {activeTrip.outboundFlight && (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-blue-600">
                  <Plane size={24} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Aviation • {activeTrip.flightClass}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Departure</p>
                    <p className="font-bold dark:text-white">{activeTrip.outboundFlight.airline}</p>
                    <p className="text-xs text-blue-600 font-bold">{activeTrip.outboundFlight.time}</p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-gray-800/50 rounded-2xl border dark:border-gray-700">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Return</p>
                    <p className="font-bold dark:text-white">{activeTrip.returnFlight?.airline || activeTrip.outboundFlight.airline}</p>
                    <p className="text-xs text-blue-600 font-bold">{activeTrip.returnFlight?.time || 'Evening'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ACCOMMODATION */}
            {activeTrip.selectedHotel && (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-purple-600">
                  <Hotel size={24} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Accommodation • {nights} Nights</h3>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-black dark:text-white leading-tight">{activeTrip.selectedHotel.name}</h4>
                    <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mt-1">
                      {activeTrip.selectedRoom?.name || 'Standard Luxury Room'}
                    </p>
                  </div>
                  <p className="text-xl font-black dark:text-white">${hotelSub}</p>
                </div>
              </div>
            )}

            {/* 3. SIGHTSEEING / ACTIVITIES */}
            {activeTrip.selectedActivities?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 border border-slate-200 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-green-600">
                  <Map size={24} />
                  <h3 className="font-black uppercase tracking-widest text-xs">Experiences ({activeTrip.selectedActivities.length})</h3>
                </div>
                <div className="space-y-3">
                  {activeTrip.selectedActivities.map((act) => (
                    <div key={act.activityId} className="flex justify-between items-center py-3 border-b border-slate-50 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <Sparkles size={14} className="text-amber-500" />
                        <span className="font-bold text-sm dark:text-gray-200">{act.title}</span>
                      </div>
                      <span className="font-black dark:text-white text-sm">${act.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: THE BILLING SLIP */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border-2 border-blue-600 shadow-2xl sticky top-28">
              <h3 className="text-xl font-black dark:text-white mb-6">Fare Breakdown</h3>
              
              <div className="space-y-4 border-b border-slate-100 dark:border-gray-800 pb-6 mb-6">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Flights & Transport</span>
                  <span className="dark:text-white">${flightSub}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Stay ({nights} Nights)</span>
                  <span className="dark:text-white">${hotelSub}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Activities</span>
                  <span className="dark:text-white">${activitiesSub}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span className="dark:text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-green-600">
                  <span>GST / Tax (5%)</span>
                  <span>+${taxAmount}</span>
                </div>
              </div>

              <div className="pt-6 border-t-2 border-dashed dark:border-gray-800 mb-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Total Amount Due</p>
                <p className="text-5xl font-black text-blue-600 tracking-tighter leading-none">${tripTotal}</p>
              </div>

              <button 
                onClick={() => navigate('/payment')}
                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                PAY SECURELY <CheckCircle2 size={20} />
              </button>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} /> End-to-End Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;