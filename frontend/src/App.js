import React, { useContext, useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

// --- PAGE IMPORTS ---
import Auth from './pages/Auth'; 
import Home from './pages/Home';
import TripDashboard from './pages/TripDashboard'; 
import Checkout from './pages/Checkout'; 
import Payment from './pages/Payment'; 
import About from './pages/About';     
import Support from './pages/Support'; 
import HotelBooking from './pages/HotelBooking'; 
import FlightBooking from './pages/FlightBooking';

// --- COMPONENT & CONTEXT IMPORTS ---
import ThemeToggle from './components/ThemeToggle';
import { PlanContext, PlanProvider } from './context/PlanContext';
import { 
  Info, Headphones, LogOut, User, 
  MapPin, Phone, Globe, ChevronDown 
} from 'lucide-react'; 

function AppContent() {
  const { user, logout } = useContext(PlanContext);
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when user clicks anywhere else on the screen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-500">
        
        {/* GLOBAL NAVIGATION: Only visible when user is authenticated */}
        {user && (
          <nav className="h-20 flex items-center justify-between px-6 md:px-12 border-b bg-white/70 dark:bg-gray-900/70 border-slate-200 dark:border-gray-800 backdrop-blur-lg sticky top-0 z-[100] shadow-sm transition-colors duration-500">
            <Link to="/home">
              <h1 className="text-2xl font-black tracking-tighter text-blue-600 hover:text-blue-700 transition-colors">
                TRAVEL.PRO
              </h1>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
              <div className="hidden md:flex items-center gap-6">
                <Link to="/about" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  <Info size={18} /> About
                </Link>
                <Link to="/support" className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
                  <Headphones size={18} /> Support
                </Link>
              </div>

              <div className="h-6 w-[1px] bg-slate-200 dark:bg-gray-700 mx-2"></div>
              
              {/* --- ACCOUNT ACCESS DROPDOWN --- */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-2xl text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all border border-blue-100 dark:border-blue-800 group"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/20">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="font-bold text-sm hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
                </button>

                {/* --- THE DROPDOWN MENU --- */}
                {showProfile && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                    {/* Header: Basic Info */}
                    <div className="p-6 border-b dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Explorer</p>
                      <h3 className="text-xl font-black dark:text-white leading-tight">{user.name}</h3>
                      <p className="text-sm font-bold text-blue-600 truncate">{user.email}</p>
                    </div>

                    {/* Body: Location & Contact Details from Signup */}
                    <div className="p-6 space-y-5">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-100 dark:bg-gray-800 rounded-xl text-slate-500">
                          <MapPin size={18}/>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Origin / City</p>
                          <p className="text-sm font-bold dark:text-gray-200">{user.city || 'Not specified'}, {user.location || 'Global'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-100 dark:bg-gray-800 rounded-xl text-slate-500">
                          <Phone size={18}/>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Registered Phone</p>
                          <p className="text-sm font-bold dark:text-gray-200">{user.phone || 'No contact added'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Sign Out */}
                    <div className="p-4 bg-slate-50 dark:bg-gray-800/50 flex gap-2">
                      <button 
                        onClick={() => { setShowProfile(false); logout(); }}
                        className="w-full py-4 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                      >
                        <LogOut size={14} /> SIGN OUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <ThemeToggle />
            </div>
          </nav>
        )}

        {/* DYNAMIC PAGE CONTENT */}
        <main className="flex-1">
          <Routes>
            {/* Entry Route: Auth if logged out, Home if logged in */}
            <Route path="/" element={!user ? <Auth /> : <Navigate to="/home" />} />
            
            {/* Protected Core Routes */}
            <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
            <Route path="/trip/:id" element={user ? <TripDashboard /> : <Navigate to="/" />} />
            <Route path="/book-hotel" element={user ? <HotelBooking /> : <Navigate to="/" />} />
            <Route path="/book-flight" element={user ? <FlightBooking /> : <Navigate to="/" />} />
            <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/" />} />
            <Route path="/payment" element={user ? <Payment /> : <Navigate to="/" />} />

            {/* Static Information Pages */}
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

// Final Export Wrapped in Provider
function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}

export default App;