import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlanContext } from '../context/PlanContext';
import { ArrowLeft, Star, Clock, MapPin, Check, ChevronRight } from 'lucide-react';

const TripDashboard = () => {
  const { activeTrip, selectHotel, toggleActivity } = useContext(PlanContext);
  const [activeTab, setActiveTab] = useState('hotels');
  const navigate = useNavigate();

  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Trip session expired.</h2>
        <Link to="/" className="text-blue-600 font-bold hover:underline">Return to Search</Link>
      </div>
    );
  }

  const dest = activeTrip.baseData;
  const hotels = dest.hotels || [];
  const activities = dest.sightseeing || [];

  const isActivitySelected = (activityId) => {
    return activeTrip.selectedActivities?.some(a => a.activityId === activityId);
  };

  // Calculate the running total
  const hotelTotal = activeTrip.selectedHotel?.pricePerNight || 0;
  const activitiesTotal = activeTrip.selectedActivities?.reduce((sum, act) => sum + act.price, 0) || 0;
  const tripTotal = hotelTotal + activitiesTotal;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Centered, Full-Width Planning Area */}
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        <Link to="/" className="flex items-center text-slate-500 hover:text-blue-600 mb-8 font-semibold w-fit transition-colors">
          <ArrowLeft size={18} className="mr-2" /> Back to Search
        </Link>

        {/* The Destination Hero Banner */}
        <div className="w-full h-80 md:h-[450px] rounded-[2rem] overflow-hidden relative mb-12 shadow-2xl">
          <img 
            src={dest.media?.heroImage || dest.image || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800"} 
            alt={dest.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex items-end p-8 md:p-12">
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

        {/* Tabbed Navigation */}
        <div className="flex gap-10 border-b-2 border-slate-200 mb-10 pb-0 overflow-x-auto">
          {['hotels', 'activities', 'flights'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xl font-black capitalize transition-all pb-4 border-b-4 -mb-[2px] whitespace-nowrap ${
                activeTab === tab 
                  ? 'text-blue-600 border-blue-600' 
                  : 'text-slate-400 border-transparent hover:text-slate-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* DYNAMIC TAB CONTENT */}
        <div className="space-y-6">
          
          {/* HOTELS TAB */}
          {activeTab === 'hotels' && (
            hotels.length > 0 ? hotels.map(hotel => {
              const isSelected = activeTrip.selectedHotel?.hotelId === hotel.hotelId;
              return (
                <div key={hotel.hotelId} className={`flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-blue-600 shadow-xl shadow-blue-100 ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200'}`}>
                  <img src={hotel.image} className="w-full md:w-72 h-56 md:h-auto object-cover" alt={hotel.name} />
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900">{hotel.name}</h3>
                        <span className="flex items-center bg-green-100 text-green-700 font-bold px-3 py-1 rounded-xl text-sm">
                          <Star size={16} className="mr-1 fill-current" /> {hotel.rating}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium mb-4 text-lg">{hotel.amenities?.join(' • ')}</p>
                    </div>
                    <div className="flex justify-between items-end mt-6">
                      <div>
                        <p className="text-4xl font-black text-slate-900">${hotel.pricePerNight}</p>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wide">per night / room</span>
                      </div>
                      <button 
                        onClick={() => selectHotel(hotel)} 
                        className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-2 text-lg ${isSelected ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}
                      >
                        {isSelected ? <><Check size={20} /> SELECTED</> : 'SELECT ROOM'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <p className="font-bold text-slate-500 text-lg">Awaiting Hotel Data from Database...</p>
              </div>
            )
          )}

          {/* ACTIVITIES TAB */}
          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.length > 0 ? activities.map(activity => {
                const isSelected = isActivitySelected(activity.activityId);
                return (
                  <div key={activity.activityId} className={`flex flex-col bg-white rounded-3xl overflow-hidden border-2 transition-all ${isSelected ? 'border-slate-900 shadow-xl ring-4 ring-slate-100' : 'border-slate-100 shadow-sm hover:shadow-md'}`}>
                    <img src={activity.image} className="w-full h-48 object-cover" alt={activity.title} />
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 mb-3">{activity.title}</h3>
                        <div className="flex gap-3 mb-6">
                          <span className="flex items-center text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                            <Clock size={14} className="mr-2" /> {activity.duration}
                          </span>
                          <span className="flex items-center text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
                            {activity.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-end border-t border-slate-100 pt-4">
                        <p className="text-2xl font-black text-slate-900">${activity.price}</p>
                        <button 
                          onClick={() => toggleActivity(activity)} 
                          className={`px-6 py-3 rounded-xl font-bold transition-all border-2 ${isSelected ? 'bg-slate-900 text-white border-slate-900' : 'bg-transparent text-slate-900 border-slate-200 hover:border-slate-900'}`}
                        >
                          {isSelected ? 'REMOVE' : 'ADD THIS'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-slate-100">
                  <p className="font-bold text-slate-500 text-lg">Awaiting Activity Data from Database...</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* THE STICKY BOTTOM BAR (MMT Style Checkout Trigger) */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Your Trip Status</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${activeTrip.selectedHotel ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                  {activeTrip.selectedHotel ? '1 Hotel' : 'No Hotel'}
                </span>
                <span className={`px-3 py-1 rounded-lg text-sm font-bold ${activeTrip.selectedActivities?.length > 0 ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                  {activeTrip.selectedActivities?.length || 0} Activities
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Total Estimated Price</p>
              <p className="text-3xl font-black text-slate-900">${tripTotal}</p>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-2 transition-all ${tripTotal > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              disabled={tripTotal === 0}
            >
              REVIEW TRIP <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default TripDashboard;