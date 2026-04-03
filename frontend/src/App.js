import React from 'react';
import Home from './pages/Home';
import ItinerarySidebar from './components/Itinerary/ItinerarySidebar';
import { PlanProvider } from './context/PlanContext';

function App() {
  return (
    <PlanProvider>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Navigation / Main Content */}
        <main className="flex-1 lg:pr-[350px]"> 
          <nav className="h-20 flex items-center px-10 border-b bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <h1 className="text-xl font-black tracking-tighter text-blue-600">TRAVEL.PRO</h1>
          </nav>
          <Home />
        </main>

        {/* Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-[350px] fixed right-0 h-screen">
          <ItinerarySidebar />
        </aside>
      </div>
    </PlanProvider>
  );
}

export default App;