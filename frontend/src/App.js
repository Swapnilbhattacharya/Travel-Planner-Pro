import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TripDashboard from './pages/TripDashboard'; 
import Checkout from './pages/Checkout'; 
import ThemeToggle from './components/ThemeToggle'; // Theme engine import
import { PlanProvider } from './context/PlanContext';

function App() {
  return (
    <PlanProvider>
      <Router>
        {/* MAIN WRAPPER: Handles the background color shift for the whole app */}
        <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-gray-950 transition-colors duration-500">
          
          {/* GLOBAL NAVIGATION: Sticky with glassmorphism for both light and dark modes */}
          <nav className="h-20 flex items-center justify-between px-10 border-b bg-white/70 dark:bg-gray-900/70 border-slate-200 dark:border-gray-800 backdrop-blur-lg sticky top-0 z-50 shadow-sm transition-colors duration-500">
            <Link to="/">
              <h1 className="text-2xl font-black tracking-tighter text-blue-600 hover:text-blue-700 transition-colors">
                TRAVEL.PRO
              </h1>
            </Link>

            {/* THEME TOGGLE: Placed prominently on the right */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </nav>

          {/* DYNAMIC PAGE CONTENT: Routes handle which page to render */}
          <main className="flex-1">
            <Routes>
              {/* 1. MMT-Style Homepage with Infinite Scroll */}
              <Route path="/" element={<Home />} />
              
              {/* 2. Full-screen Trip Dashboard (Hotels/Activities selection) */}
              <Route path="/trip/:id" element={<TripDashboard />} />

              {/* 3. Final Checkout/Payment Review */}
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

        </div>
      </Router>
    </PlanProvider>
  );
}

export default App;