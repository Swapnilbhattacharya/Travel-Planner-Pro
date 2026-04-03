import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { 
  CreditCard, Smartphone, ShieldCheck, Lock, 
  ChevronRight, CheckCircle, Loader2, Plane, 
  Calendar, MapPin 
} from 'lucide-react';

const Payment = () => {
  const { activeTrip, clearTrip } = useContext(PlanContext);
  const navigate = useNavigate();
  
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Safety Redirect
  if (!activeTrip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-950 p-6">
        <div className="bg-white dark:bg-gray-900 p-10 rounded-[2.5rem] shadow-xl text-center max-w-md border dark:border-gray-800">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-4">Session Expired</h2>
          <p className="text-slate-500 dark:text-gray-400 mb-8 font-medium">Please restart your booking process from the home page.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20">Go Home</Link>
        </div>
      </div>
    );
  }

  const tripTotal = (activeTrip.selectedHotel?.pricePerNight || 0) + 
                    (activeTrip.selectedFlight?.price || 0) + 
                    (activeTrip.selectedActivities?.reduce((sum, a) => sum + a.price, 0) || 0);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      // Clean up the trip data after showing success
      setTimeout(() => {
        clearTrip();
      }, 500);
    }, 3000);
  };

  // --- CONFIRMED BOOKING ANIMATION STATE ---
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6 overflow-hidden">
        <div className="max-w-md w-full text-center">
          {/* Animated Checkmark Container */}
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-2xl">
              <CheckCircle size={80} className="text-green-500 animate-in zoom-in spin-in duration-700" />
            </div>
            {/* Confetti-like design elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 border-2 border-green-500/20 rounded-full animate-ping" />
          </div>

          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 animate-in slide-in-from-bottom duration-500">
            Booking Confirmed!
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg mb-10 font-medium animate-in fade-in delay-300 duration-500">
            Pack your bags, buddy! Your itinerary for <span className="text-blue-600 font-bold">{activeTrip.baseData.name}</span> is officially locked in.
          </p>

          <div className="bg-slate-50 dark:bg-gray-900 p-8 rounded-3xl border dark:border-gray-800 text-left space-y-4 mb-10 shadow-sm animate-in zoom-in delay-500 duration-500">
             <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Booking ID</span>
                <span className="font-mono font-bold dark:text-white">#TRV-{Math.floor(Math.random()*900000)}</span>
             </div>
             <div className="border-t dark:border-gray-800 pt-4 flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                   <Plane size={24} />
                </div>
                <div>
                   <p className="font-bold dark:text-white">{activeTrip.baseData.name}</p>
                   <p className="text-xs text-slate-400 font-medium">Confirmation sent to your email.</p>
                </div>
             </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl transition-all active:scale-95"
          >
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  // --- STANDARD PAYMENT INTERFACE ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT: PAYMENT FORM */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Lock className="text-green-500" size={28} /> Payment Details
            </h1>
            <div className="flex items-center gap-2 text-slate-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={16} /> 256-bit Encryption
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* TABS */}
            <div className="flex bg-slate-50/50 dark:bg-gray-800/50 border-b border-slate-100 dark:border-gray-800">
              <button 
                onClick={() => setMethod('card')}
                className={`flex-1 py-6 font-bold flex items-center justify-center gap-3 transition-all ${method === 'card' ? 'text-blue-600 bg-white dark:bg-gray-900 border-t-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <CreditCard size={20} /> Credit / Debit Card
              </button>
              <button 
                onClick={() => setMethod('upi')}
                className={`flex-1 py-6 font-bold flex items-center justify-center gap-3 transition-all ${method === 'upi' ? 'text-blue-600 bg-white dark:bg-gray-900 border-t-4 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Smartphone size={20} /> UPI / GPay / PhonePe
              </button>
            </div>

            <div className="p-10">
              {method === 'card' ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Card Number</label>
                    <input className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold tracking-[0.2em]" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Expiry Date</label>
                      <input className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" placeholder="MM / YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">CVV</label>
                      <input className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" placeholder="123" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <p className="text-slate-500 dark:text-gray-400 font-medium">Enter your VPA / UPI ID to receive a payment request on your phone</p>
                  <input className="max-w-sm w-full p-6 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-black text-xl" placeholder="yourname@upi" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden transition-all hover:scale-[1.02]">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-8 opacity-60 uppercase tracking-widest text-sm">Final Amount</h2>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-3xl font-light opacity-50">$</span>
                <span className="text-6xl font-black tracking-tighter">{tripTotal}</span>
              </div>
              
              <div className="space-y-4 border-t border-white/10 pt-8 mb-10">
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-50 font-bold uppercase tracking-widest text-[10px]">Booking For</span>
                  <span className="font-bold flex items-center gap-2"><MapPin size={14} /> {activeTrip.baseData.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-50 font-bold uppercase tracking-widest text-[10px]">Processing Fee</span>
                  <span className="font-bold text-green-400">FREE</span>
                </div>
              </div>

              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all ${isProcessing ? 'bg-slate-800 cursor-wait' : 'bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 active:scale-95'}`}
              >
                {isProcessing ? (
                  <><Loader2 className="animate-spin" /> VERIFYING...</>
                ) : (
                  <>AUTHORIZE <ChevronRight size={24} /></>
                )}
              </button>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>
          
          <div className="p-6 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-3xl">
             <p className="text-xs text-slate-400 dark:text-gray-500 font-bold text-center italic">
               * By clicking authorize, you agree to our Terms of Service and Refund Policy.
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;