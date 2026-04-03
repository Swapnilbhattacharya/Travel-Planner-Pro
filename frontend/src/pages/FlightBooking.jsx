import React, { useState, useContext } from 'react';
import { PlanContext } from '../context/PlanContext';
import { useNavigate } from 'react-router-dom';
import { PlaneTakeoff, PlaneLanding, Clock, ShieldCheck, ChevronRight } from 'lucide-react';

const FlightBooking = () => {
  const { activeTrip, selectFlightSelection } = useContext(PlanContext);
  const navigate = useNavigate();
  
  const [outbound, setOutbound] = useState(null);
  const [inbound, setInbound] = useState(null);
  const [seatClass, setSeatClass] = useState('Economy');

  if (!activeTrip) return null;
  const flights = activeTrip.baseData.flights;

  const classes = [
    { label: 'Economy', multi: 1 },
    { label: 'Premium Economy', multi: 1.5 },
    { label: 'Business', multi: 3 },
    { label: 'First Class', multi: 6 }
  ];

  const handleConfirm = () => {
    if (!outbound || !inbound) {
      alert("Please select both flights!");
      return;
    }
    selectFlightSelection(outbound, inbound, seatClass);
    navigate(`/trip/${activeTrip.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* CLASS SELECTOR */}
        <div className="flex bg-white dark:bg-gray-900 p-2 rounded-2xl mb-10 w-fit border dark:border-gray-800 shadow-sm">
          {classes.map(c => (
            <button 
              key={c.label}
              onClick={() => setSeatClass(c.label)}
              className={`px-6 py-3 rounded-xl font-bold text-xs transition-all ${seatClass === c.label ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* OUTBOUND SECTION */}
          <div>
            <h2 className="text-2xl font-black dark:text-white mb-6 flex items-center gap-3">
              <PlaneTakeoff className="text-blue-600" /> Outbound Flight
            </h2>
            <div className="space-y-4">
              {flights.map(f => (
                <button 
                  key={`out-${f.flightId}`}
                  onClick={() => setOutbound(f)}
                  className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${outbound?.flightId === f.flightId ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900 border-transparent shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-xl dark:text-white">{f.airline}</p>
                      <p className="text-slate-500 font-bold flex items-center gap-2 mt-1"><Clock size={14}/> {f.time}</p>
                    </div>
                    <p className="text-2xl font-black text-blue-600">${Math.round(f.price * classes.find(c => c.label === seatClass).multi)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RETURN SECTION */}
          <div>
            <h2 className="text-2xl font-black dark:text-white mb-6 flex items-center gap-3">
              <PlaneLanding className="text-blue-600" /> Return Flight
            </h2>
            <div className="space-y-4">
              {flights.map(f => (
                <button 
                  key={`in-${f.flightId}`}
                  onClick={() => setInbound(f)}
                  className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${inbound?.flightId === f.flightId ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-900 border-transparent shadow-sm'}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-black text-xl dark:text-white">{f.airline}</p>
                      <p className="text-slate-500 font-bold flex items-center gap-2 mt-1"><Clock size={14}/> {f.time}</p>
                    </div>
                    <p className="text-2xl font-black text-blue-600">${Math.round(f.price * classes.find(c => c.label === seatClass).multi)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 border-t dark:border-gray-800 z-50">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex gap-10">
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Departure</p>
                 <p className="font-bold dark:text-white">{outbound ? `${outbound.airline} (${outbound.time})` : '---'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase">Return</p>
                 <p className="font-bold dark:text-white">{inbound ? `${inbound.airline} (${inbound.time})` : '---'}</p>
               </div>
            </div>
            <button 
              onClick={handleConfirm}
              className="px-12 py-5 bg-blue-600 text-white rounded-2xl font-black text-xl flex items-center gap-2 shadow-xl shadow-blue-600/20"
            >
              CONFIRM FLIGHTS <ChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightBooking;