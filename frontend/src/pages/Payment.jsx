import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link for the fallback
import { PlanContext } from '../context/PlanContext';
import { CreditCard, Smartphone, ShieldCheck, Lock, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';

const Payment = () => {
  const { activeTrip, clearTrip } = useContext(PlanContext);
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 1. SAFETY GATE: If activeTrip is missing, show a clear message instead of a white screen
  if (!activeTrip || !activeTrip.baseData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 px-6">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">No active booking found.</h2>
        <p className="text-slate-500 mb-6">Please go back and select a destination.</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg">Return to Home</Link>
      </div>
    );
  }

  // 2. Calculations (Safe because of the check above)
  const hotelTotal = activeTrip?.selectedHotel?.pricePerNight || 0;
  const activitiesTotal = activeTrip?.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal;

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        clearTrip();
        navigate('/');
      }, 4000);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500 dark:bg-gray-950">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <CheckCircle size={60} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Booking Confirmed!</h1>
        <p className="text-slate-500 dark:text-gray-400 text-lg mb-8">Your tickets for {activeTrip.baseData.name} are ready.</p>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200 dark:border-gray-800 shadow-sm max-w-sm w-full">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Booking ID</p>
          <p className="text-xl font-mono font-bold dark:text-white">#TP-{Math.floor(Math.random() * 90000) + 10000}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Lock className="text-green-500" size={28} /> Secure Checkout
          </h1>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 dark:border-gray-800">
              <button 
                onClick={() => setMethod('card')}
                className={`flex-1 py-6 font-bold flex items-center justify-center gap-2 transition-all ${method === 'card' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/30 dark:bg-blue-900/10' : 'text-slate-400'}`}
              >
                <CreditCard size={20} /> Card
              </button>
              <button 
                onClick={() => setMethod('upi')}
                className={`flex-1 py-6 font-bold flex items-center justify-center gap-2 transition-all ${method === 'upi' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/30 dark:bg-blue-900/10' : 'text-slate-400'}`}
              >
                <Smartphone size={20} /> UPI
              </button>
            </div>

            <div className="p-8">
              {method === 'card' ? (
                <div className="space-y-4">
                  <input className="w-full p-4 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="w-full p-4 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="MM / YY" />
                    <input className="w-full p-4 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="CVV" />
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <input className="max-w-xs w-full p-4 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl text-center outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" placeholder="username@upi" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 dark:bg-gray-900 text-white rounded-3xl p-8 shadow-xl border dark:border-gray-800">
            <h2 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-2">Grand Total</h2>
            <p className="text-5xl font-black mb-8">${tripTotal}</p>
            
            <button 
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all ${isProcessing ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20'}`}
            >
              {isProcessing ? <><Loader2 className="animate-spin" /> PROCESSING</> : <>PAY NOW <ChevronRight size={20} /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;