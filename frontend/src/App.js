import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import TripDashboard from './pages/TripDashboard'; // We are creating this next!
import { PlanProvider } from './context/PlanContext';

function App() {
  return (
    <PlanProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
          
          {/* Global Navigation */}
          <nav className="h-20 flex items-center px-10 border-b bg-white/70 backdrop-blur-lg sticky top-0 z-50">
            <Link to="/">
              <h1 className="text-2xl font-black tracking-tighter text-blue-600 hover:text-blue-700 transition-colors">
                TRAVEL.PRO
              </h1>
            </Link>
          </nav>

          {/* Dynamic Page Content (This changes based on the URL) */}
          <main className="flex-1">
            <Routes>
              {/* The "Search Engine" Homepage */}
              <Route path="/" element={<Home />} />
              
              {/* The Dedicated "Planning" Page for a specific destination */}
              <Route path="/trip/:id" element={<TripDashboard />} />
            </Routes>
          </main>

        </div>
      </Router>
    </PlanProvider>
  );
}

export default App;