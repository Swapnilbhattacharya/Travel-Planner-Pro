import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// --- PAGE IMPORTS ---
import Home from './pages/Home';
import TripDashboard from './pages/TripDashboard'; 
import Checkout from './pages/Checkout'; 
import Payment from './pages/Payment'; 
import About from './pages/About';     
import Support from './pages/Support'; 

// NEW: Advanced Selection Pages
import HotelBooking from './pages/HotelBooking'; 
import FlightBooking from './pages/FlightBooking';

// --- COMPONENT & CONTEXT IMPORTS ---
import ThemeToggle from './components/ThemeToggle';
import { PlanProvider } from './context/PlanContext';
import { Info, Headphones } from 'lucide-react'; 

function App() {
  return (
    <PlanProvider>
      <Router>
        {/* MAIN WRAPPER: Manages global background and dark mode transitions */}
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-500">
          
          {/* GLOBAL NAVIGATION: Sticky glassmorphism header */}
          <nav className="h-20 flex items-center justify-between px-6 md:px-12 border-b bg-white/70 dark:bg-gray-900/70 border-slate-200 dark:border-gray-800 backdrop-blur-lg sticky top-0 z-50 shadow-sm transition-colors duration-500">
            
            {/* Logo Section */}
            <Link to="/">
              <h1 className="text-2xl font-black tracking-tighter text-blue-600 hover:text-blue-700 transition-colors">
                TRAVEL.PRO
              </h1>
            </Link>

            {/* NAVIGATION ACTIONS */}
            <div className="flex items-center gap-4 md:gap-8">
              
              {/* Desktop Links (About & Support) */}
              <div className="hidden md:flex items-center gap-6">
                <Link 
                  to="/about" 
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Info size={18} /> About Us
                </Link>
                <Link 
                  to="/support" 
                  className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Headphones size={18} /> Support
                </Link>
              </div>

              {/* Decorative Vertical Divider */}
              <div className="hidden md:block h-6 w-[1px] bg-slate-200 dark:bg-gray-700"></div>

              {/* Theme Toggle Button */}
              <ThemeToggle />
            </div>
          </nav>

          {/* DYNAMIC PAGE CONTENT */}
          <main className="flex-1">
            <Routes>
              {/* 1. Exploration & Discovery */}
              <Route path="/" element={<Home />} />
              <Route path="/trip/:id" element={<TripDashboard />} />
              
              {/* 2. Advanced Selection Funnel (The New Pages) */}
              <Route path="/book-hotel" element={<HotelBooking />} />
              <Route path="/book-flight" element={<FlightBooking />} />

              {/* 3. Booking & Transaction Flow */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} /> 
              
              {/* 4. Information Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </main>

        </div>
      </Router>
    </PlanProvider>
  );
}

export default App;