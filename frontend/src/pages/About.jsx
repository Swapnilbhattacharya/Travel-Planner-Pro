import React from 'react';
import { Globe, Users, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-10 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Our Story.</h1>
        <p className="text-lg text-slate-600 dark:text-gray-400 leading-relaxed mb-12">
          Founded in Manipal, TRAVEL.PRO was born out of a simple idea: travel planning shouldn't feel like a chore. 
          We use data-driven insights to help explorers find their next adventure without the clutter of traditional booking sites.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-gray-800">
            <Globe className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold text-xl dark:text-white mb-2">Global Reach</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Access to over 500+ premium destinations across 6 continents.</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-gray-800">
            <Users className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold text-xl dark:text-white mb-2">Expert Curation</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">Every hotel and activity is hand-verified by our travel specialists.</p>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-gray-900 rounded-3xl border border-slate-100 dark:border-gray-800">
            <ShieldCheck className="text-blue-600 mb-4" size={32} />
            <h3 className="font-bold text-xl dark:text-white mb-2">Secure Travel</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400">24/7 support and end-to-en encryption for all your bookings.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;