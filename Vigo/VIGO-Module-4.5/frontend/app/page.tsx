'use client';
import { useState, useEffect } from 'react';

export default function Module45OperationsDashboard() {
  const [activeTab, setActiveTab] = useState('Ops Overview');

  // Operations metrics matching spec design
  const [metrics, setMetrics] = useState({
    orders_in_progress: 34,
    orders_delayed: 3,
    avg_prep_time_mins: 12,
    avg_delivery_time_mins: 22,
    cancelled_today: 5,
    sla_breaches: 2,
    active_riders_online: 24,
  });

  const [selectedMapPin, setSelectedMapPin] = useState<string | null>('hotel-1');

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/module45';
    fetch(`${API}/overview`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => console.log('Using default mock metrics'));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "/";
  };

  const navItems = [
    'Ops Overview',
    'Live Orders',
    'Rider Tracking',
    'Hotel Status',
    'Delays & Alerts',
    'Escalations'
  ];

  // ===================== TAB 1: OPS OVERVIEW =====================
  const renderOpsOverview = () => (
    <div className="animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">VIGO Feast Operations</h2>
        <p className="text-sm text-gray-500 mt-0.5">Live Dashboard • VGF_ blueprint</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* LEFT PANEL: LIVE ORDER MONITORING */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex items-center justify-between">
            <span>Live Order Monitoring</span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-green-50 text-green-600 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
              Live Feed
            </span>
          </h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">Orders In Progress</span>
              <span className="text-2xl font-black text-gray-800">{metrics.orders_in_progress}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">Orders Delayed</span>
              <span className="text-2xl font-black text-amber-500">{metrics.orders_delayed}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">Avg Prep Time</span>
              <span className="text-lg font-bold text-gray-800">{metrics.avg_prep_time_mins} min</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">Avg Delivery Time</span>
              <span className="text-lg font-bold text-gray-800">{metrics.avg_delivery_time_mins} min</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">Cancelled Today</span>
              <span className="text-xl font-black text-red-600">{metrics.cancelled_today}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-50">
              <span className="text-sm font-semibold text-gray-500">SLA Breaches</span>
              <span className="text-xl font-black text-red-600">{metrics.sla_breaches}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-semibold text-gray-500">Active Riders Online</span>
              <span className="text-xl font-black text-green-600">{metrics.active_riders_online}</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: RIDER & HOTEL OPERATIONS MAP */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-800">Rider & Hotel Map</h3>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                Zone: Metro District
              </span>
            </div>

            {/* COLORFUL MAP VIEWPORT */}
            <div className="w-full h-[230px] rounded-xl relative overflow-hidden shadow-sm border border-gray-200 group bg-blue-50">
              
              {/* Vibrant Map Background using an actual map tile style */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://api.maptiler.com/maps/basic-v2/static/auto/800x600.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL')`,
                }}
              >
                {/* Fallback pattern with thicker grid for better visual texture */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 2px, transparent 2px), linear-gradient(90deg, #cbd5e1 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
              </div>

              {/* Colorful Route Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                <path d="M 80 80 Q 200 120 300 100" fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="opacity-80" />
                <path d="M 140 180 Q 250 200 350 250" fill="none" stroke="#0F766E" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="opacity-80" />
              </svg>

              {/* Gradient for text readability at the top */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/80 to-transparent pointer-events-none"></div>

              {/* ================= PIN 1: HOTEL ================= */}
              <div 
                onClick={() => setSelectedMapPin('hotel-1')}
                className="absolute top-[25%] left-[20%] cursor-pointer group/pin transition-all hover:z-20 scale-90"
              >
                {/* Colored Label Base instead of white */}
                <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-orange-600 text-[11px] font-bold text-white px-3 py-1 rounded-md shadow-md border border-orange-700 whitespace-nowrap z-20">
                  Punjab Grill
                </span>
                
                <div className="absolute -top-8 -left-5 bg-orange-100 text-orange-800 font-black text-[10px] px-2 py-1 rounded-full shadow-md border border-orange-300 flex items-center gap-1.5 whitespace-nowrap transform -translate-y-1 transition-transform group-hover/pin:-translate-y-2 z-20">
                  <svg className="w-3 h-3 animate-spin-slow text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Prep: 8m left
                </div>
                
                <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10 transition-transform group-hover/pin:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div className="absolute inset-0 rounded-full bg-orange-500 opacity-40 animate-ping"></div>
              </div>

              {/* ================= PIN 2: HOTEL 2 ================= */}
              <div 
                onClick={() => setSelectedMapPin('hotel-2')}
                className="absolute top-[60%] left-[35%] cursor-pointer group/pin transition-all hover:z-20 scale-90"
              >
                <span className="absolute top-9 left-1/2 -translate-x-1/2 bg-gray-800 text-[11px] font-bold text-white px-3 py-1 rounded-md shadow-md border border-gray-900 whitespace-nowrap z-20">
                  Royal Biryani
                </span>

                <div className="absolute -top-8 -left-7 bg-red-100 text-red-700 font-black text-[10px] px-2 py-1 rounded-full shadow-md border border-red-300 flex items-center gap-1.5 whitespace-nowrap transform -translate-y-1 transition-transform group-hover/pin:-translate-y-2 z-20">
                  <span className="animate-pulse">⚠️ 4 Orders</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shadow-lg border-2 border-white relative z-10 transition-transform group-hover/pin:scale-110">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
              </div>

              {/* ================= PIN 3: RIDER 1 ================= */}
              <div 
                onClick={() => setSelectedMapPin('rider-1')}
                className="absolute top-[35%] right-[20%] cursor-pointer group/pin transition-all hover:z-20 scale-90"
              >
                <div className="absolute -inset-1 rounded-full bg-teal-500 opacity-40 animate-pulse"></div>

                <div className="relative w-9 h-9 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg border-2 border-white z-10 transition-transform group-hover/pin:scale-110">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h-3l-3 7h7l2-4h3" /><path d="M9 13l2-7" />
                  </svg>
                </div>
                
                <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-teal-700 text-[11px] font-bold text-white px-3 py-1.5 rounded-md shadow-md border border-teal-800 whitespace-nowrap flex flex-col items-center z-20">
                  <span>Rider #14</span>
                  <span className="text-[9px] text-teal-100 font-mono mt-0.5">32 km/h</span>
                </div>
              </div>

              {/* ================= PIN 4: RIDER 2 ================= */}
              <div 
                onClick={() => setSelectedMapPin('rider-2')}
                className="absolute bottom-[15%] right-[12%] cursor-pointer group/pin transition-all hover:z-20 scale-90"
              >
                <div className="absolute -inset-1 rounded-full bg-teal-500 opacity-40 animate-pulse"></div>
                
                <div className="relative w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg border-2 border-white z-10 transition-transform group-hover/pin:scale-110">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6h-3l-3 7h7l2-4h3" /><path d="M9 13l2-7" />
                  </svg>
                </div>

                <span className="absolute top-10 left-1/2 -translate-x-1/2 bg-teal-700 text-[11px] font-bold text-white px-3 py-1 rounded-md shadow-md border border-teal-800 whitespace-nowrap flex flex-col items-center z-20">
                  <span>Rider #08</span>
                </span>
              </div>
            </div>
          </div>

          {/* MAP LEGEND & STATUS FOOTER */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid grid-cols-3 gap-3 text-center text-xs mb-3">
              <div className="flex items-center justify-center gap-1.5 bg-orange-50 py-2 px-2 rounded-lg border border-orange-200 text-orange-700 shadow-sm">
                <span className="font-bold">Hotel</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-red-50 py-2 px-2 rounded-lg border border-red-200 text-red-700 shadow-sm">
                <span className="font-bold">Cooking</span>
              </div>
              <div className="flex items-center justify-center gap-1.5 bg-teal-50 py-2 px-2 rounded-lg border border-teal-200 text-teal-800 shadow-sm">
                <span className="font-bold">En Route</span>
              </div>
            </div>

            <div className="py-2 px-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] font-semibold text-gray-600 flex items-center justify-between">
              <span>Placed → Accepted → Preparing → Picked → Delivered</span>
              <span className="text-green-600 flex items-center gap-1.5 uppercase tracking-wider font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===================== TAB 2: LIVE ORDERS =====================
  const renderLiveOrders = () => {
    const liveOrders = [
      { id: 'VGF-10492', customer: 'Aryan Sharma', hotel: 'Punjab Grill Express', rider: 'Rider #14', status: 'Preparing', time: '8 min ago', targetSla: '25 min' },
      { id: 'VGF-10491', customer: 'Meera Nambiar', hotel: 'Dakshin Coastal Delight', rider: 'Rider #08', status: 'Picked', time: '14 min ago', targetSla: '30 min' },
      { id: 'VGF-10490', customer: 'Kabir Das', hotel: 'The Burger Barn', rider: 'Unassigned', status: 'Accepted', time: '2 min ago', targetSla: '20 min' },
      { id: 'VGF-10489', customer: 'Pooja Hegde', hotel: 'Royal Biryani House', rider: 'Rider #22', status: 'Delivered', time: '28 min ago', targetSla: '35 min' },
      { id: 'VGF-10488', customer: 'Tanmay Bhatt', hotel: 'Wok & Roll Bistro', rider: 'Rider #03', status: 'Preparing', time: '19 min ago', targetSla: '25 min' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Active Orders</h2>
            <p className="text-sm text-gray-500">Live order pipeline</p>
          </div>
          <span className="px-4 py-1.5 bg-orange-100 text-orange-600 font-bold rounded-lg border border-orange-200">
            34 Active
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Rider</th>
                <th className="p-4">Status</th>
                <th className="p-4">SLA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {liveOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-teal-700">{ord.id}</td>
                  <td className="p-4 font-semibold text-gray-800">{ord.customer}</td>
                  <td className="p-4 text-gray-600">{ord.hotel}</td>
                  <td className="p-4 text-gray-600">{ord.rider}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase ${
                      ord.status === 'Delivered'
                        ? 'bg-green-100 text-green-700'
                        : ord.status === 'Preparing'
                        ? 'bg-amber-100 text-amber-700'
                        : ord.status === 'Picked'
                        ? 'bg-teal-100 text-teal-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-gray-500">{ord.targetSla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===================== TAB 3: RIDER TRACKING =====================
  const renderRiderTracking = () => {
    const riders = [
      { id: 'RD-014', name: 'Vikram Rajput', zone: 'Central District - Hub 1', battery: '92%', status: 'En Route to Hotel', speed: '28 km/h' },
      { id: 'RD-008', name: 'Sunil Chawla', zone: 'North Sector - Hub 3', battery: '74%', status: 'Delivering Order', speed: '34 km/h' },
      { id: 'RD-022', name: 'Rahul Deshmukh', zone: 'Central District - Hub 2', battery: '48%', status: 'Idle / Available', speed: '0 km/h' },
      { id: 'RD-003', name: 'Karan Malhotra', zone: 'East Extension - Hub 5', battery: '85%', status: 'At Pickup Location', speed: '0 km/h' },
      { id: 'RD-019', name: 'Deepak Varma', zone: 'South Sector - Hub 2', battery: '61%', status: 'Delivering Order', speed: '22 km/h' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Rider Fleet</h2>
            <p className="text-sm text-gray-500">Live GPS tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {riders.map((r) => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 text-base">{r.name}</h3>
                  <span className="text-xs font-bold bg-gray-100 px-2.5 py-1 rounded-md text-teal-700">
                    {r.id}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{r.zone}</p>

                <div className="space-y-3 py-3 border-y border-gray-100 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Action:</span>
                    <span className="font-bold text-gray-800">{r.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Speed:</span>
                    <span className="font-bold text-teal-700">{r.speed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Battery:</span>
                    <span className="font-bold text-gray-700">{r.battery}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  GPS Active
                </span>
                <button className="text-sm text-orange-500 hover:text-white hover:bg-orange-500 bg-orange-50 transition-colors font-bold px-3 py-1.5 rounded-lg border border-orange-200 hover:border-orange-500">Ping</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===================== TAB 4: HOTEL STATUS =====================
  const renderHotelStatus = () => {
    const hotels = [
      { name: 'Punjab Grill Express', activeOrders: 7, avgPrep: '11 min', status: 'Optimal Flow', load: '65%' },
      { name: 'Royal Biryani House', activeOrders: 12, avgPrep: '18 min', status: 'Prep Delay Warning', load: '92%' },
      { name: 'Dakshin Coastal Delight', activeOrders: 4, avgPrep: '9 min', status: 'Optimal Flow', load: '40%' },
      { name: 'The Burger Barn', activeOrders: 8, avgPrep: '13 min', status: 'Optimal Flow', load: '70%' },
      { name: 'Wok & Roll Bistro', activeOrders: 3, avgPrep: '10 min', status: 'Optimal Flow', load: '35%' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Restaurant Partners</h2>
            <p className="text-sm text-gray-500">Kitchen queue monitoring</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Restaurant</th>
                <th className="p-4">Queue</th>
                <th className="p-4">Avg Prep</th>
                <th className="p-4">Load</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {hotels.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{h.name}</td>
                  <td className="p-4 font-semibold text-gray-700">{h.activeOrders} tickets</td>
                  <td className="p-4 font-semibold text-gray-700">{h.avgPrep}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${parseInt(h.load) > 80 ? 'bg-red-500' : 'bg-teal-600'}`} 
                          style={{ width: h.load }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500 font-bold">{h.load}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase ${
                      h.status.includes('Warning')
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {h.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===================== TAB 5: DELAYS & ALERTS =====================
  const renderDelaysAlerts = () => {
    const alerts = [
      { id: 'ALT-901', order: 'VGF-10488', level: 'CRITICAL', title: 'Prep SLA Breached (+6 min)', hotel: 'Royal Biryani House', time: '4 min ago' },
      { id: 'ALT-902', order: 'VGF-10476', level: 'WARNING', title: 'Rider delayed in traffic sector 4', hotel: 'The Burger Barn', time: '9 min ago' },
      { id: 'ALT-903', order: 'VGF-10462', level: 'CRITICAL', title: 'Order pickup unassigned past threshold', hotel: 'Tandoor Express', time: '14 min ago' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Active Alerts</h2>
            <p className="text-sm text-gray-500">SLA flags and delays</p>
          </div>
        </div>

        <div className="space-y-4">
          {alerts.map((a) => (
            <div key={a.id} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase tracking-wider ${
                  a.level === 'CRITICAL' 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-amber-100 text-amber-600'
                }`}>
                  {a.level}
                </span>
                <div>
                  <h4 className="font-bold text-gray-800 text-base">{a.title}</h4>
                  <p className="text-sm text-gray-500 mt-0.5">Order: <span className="font-bold text-teal-700">{a.order}</span> • {a.hotel}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-500 mb-2">{a.time}</p>
                <button className="px-4 py-2 bg-orange-50 hover:bg-orange-500 hover:text-white text-sm text-orange-500 border border-orange-200 hover:border-orange-500 rounded-lg transition-colors font-bold">
                  Resolve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ===================== TAB 6: ESCALATIONS =====================
  const renderEscalations = () => {
    const escalations = [
      { id: 'ESC-402', order: 'VGF-10462', issue: 'Customer escalated cold food delivery', owner: 'Rahul (Ops)', status: 'Investigating', priority: 'High' },
      { id: 'ESC-401', order: 'VGF-10444', issue: 'Wrong parcel delivered by rider', owner: 'Manoj (Lead)', status: 'Refunded', priority: 'Urgent' },
      { id: 'ESC-400', order: 'VGF-10412', issue: 'Kitchen refused preparation (inventory)', owner: 'Simran (Ops)', status: 'Resolved', priority: 'Medium' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Escalation Desk</h2>
            <p className="text-sm text-gray-500">Incident tickets</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Ticket</th>
                <th className="p-4">Order</th>
                <th className="p-4">Issue Description</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {escalations.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-800">{e.id}</td>
                  <td className="p-4 font-bold text-teal-700">{e.order}</td>
                  <td className="p-4 font-medium text-gray-700">{e.issue}</td>
                  <td className="p-4 text-gray-600">{e.owner}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase ${
                      e.status.includes('Resolved') || e.status.includes('Refunded')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF8] font-sans text-gray-800">
      {/* SIDEBAR - PURE WHITE */}
      <aside className="w-[260px] bg-white min-h-screen flex flex-col pt-8 border-r border-gray-200 z-10">
        
        {/* LOGO & BRANDING */}
        <div className="px-6 mb-8 flex flex-col items-center text-center">
          <img 
            src="/logo.jpeg" 
            alt="VIGO Feast Logo" 
            className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm mb-3"
          />
          <h1 className="text-xl font-black text-gray-800 tracking-tight">VIGO Feast</h1>
          <p className="text-[11px] text-orange-500 mt-1 uppercase tracking-widest font-bold border-b border-gray-100 pb-4 w-full text-center">
            Operations Area
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-left px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-between ${
                activeTab === item
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                  : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {item}
              {activeTab === item && (
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}

          {/* LOGOUT BUTTON */}
          <div className="mt-auto pb-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start gap-3 px-5 py-3 rounded-xl font-bold transition-all text-red-600 hover:bg-red-50"
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'Ops Overview' && renderOpsOverview()}
        {activeTab === 'Live Orders' && renderLiveOrders()}
        {activeTab === 'Rider Tracking' && renderRiderTracking()}
        {activeTab === 'Hotel Status' && renderHotelStatus()}
        {activeTab === 'Delays & Alerts' && renderDelaysAlerts()}
        {activeTab === 'Escalations' && renderEscalations()}
      </main>
    </div>
  );
}