import React from 'react';
import { MessageSquare, Phone, Mail, HelpCircle } from 'lucide-react';

const Support = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-10 pb-20 px-6 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Support Center.</h1>
        <p className="text-slate-500 dark:text-gray-400 font-medium mb-12">We're here to help you 24/7. Choose your preferred way to connect.</p>

        <div className="space-y-4">
          {[
            { icon: <MessageSquare />, title: "Live Chat", desc: "Average wait time: 2 mins", color: "bg-green-500" },
            { icon: <Phone />, title: "Call Us", desc: "+1 (800) TRAVEL-PRO", color: "bg-blue-500" },
            { icon: <Mail />, title: "Email Support", desc: "help@travelpro.io", color: "bg-purple-500" },
            { icon: <HelpCircle />, title: "Knowledge Base", desc: "Read our FAQs", color: "bg-orange-500" }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-6 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl text-white ${item.color}`}>{item.icon}</div>
                <div>
                  <h4 className="font-bold dark:text-white">{item.title}</h4>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
              </div>
              <button className="text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">Connect →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;