import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Plane } from 'lucide-react';

const Checkout = () => {
  const { activeTrip } = useContext(PlanContext);
  const navigate = useNavigate();

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950 transition-colors">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">No active trip found.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  // Calculate totals including Flights
  const hotelTotal = activeTrip.selectedHotel?.pricePerNight || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const flightTotal = activeTrip.selectedFlight?.price || 0;
  const tripTotal = hotelTotal + activitiesTotal + flightTotal;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-10 px-6 transition-colors duration-500">
      <div className="max-w-3xl mx-auto">
        <Link to={`/trip/${activeTrip.id}`} className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold transition-colors w-fit"><ArrowLeft size={18} className="mr-2" /> Back to Modifications</Link>

        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight text-center sm:text-left">Review your trip to {activeTrip.baseData.name}</h1>
          <p className="text-slate-500 dark:text-gray-400 font-medium flex items-center justify-center sm:justify-start gap-2"><MapPin size={16} /> Finalize your adventure itinerary.</p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-[2rem] p-8 md:p-10 border border-slate-200 dark:border-gray-800 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-8 border-b dark:border-gray-800 pb-4 dark:text-white">Itinerary Summary</h2>
          
          {/* FLIGHT SUMMARY SECTION */}
          {activeTrip.selectedFlight && (
            <div className="flex justify-between items-center mb-4 bg-blue-50/50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/40">
              <div className="flex items-center gap-4">
                <Plane className="text-blue-600" size={24} />
                <div>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Flight Selection</p>
                  <p className="text-lg font-black text-slate-900 dark:text-white">{activeTrip.selectedFlight.airline} • {activeTrip.selectedFlight.time}</p>
                </div>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">${activeTrip.selectedFlight.price}</p>
            </div>
          )}

          {/* HOTEL SUMMARY SECTION */}
          {activeTrip.selectedHotel && (
            <div className="flex justify-between items-center mb-4 bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-slate-100 dark:border-gray-800">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accommodation</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">{activeTrip.selectedHotel.name}</p>
              </div>
              <p className="text-xl font-black text-slate-900 dark:text-white">${activeTrip.selectedHotel.pricePerNight}</p>
            </div>
          )}

          {/* ACTIVITIES SUMMARY SECTION */}
          {activeTrip.selectedActivities?.length > 0 && (
            <div className="mb-4 space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Activities</p>
              {activeTrip.selectedActivities.map(act => (
                <div key={act.activityId} className="flex justify-between items-center bg-slate-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-slate-100 dark:border-gray-800">
                  <p className="text-lg font-bold text-slate-900 dark:text-gray-200">{act.title}</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">${act.price}</p>
                </div>
              ))}
            </div>
          )}

          {/* TOTAL LINE */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t-2 border-dashed border-slate-200 dark:border-gray-800 text-center sm:text-left">
            <div>
              <p className="text-xl font-bold text-slate-500 dark:text-gray-400">Total Due</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Taxes Included</p>
            </div>
            <p className="text-6xl font-black text-blue-600 dark:text-blue-500 tracking-tighter">${tripTotal}</p>
          </div>
        </div>

        <button onClick={() => navigate('/payment')} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-7 rounded-3xl text-2xl font-black flex justify-center items-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.98] transition-all shadow-2xl shadow-blue-500/20">
          <CheckCircle2 size={28} /> CONFIRM & PAY SECURELY
        </button>
        <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-gray-600 text-[10px] font-black uppercase tracking-widest mt-6"><ShieldCheck size={16} /> SSL Encrypted Secure Checkout</div>
      </div>
    </div>
  );
};

export default Checkout;