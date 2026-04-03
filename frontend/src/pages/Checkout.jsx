import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const Checkout = () => {
  const { activeTrip } = useContext(PlanContext);

  if (!activeTrip) return <div className="p-10 text-center font-bold">No active trip found.</div>;

  const hotelTotal = activeTrip.selectedHotel?.pricePerNight || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal;

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <Link to={`/trip/${activeTrip.id}`} className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Modifications
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-8">Review your trip to {activeTrip.baseData.name}</h1>

        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
          <h2 className="text-2xl font-bold mb-6 border-b pb-4">Itinerary Summary</h2>
          
          {/* Hotel Summary */}
          {activeTrip.selectedHotel && (
            <div className="flex justify-between items-center mb-6 bg-slate-50 p-4 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase">Accommodation</p>
                <p className="text-lg font-black text-slate-900">{activeTrip.selectedHotel.name}</p>
              </div>
              <p className="text-xl font-bold">${activeTrip.selectedHotel.pricePerNight}</p>
            </div>
          )}

          {/* Activities Summary */}
          {activeTrip.selectedActivities?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-400 uppercase mb-2 px-2">Activities</p>
              {activeTrip.selectedActivities.map(act => (
                <div key={act.activityId} className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl mb-2">
                  <p className="text-lg font-bold text-slate-900">{act.title}</p>
                  <p className="text-lg font-bold">${act.price}</p>
                </div>
              ))}
            </div>
          )}

          {/* Total Line */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t-2 border-dashed border-slate-200">
            <p className="text-2xl font-medium text-slate-500">Total Due</p>
            <p className="text-5xl font-black text-blue-600">${tripTotal}</p>
          </div>
        </div>

        <button className="w-full bg-slate-900 text-white py-6 rounded-2xl text-xl font-black flex justify-center items-center gap-3 hover:bg-blue-600 transition-colors shadow-xl">
          <CheckCircle2 size={24} /> CONFIRM & PAY SECURELY
        </button>

      </div>
    </div>
  );
};

export default Checkout;