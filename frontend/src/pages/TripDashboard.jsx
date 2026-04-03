import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, Star, Clock, MapPin, Check, ChevronRight, Plane } from 'lucide-react';

const TripDashboard = () => {
  const { activeTrip, selectHotel, selectFlight, toggleActivity } = useContext(PlanContext);
  const [activeTab, setActiveTab] = useState('hotels');
  const navigate = useNavigate();

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 dark:bg-gray-950 transition-colors duration-500">
        <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-gray-200">Trip session expired.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  const dest = activeTrip.baseData;
  const hotels = dest.hotels || [];
  const activities = dest.sightseeing || [];
  const flights = dest.flights || [];

  const isActivitySelected = (activityId) => {
    return activeTrip.selectedActivities?.some(a => a.activityId === activityId);
  };

  // UPDATED: Calculate the running total including Flights
  const hotelTotal = activeTrip.selectedHotel?.pricePerNight || 0;
  const flightTotal = activeTrip.selectedFlight?.price || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal + flightTotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-950 pb-32 transition-colors duration-500">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        <Link to="/" className="flex items-center text-slate-500 dark:text-gray-400 hover:text-blue-600 mb-8 font-semibold w-fit transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Search
        </Link>

        {/* Hero Banner */}
        <div className="w-full h-80 md:h-[450px] rounded-[2rem] overflow-hidden relative mb-12 shadow-2xl">
          <img 
            src={dest.media?.heroImage || dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} 
            alt={dest.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex items-end p-8 md:p-12">
            <div>
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block shadow-lg">
                {dest.type || dest.tags?.[0] || 'Destination'}
              </span>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-3 drop-shadow-lg">{dest.name}</h1>
              <p className="text-slate-200 font-medium text-xl flex items-center gap-2 drop-shadow-md">
                <MapPin size={20} /> {dest.country || dest.location || 'Explore the world'}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 border-b-2 border-slate-200 dark:border-gray-800 mb-10 pb-0 overflow-x-auto scrollbar-hide">
          {['hotels', 'activities', 'flights'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xl font-black capitalize transition-all pb-4 border-b-4 -mb-[2px] whitespace-nowrap ${
                activeTab === tab ? 'text-blue-600 border-blue-600' : 'text-slate-400 dark:text-gray-500 border-transparent hover:text-slate-600 dark:hover:text-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {/* HOTELS TAB */}
          {activeTab === 'hotels' && (
            hotels.length > 0 ? hotels.map(hotel => {
              const isSelected = activeTrip.selectedHotel?.hotelId === hotel.hotelId;
              return (
                <div key={hotel.hotelId} className={`flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-blue-600 shadow-xl dark:ring-blue-900/20 ring-blue-50' : 'border-slate-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800'}`}>
                  <img src={hotel.image} className="w-full md:w-72 h-56 md:h-auto object-cover" alt={hotel.name} />
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">{hotel.name}</h3>
                        <span className="flex items-center bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold px-3 py-1 rounded-xl text-sm"><Star size={16} className="mr-1 fill-current" /> {hotel.rating}</span>
                      </div>
                      <p className="text-slate-500 dark:text-gray-400 font-medium mb-4 text-lg">{hotel.amenities?.join(' • ')}</p>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <div>
                        <p className="text-4xl font-black text-slate-900 dark:text-white">${hotel.pricePerNight}</p>
                        <span className="text-sm font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wide">per night</span>
                      </div>
                      <button onClick={() => selectHotel(hotel)} className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 text-lg ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-gray-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-gray-700'}`}>
                        {isSelected ? <><Check size={20} /> SELECTED</> : 'SELECT ROOM'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : <p className="dark:text-white text-center py-10">No hotels available.</p>
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map(activity => {
                const isSelected = isActivitySelected(activity.activityId);
                return (
                  <div key={activity.activityId} className={`flex flex-col bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-slate-900 dark:border-blue-500 shadow-xl' : 'border-slate-100 dark:border-gray-800 shadow-sm'}`}>
                    <img src={activity.image} className="w-full h-48 object-cover" alt={activity.title} />
                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{activity.title}</h3>
                      <div className="flex gap-3 mb-6">
                        <span className="flex items-center text-sm font-bold text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-gray-800 px-3 py-1 rounded-lg"><Clock size={14} className="mr-2" /> {activity.duration}</span>
                      </div>
                      <div className="flex justify-between items-end pt-4 border-t dark:border-gray-800">
                        <p className="text-2xl font-black dark:text-white">${activity.price}</p>
                        <button onClick={() => toggleActivity(activity)} className={`px-6 py-2 rounded-xl font-bold border-2 ${isSelected ? 'bg-slate-900 dark:bg-blue-600 text-white border-slate-900 dark:border-blue-600' : 'border-slate-200 dark:border-gray-700 dark:text-white'}`}>
                          {isSelected ? 'REMOVE' : 'ADD'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* FLIGHTS TAB - Integrated with Alisha's Data */}
          {activeTab === 'flights' && (
            <div className="space-y-4">
              {flights.length > 0 ? flights.map(flight => {
                const isSelected = activeTrip.selectedFlight?.flightId === flight.flightId;
                return (
                  <div key={flight.flightId} className={`p-8 bg-white dark:bg-gray-900 rounded-3xl border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-6 ${isSelected ? 'border-blue-600 shadow-xl' : 'border-slate-100 dark:border-gray-800 shadow-sm'}`}>
                    <div className="flex items-center gap-6 w-full">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-5 rounded-2xl text-blue-600"><Plane size={32} /></div>
                      <div>
                        <h3 className="text-2xl font-black dark:text-white">{flight.airline}</h3>
                        <p className="text-slate-500 dark:text-gray-400 font-bold uppercase text-xs tracking-widest">{flight.day} • {flight.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto md:gap-12 border-t md:border-t-0 pt-4 md:pt-0 dark:border-gray-800">
                      <p className="text-3xl font-black dark:text-white">${flight.price}</p>
                      <button onClick={() => selectFlight(flight)} className={`px-10 py-4 rounded-2xl font-black text-lg transition-all ${isSelected ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-gray-800 dark:text-white hover:bg-slate-200'}`}>
                        {isSelected ? 'SELECTED ✓' : 'SELECT'}
                      </button>
                    </div>
                  </div>
                );
              }) : <p className="dark:text-white text-center py-10">No flights available in database.</p>}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t dark:border-gray-800 p-6 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="hidden sm:flex gap-4">
            <div className={`px-4 py-2 rounded-xl text-sm font-black ${activeTrip.selectedFlight ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>FLIGHT {activeTrip.selectedFlight ? '✓' : '—'}</div>
            <div className={`px-4 py-2 rounded-xl text-sm font-black ${activeTrip.selectedHotel ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>HOTEL {activeTrip.selectedHotel ? '✓' : '—'}</div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right"><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Price</p><p className="text-3xl font-black dark:text-white">${tripTotal}</p></div>
            <button onClick={() => navigate('/checkout')} className={`px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-2 ${tripTotal > 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`} disabled={tripTotal === 0}>REVIEW TRIP <ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDashboard;