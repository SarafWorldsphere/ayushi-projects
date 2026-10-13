'use client';
import { useState, useEffect } from 'react';

export default function Module46AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('Reports Overview');

  // FIX Error A2: Initialize with zeros instead of fake fallback numbers
  const [metrics, setMetrics] = useState({
    total_revenue: 0,
    orders_this_month: 0,
    avg_order_value: 0,
    hotel_commission_earned: 0,
    rider_payouts: 0,
    tds_deducted: 0
  });

  const [chartData, setChartData] = useState([]);
  const [featureFlags, setFeatureFlags] = useState<any[]>([]);

  useEffect(() => {
    // FIX Error A1: Ensure the frontend points to the correct /api/module46 route
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/module46';
    
    fetch(`${API}/reports-summary`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => console.log('Failed to fetch live metrics'));

    fetch(`${API}/chart-data`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setChartData(data.map((d: any) => ({
            ...d,
            label: `₹${(d.revenue / 100000).toFixed(1)}L`
          })));
        }
      })
      .catch(() => console.log('Failed to fetch chart data'));

    // FIX Error A4: Fetch real feature flags from the database
    fetch(`${API}/feature-flags`)
      .then((res) => res.json())
      .then((data) => setFeatureFlags(data))
      .catch(() => console.log('Failed to fetch feature flags'));
  }, []);

  // FIX Error A4: Function to update flag in the database when toggled
  const toggleFlag = async (id: number, currentStatus: boolean) => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/module46';
    const newStatus = !currentStatus;
    
    // Optimistic UI update
    setFeatureFlags(flags => flags.map(f => f.id === id ? { ...f, is_enabled: newStatus } : f));

    try {
      await fetch(`${API}/feature-flags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: newStatus })
      });
    } catch (e) {
      // Revert if API fails
      setFeatureFlags(flags => flags.map(f => f.id === id ? { ...f, is_enabled: currentStatus } : f));
      console.error("Failed to update flag");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "/";
  };

  const navItems = [
    'Reports Overview',
    'Sales Reports',
    'Commission Reports',
    'Analytics',
    'Configuration',
    'Feature Flags'
  ];

  // ===================== TAB 1: REPORTS OVERVIEW =====================
  const renderReportsOverview = () => (
    <div className="animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-800 tracking-tight">VIGO Feast Reports & Analytics</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configuration & reporting dashboard • VGF_ blueprint</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
            <span>Reports & Analytics</span>
            <span className="text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-md">
              Monthly Snapshot
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-gray-500">Total Revenue (Delivered)</span>
              <span className="text-3xl font-black text-gray-900">
                ₹{(metrics?.total_revenue ?? 0).toLocaleString('en-US')}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm font-semibold text-gray-500">Orders This Month</span>
                <span className="text-xl font-bold text-gray-800">
                  {(metrics?.orders_this_month ?? 0).toLocaleString('en-US')}
                </span>
              </div>
              <div>
                <span className="block text-sm font-semibold text-gray-500">Avg Order Value</span>
                <span className="text-xl font-bold text-gray-800">
                  ₹{(metrics?.avg_order_value ?? 0).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-lg font-bold text-gray-800">Analytics & System Config</h3>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
              Sales Trajectory
            </span>
          </div>
          {chartData.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-sm font-semibold text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              Chart data not available for this period.
            </div>
          ) : (
            <div className="w-full bg-[#FFFDF8] rounded-xl border border-gray-200 p-5 mb-6 shadow-sm relative">
              <div className="h-44 flex items-end justify-around gap-3 pt-6 relative z-10">
                {/* Dynamic Chart rendering will go here when data exists */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ===================== TAB 2: SALES REPORTS =====================
  const renderSalesReports = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            Daily Sales Summary
            <span className="px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
          </h2>
        </div>
      </div>
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
        Sales ledger history will appear here once connected to the billing microservice.
      </div>
    </div>
  );

  // ===================== TAB 3: COMMISSION REPORTS =====================
  const renderCommissionReports = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            Partner Commission Settlements
            <span className="px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
          </h2>
        </div>
      </div>
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
        Commission settlement module requires the payouts API integration.
      </div>
    </div>
  );

  // ===================== TAB 4: ANALYTICS =====================
  const renderAnalytics = () => (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
          Customer & Operational Analytics
          <span className="px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
        </h2>
      </div>
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
        Deep analytics dashboard is currently under development.
      </div>
    </div>
  );

  // ===================== TAB 5: CONFIGURATION =====================
  const renderConfiguration = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight flex items-center gap-3">
            System & Tax Configuration
            <span className="px-2 py-1 bg-purple-100 text-purple-700 font-black rounded text-[10px] uppercase tracking-widest border border-purple-200">Sample Data</span>
          </h2>
        </div>
      </div>
      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-gray-500 font-medium">
        Configuration forms are read-only until connected to the centralized config database.
      </div>
    </div>
  );

  // ===================== TAB 6: FEATURE FLAGS =====================
  const renderFeatureFlags = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Feature Flag Management</h2>
          <p className="text-sm text-gray-500">Rollout controls from table: VGF_feature_flags_config</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4">Feature Name</th>
              <th className="p-4">System ID</th>
              <th className="p-4">Rollout Scope</th>
              <th className="p-4">Toggle State</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {featureFlags.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No flags configured.</td>
              </tr>
            ) : (
              featureFlags.map((f: any) => (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{f.feature_name}</td>
                  <td className="p-4 text-teal-700 font-mono font-bold text-xs">{f.id}</td>
                  <td className="p-4 font-semibold text-gray-600">{f.district || 'Global'}</td>
                  <td className="p-4">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={f.is_enabled} 
                        onChange={() => toggleFlag(f.id, f.is_enabled)}
                      />
                      <div className="w-11 h-6 bg-orange-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                      <span className="ml-3 text-xs font-black uppercase tracking-wider text-orange-500 peer-checked:text-green-600 transition-colors">
                        {f.is_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFFDF8] font-sans text-gray-800">
      <aside className="w-[260px] bg-white min-h-screen flex flex-col pt-8 border-r border-gray-200 z-10">
        <div className="px-6 mb-8 flex flex-col items-center text-center">
          <img src="/logo.jpeg" alt="VIGO Feast Logo" className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm mb-3" />
          <h1 className="text-xl font-black text-gray-800 tracking-tight">VIGO Feast</h1>
          <p className="text-[11px] text-orange-500 mt-1 uppercase tracking-widest font-bold border-b border-gray-100 pb-4 w-full text-center">
            Reports & Analytics
          </p>
        </div>

        <nav className="flex flex-col gap-2 px-4 flex-1">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`text-left px-5 py-3 rounded-xl font-bold transition-all flex items-center justify-between select-none ${
                activeTab === item ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
              }`}
            >
              {item}
            </button>
          ))}
          <div className="mt-auto pb-6">
            <button onClick={handleLogout} className="w-full flex items-center justify-start gap-3 px-5 py-3 rounded-xl font-bold transition-all text-red-600 hover:bg-red-50 select-none">
              Logout
            </button>
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
        {activeTab === 'Reports Overview' && renderReportsOverview()}
        {activeTab === 'Sales Reports' && renderSalesReports()}
        {activeTab === 'Commission Reports' && renderCommissionReports()}
        {activeTab === 'Analytics' && renderAnalytics()}
        {activeTab === 'Configuration' && renderConfiguration()}
        {activeTab === 'Feature Flags' && renderFeatureFlags()}
      </main>
    </div>
  );
}