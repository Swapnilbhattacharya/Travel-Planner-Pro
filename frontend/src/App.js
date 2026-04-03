import React from 'react';
import './App.css';
import { PlanProvider } from './context/PlanContext';
import Home from './pages/Home';
import ItinerarySidebar from './components/Itinerary/ItinerarySidebar';
// Note: We will create the Navbar next, or Chitresh can build it.

function App() {
  return (
    <PlanProvider>
      <div className="relative min-h-screen bg-gray-50 flex">
        
        {/* Main Content Area (Chitresh's Work) */}
        <main className="flex-1 mr-80"> 
          <header className="p-6 bg-white border-b sticky top-0 z-10">
            <h1 className="text-2xl font-black tracking-tight text-blue-600">TRAVEL.PRO</h1>
          </header>
          
          <Home />
        </main>

        {/* The Trip Plan Sidebar (Your Integration) */}
        <aside>
          <ItinerarySidebar />
        </aside>

      </div>
    </PlanProvider>
  );
}

export default App;