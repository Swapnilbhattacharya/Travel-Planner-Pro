import React, { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Plane } from 'lucide-react';

const Checkout = () => {
  const { activeTrip } = useContext(PlanContext);
  const navigate = useNavigate();

  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const start = new Date(activeTrip.dates.start);
    const end = new Date(activeTrip.dates.end);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  }, [activeTrip?.dates]);

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950 transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">No active trip found.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  // --- TAX LOGIC ---
  const hotelBasePrice = activeTrip.selectedHotel?.pricePerNight || 0;
  const hotelTotal = hotelBasePrice * nights;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const flightTotal = activeTrip.selectedFlight?.price || 0;

  // 1. Subtotal
  const subtotal = hotelTotal + activitiesTotal + flightTotal;
  
  // 2. Tax (5%) - Using Math.round to avoid long decimals
  const taxAmount = Math.round(subtotal * 0.05);
  
  // 3. Grand Total
  const tripTotal = subtotal + taxAmount;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-6 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <Link to={`/trip/${activeTrip.id}`} className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold transition-colors w-fit">
          <ArrowLeft size={18} className="mr-2" /> Back to Modifications
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            Review your trip to {activeTrip.baseData.name}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium flex items-center gap-2">
            <MapPin size={16} /> Finalize your adventure itinerary.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-gray-800 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-8 border-b dark:border-gray-800 pb-4 dark:text-white">Itinerary Summary</h2>
          
          <div className="space-y-4">
            {activeTrip.selectedFlight && (
              <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/40">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 dark:bg-blue-800 p-3 rounded-xl text-blue-600 dark:text-blue-200"><Plane size={24} /></div>
                  <div>
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Flight</p>
                    <p className="text-lg font-black dark:text-white">{activeTrip.selectedFlight.airline}</p>
                  </div>
                </div>
                <p className="text-xl font-black dark:text-white">${flightTotal}</p>
              </div>
            )}

            {activeTrip.selectedHotel && (
              <div className="flex justify-between items-center bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-slate-100 dark:border-gray-800">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accommodation</p>
                  <p className="text-lg font-black dark:text-white">{activeTrip.selectedHotel.name}</p>
                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">${hotelBasePrice} × {nights} nights</p>
                </div>
                <p className="text-xl font-black dark:text-white">${hotelTotal}</p>
              </div>
            )}
          </div>

          {/* PRICE BREAKDOWN SECTION */}
          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between text-slate-500 dark:text-gray-400 font-bold">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-gray-400 font-bold">
              <span>GST / Service Tax (5%)</span>
              <span className="text-green-600">+${taxAmount}</span>
            </div>
            
            {/* FINAL TOTAL */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t-2 border-dashed border-slate-200 dark:border-gray-800">
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">Total Due</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">All fees included</p>
              </div>
              <p className="text-6xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">${tripTotal}</p>
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/payment')} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-7 rounded-3xl text-2xl font-black flex justify-center items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/20 active:scale-[0.98]">
          <CheckCircle2 size={28} /> CONFIRM & PAY SECURELY
        </button>
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest mt-6">
          <ShieldCheck size={16} /> SSL Encrypted Secure Checkout
        </div>
      </div>
    </div>
  );
};

export default Checkout;