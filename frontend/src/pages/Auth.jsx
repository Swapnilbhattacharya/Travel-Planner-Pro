import React, { useState, useContext } from 'react';
import { PlanContext } from '../context/PlanContext';
import { Mail, Lock, User, MapPin, Phone, Globe, ArrowRight, Plane, ArrowLeft, ShieldCheck } from 'lucide-react';

const Auth = () => {
  // mode can be: 'login', 'signup', or 'forgot'
  const [mode, setMode] = useState('login');
  const { login } = useContext(PlanContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', city: '', location: '', phone: '' });
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'forgot') {
      // Simulate sending a reset email
      setResetSent(true);
    } else {
      // Handle Login/Signup
      login({ ...formData, id: Date.now() });
    }
  };

  const inputStyle = "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none transition-all dark:text-white font-bold text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border dark:border-gray-800 z-10 animate-in fade-in zoom-in duration-500">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="hidden md:block relative bg-blue-600 p-12 text-white">
          <img src="https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?w=800" className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" alt="Travel" />
          <div className="relative h-full flex flex-col justify-between">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md"><Plane /></div> Travel.Pro
            </div>
            <div>
              <h2 className="text-4xl font-black leading-tight mb-4 tracking-tighter">Your passport <br/> to the world.</h2>
              <p className="text-blue-100 font-medium italic opacity-80">Join millions of travelers booking their next escape with us.</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: FORMS */}
        <div className="p-8 md:p-12">
          
          {/* Form Header */}
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-black dark:text-white mb-2 tracking-tighter">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
              {mode === 'login' && 'Sign in to access your trips'}
              {mode === 'signup' && 'Join the elite travel club'}
              {mode === 'forgot' && 'We\'ll send recovery instructions'}
            </p>
          </div>

          {!resetSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name field (Signup only) */}
              {mode === 'signup' && (
                <div className="relative animate-in slide-in-from-top-2">
                  <User className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required placeholder="Full Name" className={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              )}

              {/* Email field (Always visible) */}
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={18} />
                <input required type="email" placeholder="Email Address" className={inputStyle} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              {/* Password field (Login & Signup only) */}
              {mode !== 'forgot' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-4 text-slate-400" size={18} />
                  <input required type="password" placeholder="Password" className={inputStyle} />
                </div>
              )}

              {/* Reset Password Link (Login only) */}
              {mode === 'login' && (
                <div className="flex justify-end px-1">
                  <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Advanced Fields (Signup only) */}
              {mode === 'signup' && (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input placeholder="City" className={inputStyle} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div className="relative">
                      <Globe className="absolute left-4 top-4 text-slate-400" size={18} />
                      <input placeholder="Country" className={inputStyle} onChange={e => setFormData({...formData, location: e.target.value})} />
                    </div>
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-4 text-slate-400" size={18} />
                    <input placeholder="Phone Number" className={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
              )}

              <button type="submit" className="w-full py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:shadow-xl active:scale-95 transition-all mt-6 shadow-blue-500/20">
                {mode === 'login' && 'SIGN IN'}
                {mode === 'signup' && 'REGISTER NOW'}
                {mode === 'forgot' && 'SEND RESET LINK'}
                <ArrowRight size={20} />
              </button>
            </form>
          ) : (
            /* Reset Success View */
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-black dark:text-white mb-2">Check your email!</h2>
              <p className="text-slate-500 dark:text-gray-400 font-medium mb-8">
                We've sent recovery instructions to your inbox.
              </p>
              <button 
                onClick={() => {setResetSent(false); setMode('login');}} 
                className="flex items-center justify-center gap-2 mx-auto font-black text-blue-600 uppercase tracking-widest text-sm hover:underline"
              >
                <ArrowLeft size={16} /> Back to Sign In
              </button>
            </div>
          )}

          {/* Bottom Toggle Links */}
          {!resetSent && (
            <div className="mt-8 text-center space-y-4">
              <button 
                onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} 
                className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors"
              >
                {mode === 'signup' ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
              </button>
              
              {mode === 'forgot' && (
                <button 
                  onClick={() => setMode('login')} 
                  className="w-full text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={14} /> Back to login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;