import React, { useContext, useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';

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
  MapPin, Phone, ChevronDown, Plane 
} from 'lucide-react'; 

/**
 * BONUS FEATURE: ANIMATED TRANSITIONS
 * Wraps the routes to provide a smooth fade-in and slide-up effect on every page change.
 */
const PageWrapper = ({ children }) => {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-in fade-in slide-in-from-bottom-2 duration-700">
      {children}
    </div>
  );
};

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
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-500 overflow-x-hidden">
        
        {/* --- GLOBAL NAVIGATION: Authenticated Only --- */}
        {user && (
          <nav className="h-20 flex items-center justify-between px-6 md:px-12 border-b bg-white/70 dark:bg-gray-900/70 border-slate-200 dark:border-gray-800 backdrop-blur-lg sticky top-0 z-[100] shadow-sm transition-colors duration-500">
            
            {/* Branding / Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="bg-blue-600 p-2 rounded-xl text-white group-hover:scale-110 transition-transform">
                <Plane size={20} fill="currentColor" />
              </div>
              <h1 className="text-2xl font-black tracking-tighter text-blue-600">
                TRAVEL.PRO
              </h1>
            </Link>

            <div className="flex items-center gap-4 md:gap-8">
              {/* Desktop Secondary Links */}
              <div className="hidden lg:flex items-center gap-6 border-r dark:border-gray-700 pr-8 mr-2">
                <Link to="/about" className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  <Info size={18} /> About
                </Link>
                <Link to="/support" className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-gray-400 hover:text-blue-600 transition-colors">
                  <Headphones size={18} /> Support
                </Link>
              </div>
              
              {/* ACCOUNT ACCESS DROPDOWN */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-gray-800/50 rounded-2xl text-slate-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-slate-100 dark:border-gray-800"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-bold text-sm hidden sm:block">
                    {user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} className={`transition-transform duration-300 ${showProfile ? 'rotate-180' : ''}`} />
                </button>

                {/* --- ACCOUNT DETAILS DROPDOWN UI --- */}
                {showProfile && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-slate-100 dark:border-gray-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
                    
                    {/* Member Header */}
                    <div className="p-8 pb-6 border-b dark:border-gray-800 bg-slate-50/50 dark:bg-gray-800/30">
                      <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2">Member Profile</p>
                      <h3 className="text-2xl font-black dark:text-white leading-tight tracking-tight">{user.name}</h3>
                      <p className="text-sm font-bold text-slate-500 dark:text-gray-400 truncate">{user.email}</p>
                    </div>

                    {/* Data Fields from Signup */}
                    <div className="p-8 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600"><MapPin size={20}/></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Location</p>
                          <p className="text-sm font-bold dark:text-gray-200">{user.city || 'Not set'}, {user.location || 'Not set'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600"><Phone size={20}/></div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Phone</p>
                          <p className="text-sm font-bold dark:text-gray-200">{user.phone || 'No phone provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Logout Action */}
                    <div className="p-6 bg-slate-50 dark:bg-gray-800/50">
                      <button 
                        onClick={() => { setShowProfile(false); logout(); }}
                        className="w-full py-4 bg-white dark:bg-gray-900 border border-red-100 dark:border-red-900/30 text-red-500 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                      >
                        <LogOut size={16} /> SIGN OUT
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <ThemeToggle />
            </div>
          </nav>
        )}

        {/* --- DYNAMIC MAIN CONTENT WITH ANIMATED TRANSITIONS --- */}
        <main className="flex-1">
          <PageWrapper>
            <Routes>
              {/* 1. ENTRY GATEWAY: Forces login if no user is found */}
              <Route path="/" element={!user ? <Auth /> : <Navigate to="/home" />} />
              
              {/* 2. PROTECTED CORE ROUTES: Checks for 'user' state before access */}
              <Route path="/home" element={user ? <Home /> : <Navigate to="/" />} />
              <Route path="/trip/:id" element={user ? <TripDashboard /> : <Navigate to="/" />} />
              <Route path="/book-hotel" element={user ? <HotelBooking /> : <Navigate to="/" />} />
              <Route path="/book-flight" element={user ? <FlightBooking /> : <Navigate to="/" />} />
              <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/" />} />
              <Route path="/payment" element={user ? <Payment /> : <Navigate to="/" />} />

              {/* 3. INFORMATION PAGES: Publicly accessible */}
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </PageWrapper>
        </main>
      </div>
    </Router>
  );
}

/**
 * ROOT EXPORT
 * Note: Provider wraps the entire AppContent to ensure hooks like useContext(PlanContext) work correctly.
 */
function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}

export default App;