import React, { useState, useContext, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { 
  CreditCard, Smartphone, ShieldCheck, Lock, 
  ChevronRight, CheckCircle, Loader2, Plane, MapPin 
} from 'lucide-react';

const Payment = () => {
  const { activeTrip, completeBooking } = useContext(PlanContext);
  const navigate = useNavigate();
  
  const [method, setMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedTripName, setConfirmedTripName] = useState(activeTrip?.baseData?.name || '');

  // --- SYNCED CALCULATION LOGIC (Identical to Review Page) ---
  const nights = useMemo(() => {
    if (!activeTrip?.dates?.start || !activeTrip?.dates?.end) return 1;
    const diff = Math.ceil(Math.abs(new Date(activeTrip.dates.end) - new Date(activeTrip.dates.start)) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [activeTrip?.dates]);

  const { subtotal, taxAmount, tripTotal } = useMemo(() => {
    if (!activeTrip) return { subtotal: 0, taxAmount: 0, tripTotal: 0 };

    // 1. Flights
    const multipliers = { 'Economy': 1, 'Premium': 1.5, 'Business': 3, 'First Class': 5 };
    const m = multipliers[activeTrip.flightClass] || 1;
    const flightSub = ((activeTrip.outboundFlight?.price || 0) + (activeTrip.returnFlight?.price || 0)) * m;

    // 2. Hotel
    const hotelSub = activeTrip.selectedHotel 
      ? (activeTrip.selectedHotel.pricePerNight + (activeTrip.selectedRoom?.price || 0)) * nights 
      : 0;

    // 3. Activities
    const activitiesSub = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;

    const sub = flightSub + hotelSub + activitiesSub;
    const tax = Math.round(sub * 0.05);
    return { subtotal: sub, taxAmount: tax, tripTotal: sub + tax };
  }, [activeTrip, nights]);

  const handlePayment = (e) => {
    if(e) e.preventDefault();
    setConfirmedTripName(activeTrip?.baseData?.name || 'your destination');
    setIsProcessing(true);
    
    setTimeout(() => {
      completeBooking();
      setIsProcessing(false);
      setIsSuccess(true);
    }, 3000);
  };

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 p-6 transition-colors duration-500">
        <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-700">
          <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl animate-bounce">
            <CheckCircle size={80} className="text-green-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Booking Confirmed!</h1>
          <p className="text-slate-500 dark:text-gray-400 text-lg mb-10 font-medium leading-relaxed">
            Pack your bags, buddy! Your itinerary for <span className="text-blue-600 font-bold">{confirmedTripName}</span> is officially locked in.
          </p>
          <button onClick={() => navigate('/home')} className="w-full bg-slate-900 dark:bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:shadow-xl transition-all shadow-blue-500/20">BACK TO HOME</button>
        </div>
      </div>
    );
  }

  if (!activeTrip) return <div className="p-20 text-center dark:text-white font-bold">Session Expired. <Link to="/" className="text-blue-600">Go Home</Link></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 py-12 px-6 transition-colors duration-500">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* PAYMENT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tighter">
              <Lock className="text-green-500" size={28} /> Payment Details
            </h1>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck size={16} /> 256-bit Encryption
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] border border-slate-200 dark:border-gray-800 overflow-hidden shadow-sm">
            {/* TAB SELECTOR */}
            <div className="flex bg-slate-50/50 dark:bg-gray-800/50 border-b dark:border-gray-800">
              <button onClick={() => setMethod('card')} className={`flex-1 py-6 font-bold flex items-center justify-center gap-3 transition-all ${method === 'card' ? 'text-blue-600 bg-white dark:bg-gray-900 border-t-4 border-blue-600' : 'text-slate-400'}`}>
                <CreditCard size={20} /> Credit Card
              </button>
              <button onClick={() => setMethod('upi')} className={`flex-1 py-6 font-bold flex items-center justify-center gap-3 transition-all ${method === 'upi' ? 'text-blue-600 bg-white dark:bg-gray-900 border-t-4 border-blue-600' : 'text-slate-400'}`}>
                <Smartphone size={20} /> UPI / GPay
              </button>
            </div>

            <div className="p-10">
              {method === 'card' ? (
                <form onSubmit={handlePayment} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Card Number</label>
                    <input required className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold tracking-[0.2em]" placeholder="0000 0000 0000 0000" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Expiry</label>
                      <input required className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" placeholder="MM / YY" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">CVV</label>
                      <input required className="w-full p-5 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-bold" placeholder="123" />
                    </div>
                  </div>
                  <button disabled={isProcessing} className={`w-full py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-4 transition-all ${isProcessing ? 'bg-slate-800' : 'bg-blue-600 hover:bg-blue-500 shadow-xl'}`}>
                    {isProcessing ? <><Loader2 className="animate-spin" /> VERIFYING...</> : <>CONFIRM PAYMENT <ChevronRight /></>}
                  </button>
                </form>
              ) : (
                <div className="text-center py-10 space-y-6">
                  <p className="text-slate-500 dark:text-gray-400 font-medium">Enter your VPA/UPI ID to proceed</p>
                  <input className="max-w-sm w-full p-6 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl text-center outline-none focus:ring-2 focus:ring-blue-500 dark:text-white font-black text-xl" placeholder="username@upi" />
                  <button onClick={handlePayment} disabled={isProcessing} className="w-full py-6 bg-blue-600 text-white rounded-2xl font-black text-xl flex items-center justify-center gap-4">
                    {isProcessing ? <><Loader2 className="animate-spin" /> AWAITING MOBILE APP...</> : 'SEND UPI REQUEST'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SUMMARY COLUMN */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-black opacity-50 uppercase tracking-widest mb-6">Verified Total Bill</p>
              <div className="flex items-baseline gap-1 mb-8 border-b border-white/10 pb-8">
                <span className="text-3xl font-light opacity-50">$</span>
                <span className="text-6xl font-black tracking-tighter">{tripTotal}</span>
              </div>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm"><span className="opacity-50">Subtotal</span><span className="font-bold">${subtotal}</span></div>
                <div className="flex justify-between text-sm"><span className="opacity-50">Tax (5%)</span><span className="font-bold text-green-400">+${taxAmount}</span></div>
                <div className="flex justify-between text-sm pt-4 border-t border-white/5"><span className="opacity-50 uppercase text-[10px]">Destination</span><span className="font-bold">{activeTrip.baseData.name}</span></div>
              </div>

              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-bold text-slate-400 leading-relaxed italic">
                "Safe travels, buddy! Your data is protected by industry-standard SSL encryption."
              </div>
            </div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;