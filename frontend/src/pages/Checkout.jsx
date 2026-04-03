import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

const Checkout = () => {
  const { activeTrip } = useContext(PlanContext);
  const navigate = useNavigate();

  // Safety check: if no trip is active, show a fallback
  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950 transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">No active trip found.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  // Calculate totals from the activeTrip state
  const hotelTotal = activeTrip.selectedHotel?.pricePerNight || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-6 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation back to the specific trip selection page */}
        <Link 
          to={`/trip/${activeTrip.id}`} 
          className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold transition-colors w-fit"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Modifications
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
            Review your trip to {activeTrip.baseData.name}
          </h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium flex items-center gap-2">
            <MapPin size={16} /> Everything looks ready for your adventure in {activeTrip.baseData.country || 'your destination'}.
          </p>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-gray-800 shadow-sm mb-8 transition-colors">
          <h2 className="text-2xl font-bold mb-8 border-b dark:border-gray-800 pb-4 dark:text-white">
            Itinerary Summary
          </h2>
          
          {/* Hotel Summary Section */}
          {activeTrip.selectedHotel ? (
            <div className="flex justify-between items-center mb-6 bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-transparent dark:border-gray-800 transition-colors">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mb-1">Accommodation</p>
                <p className="text-xl font-black text-slate-900 dark:text-white">{activeTrip.selectedHotel.name}</p>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">${activeTrip.selectedHotel.pricePerNight}</p>
            </div>
          ) : (
            <div className="mb-6 p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-gray-800 text-center">
              <p className="text-slate-400 font-bold">No hotel selected</p>
            </div>
          )}

          {/* Activities Summary Section */}
          {activeTrip.selectedActivities?.length > 0 && (
            <div className="mb-6 space-y-3">
              <p className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest px-2">Activities</p>
              {activeTrip.selectedActivities.map(act => (
                <div key={act.activityId} className="flex justify-between items-center bg-slate-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-transparent dark:border-gray-800 transition-colors">
                  <p className="text-lg font-bold text-slate-900 dark:text-gray-200">{act.title}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">${act.price}</p>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL LINE */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-dashed border-slate-200 dark:border-gray-800">
            <div>
              <p className="text-xl font-bold text-slate-500 dark:text-gray-400">Total Due</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">All taxes included</p>
            </div>
            <p className="text-6xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">
              ${tripTotal}
            </p>
          </div>
        </div>

        {/* CTA SECTION */}
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/payment')}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-7 rounded-3xl text-2xl font-black flex justify-center items-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/20"
          >
            <CheckCircle2 size={28} /> CONFIRM & PAY SECURELY
          </button>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-gray-600 text-sm font-bold uppercase tracking-widest">
            <ShieldCheck size={16} /> Secure 256-bit SSL encrypted checkout
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;