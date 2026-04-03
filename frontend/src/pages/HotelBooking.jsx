import React, { useState, useContext } from 'react';
import { PlanContext } from '../context/PlanContext';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight, ArrowLeft, Wifi, Coffee } from 'lucide-react';

const HotelBooking = () => {
  const { activeTrip, confirmHotelSelection } = useContext(PlanContext);
  const [step, setStep] = useState(1);
  const [localHotel, setLocalHotel] = useState(null);
  const navigate = useNavigate();

  if (!activeTrip) return null;
  const hotels = activeTrip.baseData.hotels || [];
  const roomTypes = [
    { id: 'std', name: 'Standard Room', price: 0, desc: 'City view, Queen bed' },
    { id: 'dlx', name: 'Deluxe Suite', price: 150, desc: 'Ocean view, King bed' },
    { id: 'prm', name: 'Presidential Penthouse', price: 450, desc: 'Private pool, Butler service' }
  ];

  const handlePickRoom = (room) => {
    confirmHotelSelection(localHotel, room);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        {step === 1 ? (
          <>
            <button onClick={() => navigate(-1)} className="mb-8 flex items-center font-bold text-slate-500 hover:text-blue-600 transition-colors">
              <ArrowLeft size={18} className="mr-2"/> Back to Hub
            </button>
            <h1 className="text-4xl font-black dark:text-white mb-10 tracking-tighter">Where would you like to stay?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hotels.map(h => (
                <div key={h.hotelId} className="bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                  <img src={h.image} className="w-full h-64 object-cover" alt={h.name} />
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-black dark:text-white leading-tight">{h.name}</h3>
                      <span className="flex items-center text-green-500 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-xl text-sm">
                        <Star size={14} className="mr-1 fill-current"/> {h.rating}
                      </span>
                    </div>
                    <div className="flex gap-4 mb-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Wifi size={14}/> WiFi</span>
                      <span className="flex items-center gap-1"><Coffee size={14}/> Breakfast</span>
                    </div>
                    <button onClick={() => { setLocalHotel(h); setStep(2); }} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg">
                      SELECT HOTEL <ArrowRight size={18}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-in slide-in-from-right duration-500">
            <button onClick={() => setStep(1)} className="mb-8 flex items-center font-bold text-blue-600">
              <ArrowLeft size={18} className="mr-2"/> Change Hotel
            </button>
            <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] border dark:border-gray-800 shadow-2xl">
              <h2 className="text-3xl font-black dark:text-white mb-2">Available Rooms</h2>
              <p className="text-slate-500 mb-10 font-medium">{localHotel.name}</p>
              <div className="space-y-4">
                {roomTypes.map(room => (
                  <button key={room.id} onClick={() => handlePickRoom(room)} className="w-full p-6 border-2 border-slate-100 dark:border-gray-800 rounded-[2rem] flex justify-between items-center hover:border-blue-600 transition-all text-left group">
                    <div>
                      <p className="text-xl font-black dark:text-white group-hover:text-blue-600 transition-colors">{room.name}</p>
                      <p className="text-slate-400 text-sm font-medium">{room.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black dark:text-white">${localHotel.pricePerNight + room.price}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">per night</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelBooking;