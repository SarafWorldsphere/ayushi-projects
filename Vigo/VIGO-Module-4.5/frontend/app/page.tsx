'use client';
import { useState, useEffect } from 'react';

export default function Module45OperationsDashboard() {
  const [activeTab, setActiveTab] = useState('Ops Overview');

  // State for dynamic data
  const [metrics, setMetrics] = useState({
    orders_in_progress: 34,
    orders_delayed: 3,
    avg_prep_time_mins: 12,
    avg_delivery_time_mins: 22,
    cancelled_today: 5,
    sla_breaches: 2,
    active_riders_online: 24,
  });
  
  const [liveOrders, setLiveOrders] = useState([]);
  const [selectedMapPin, setSelectedMapPin] = useState<string | null>('hotel-1');

  // Fetch real data from backend on load
  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/module45';
    
    // Fetch Overview Metrics
    fetch(`${API}/overview`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => console.log('Using default mock metrics'));

    // Fetch Live Orders
    fetch(`${API}/live-orders`)
      .then((res) => res.json())
      .then((data) => setLiveOrders(data))
      .catch(() => console.log('Failed to fetch live orders'));
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

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-800">Rider & Hotel Map</h3>
              <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md">
                Zone: Metro District
              </span>
            </div>

            <div className="w-full h-[230px] rounded-xl relative overflow-hidden shadow-sm border border-gray-200 group bg-blue-50">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ 
                  backgroundImage: `url('https://api.maptiler.com/maps/basic-v2/static/auto/800x600.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL')`,
                }}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 2px, transparent 2px), linear-gradient(90deg, #cbd5e1 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
              </div>

              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300">
                <path d="M 80 80 Q 200 120 300 100" fill="none" stroke="#F97316" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="opacity-80" />
                <path d="M 140 180 Q 250 200 350 250" fill="none" stroke="#0F766E" strokeWidth="4" strokeLinecap="round" strokeDasharray="8 8" className="opacity-80" />
              </svg>

              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/80 to-transparent pointer-events-none"></div>

              <div 
                onClick={() => setSelectedMapPin('hotel-1')}
                className="absolute top-[25%] left-[20%] cursor-pointer group/pin transition-all hover:z-20 scale-90"
              >
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
            </div>
          </div>

          <div className="mt-4 border-t border-gray-100 pt-4">
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
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Active Orders</h2>
            <p className="text-sm text-gray-500">Live order pipeline</p>
          </div>
          <span className="px-4 py-1.5 bg-orange-100 text-orange-600 font-bold rounded-lg border border-orange-200">
            {liveOrders.length} Active
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer ID</th>
                <th className="p-4">Restaurant ID</th>
                <th className="p-4">Rider ID</th>
                <th className="p-4">Status</th>
                <th className="p-4">Order Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {liveOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-medium">No live orders found.</td>
                </tr>
              ) : (
                liveOrders.map((ord: any) => (
                  <tr key={ord.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-teal-700">{ord.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{ord.customer_id || 'Unknown'}</td>
                    <td className="p-4 text-gray-600">{ord.restaurant_id || 'Unknown'}</td>
                    <td className="p-4 text-gray-600">{ord.rider_id || 'Unassigned'}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase ${
                        ord.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-700'
                          : ord.status === 'PREPARING'
                          ? 'bg-amber-100 text-amber-700'
                          : ord.status === 'OUT_FOR_DELIVERY' || ord.status === 'PICKED'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-gray-500">
                      {ord.created_at ? new Date(ord.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===================== TAB 3: RIDER TRACKING =====================
  const renderRiderTracking = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
              Rider Fleet
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
            </h2>
            <p className="text-sm text-gray-500">Live GPS tracking</p>
          </div>
        </div>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
          Rider GPS tracking integration is pending real-time socket connections.
        </div>
      </div>
    );
  };

  // ===================== TAB 4: HOTEL STATUS =====================
  const renderHotelStatus = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
              Restaurant Partners
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
            </h2>
            <p className="text-sm text-gray-500">Kitchen queue monitoring</p>
          </div>
        </div>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
          Kitchen queue and partner status metrics are pending endpoint aggregation.
        </div>
      </div>
    );
  };

  // ===================== TAB 5: DELAYS & ALERTS =====================
  const renderDelaysAlerts = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
              Active Alerts
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
            </h2>
            <p className="text-sm text-gray-500">SLA flags and delays</p>
          </div>
        </div>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
          Automated SLA alerts module is currently under development.
        </div>
      </div>
    );
  };

  // ===================== TAB 6: ESCALATIONS =====================
  const renderEscalations = () => {
    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center">
              Escalation Desk
              <span className="ml-4 px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
            </h2>
            <p className="text-sm text-gray-500">Incident tickets</p>
          </div>
        </div>
        <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
          Ticketing and escalation workflows will be connected in a future release.
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FFFDF8] font-sans text-gray-800">
      <aside className="w-[260px] bg-white min-h-screen flex flex-col pt-8 border-r border-gray-200 z-10">
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