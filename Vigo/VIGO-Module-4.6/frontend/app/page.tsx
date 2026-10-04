'use client';
import { useState, useEffect } from 'react';

export default function Module46AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('Reports Overview');

  const [metrics, setMetrics] = useState({
    total_revenue: 482600,
    orders_this_month: 12340,
    avg_order_value: 390,
    hotel_commission_earned: 72400,
    rider_payouts: 186200,
    tds_deducted: 9300
  });

  // Default mock data initialized immediately to prevent empty renders
  const [chartData, setChartData] = useState([
    { month: 'Jan', revenue: 320000, label: '₹3.2L' },
    { month: 'Feb', revenue: 380000, label: '₹3.8L' },
    { month: 'Mar', revenue: 350000, label: '₹3.5L' },
    { month: 'Apr', revenue: 410000, label: '₹4.1L' },
    { month: 'May', revenue: 482600, label: '₹4.8L' }
  ]);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/module46';
    fetch(`${API}/reports-summary`)
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => console.log('Using default mock metrics'));

    fetch(`${API}/chart-data`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setChartData(data.map((d: any) => ({
            ...d,
            label: `₹${(d.revenue / 100000).toFixed(1)}L`
          })));
        }
      })
      .catch(() => console.log('Using default mock chart data'));
  }, []);

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
        
        {/* LEFT PANEL: KEY METRICS */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3 flex justify-between items-center">
            <span>Reports & Analytics</span>
            <span className="text-[10px] font-bold bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-md">
              Monthly Snapshot
            </span>
          </h3>

          <div className="space-y-4">
            <div>
              <span className="block text-sm font-semibold text-gray-500">Total Revenue</span>
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
                  ₹{(metrics?.avg_order_value ?? 0).toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center py-1.5">
                <span className="font-semibold text-gray-600">Hotel Commission Earned</span>
                <span className="font-bold text-green-600">
                  ₹{(metrics?.hotel_commission_earned ?? 0).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-semibold text-gray-600">Rider Payouts</span>
                <span className="font-bold text-teal-700">
                  ₹{(metrics?.rider_payouts ?? 0).toLocaleString('en-US')}
                </span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="font-semibold text-gray-600">TDS Deducted</span>
                <span className="font-bold text-amber-500">
                  ₹{(metrics?.tds_deducted ?? 0).toLocaleString('en-US')}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button className="text-orange-500 hover:text-orange-600 font-bold text-sm flex items-center gap-2 transition-colors select-none">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Daily / MIS Report
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CHARTS & CONFIGURATION */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-800">Analytics & System Config</h3>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                Sales Trajectory
              </span>
            </div>

            {/* LIGHT MODE DYNAMIC BAR CHART */}
            <div className="w-full bg-[#FFFDF8] rounded-xl border border-gray-200 p-5 mb-6 shadow-sm relative">
              {/* Background Reference Lines */}
              <div className="absolute inset-x-5 top-6 border-b border-gray-200"></div>
              <div className="absolute inset-x-5 top-20 border-b border-gray-200"></div>
              <div className="absolute inset-x-5 top-34 border-b border-gray-200"></div>

              {/* Bar Chart Area */}
              <div className="h-44 flex items-end justify-around gap-3 pt-6 relative z-10">
                {chartData.map((d, i) => {
                  const percentage = Math.round((d.revenue / 500000) * 100);
                  return (
                    <div key={i} className="h-full flex-1 flex flex-col justify-end items-center group cursor-pointer">
                      {/* Metric Tag on Hover */}
                      <span className="text-[10px] font-bold text-gray-800 opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all mb-1 bg-white px-2 py-0.5 rounded shadow border border-gray-200 whitespace-nowrap">
                        {d.label}
                      </span>
                      {/* Bar Pillar */}
                      <div className="w-full max-w-[48px] h-full flex items-end">
                        <div
                          style={{ height: `${percentage}%` }}
                          className="w-full bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-md transition-all duration-500 group-hover:from-orange-400 group-hover:to-amber-400 shadow-sm"
                        ></div>
                      </div>
                      {/* Month Label */}
                      <span className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                        {d.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK SYSTEM LINKS */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-gray-600 font-semibold">
              <div className="font-extrabold text-gray-900 border-b border-gray-100 pb-1">System Links</div>
              <div className="font-extrabold text-gray-900 border-b border-gray-100 pb-1">Export & Setup</div>
              
              <span className="hover:text-orange-500 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Commission % Setup
              </span>
              <span className="hover:text-teal-700 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-teal-700"></span> GST / Tax Configuration
              </span>
              <span className="hover:text-green-600 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Payment Gateway Config
              </span>
              <span className="hover:text-amber-500 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Membership Tier Setup
              </span>
              <span className="hover:text-rose-500 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Offer & Combo Rules
              </span>
              <span className="hover:text-blue-500 cursor-pointer flex items-center gap-2 transition-colors select-none" onClick={() => setActiveTab('Configuration')}>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Notification Templates
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100 text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Report export: PDF / Excel
            </span>
            <span>Scheduled Daily MIS Email: Active</span>
          </div>
        </div>

      </div>
    </div>
  );

  // ===================== TAB 2: SALES REPORTS =====================
  const renderSalesReports = () => {
    const salesData = [
      { date: 'Sep 15, 2026', district: 'Metro District', orders: 1205, gross: 472500, discounts: 21000, net: 451500 },
      { date: 'Sep 14, 2026', district: 'Metro District', orders: 1180, gross: 461000, discounts: 19500, net: 441500 },
      { date: 'Sep 13, 2026', district: 'Metro District', orders: 1420, gross: 558000, discounts: 31000, net: 527000 },
      { date: 'Sep 12, 2026', district: 'Metro District', orders: 1395, gross: 545500, discounts: 28000, net: 517500 },
      { date: 'Sep 11, 2026', district: 'Metro District', orders: 1050, gross: 410000, discounts: 15000, net: 395000 },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Daily Sales Summary</h2>
            <p className="text-sm text-gray-500">Aggregated revenue metrics from table: VGF_sales_summary</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-bold text-gray-700 rounded-lg hover:bg-gray-50 transition-all select-none shadow-sm">Filter: This Week</button>
            <button className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 select-none">Export CSV</button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">District / Zone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Discounts (VGF)</th>
                <th className="p-4">Net Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {salesData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{row.date}</td>
                  <td className="p-4 font-semibold text-gray-600">{row.district}</td>
                  <td className="p-4 font-mono font-bold text-teal-700">{row.orders.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-bold text-gray-800">₹{row.gross.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-bold text-red-600">-₹{row.discounts.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-black text-green-600">₹{row.net.toLocaleString('en-US')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // ===================== TAB 3: COMMISSION REPORTS =====================
  const renderCommissionReports = () => {
    const commissionData = [
      { hotel: 'Punjab Grill Express', sales: 125000, rate: '15%', fee: 18750, tds: 1250, net: 105000, status: 'Settled' },
      { hotel: 'Royal Biryani House', sales: 210000, rate: '12%', fee: 25200, tds: 2100, net: 182700, status: 'Pending' },
      { hotel: 'Dakshin Coastal Delight', sales: 85000, rate: '15%', fee: 12750, tds: 850, net: 71400, status: 'Settled' },
      { hotel: 'The Burger Barn', sales: 150000, rate: '18%', fee: 27000, tds: 1500, net: 121500, status: 'Pending' },
    ];

    return (
      <div className="animate-in fade-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Partner Commission Settlements</h2>
            <p className="text-sm text-gray-500">Payout summaries from table: VGF_commission_summary</p>
          </div>
          <button className="px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 select-none">Process Pending Payouts</button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#FFFDF8] border-b border-gray-200 text-xs text-gray-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4">Partner Hotel</th>
                <th className="p-4">Gross Sales</th>
                <th className="p-4">Platform Fee Rate</th>
                <th className="p-4">Commission Deducted</th>
                <th className="p-4">TDS (1%)</th>
                <th className="p-4">Net Hotel Payout</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {commissionData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{row.hotel}</td>
                  <td className="p-4 font-mono font-bold text-gray-700">₹{row.sales.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-bold text-teal-700">{row.rate}</td>
                  <td className="p-4 font-mono font-bold text-amber-600">₹{row.fee.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-bold text-red-600">₹{row.tds.toLocaleString('en-US')}</td>
                  <td className="p-4 font-mono font-black text-green-600">₹{row.net.toLocaleString('en-US')}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 text-xs rounded-md font-bold uppercase tracking-wider ${
                      row.status === 'Settled' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {row.status}
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

  // ===================== TAB 4: ANALYTICS (LIGHT MODE CHARTS) =====================
  const renderAnalytics = () => (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Customer & Operational Analytics</h2>
        <p className="text-sm text-gray-500">KPIs from tables: VGF_analytics_metrics & VGF_customer_analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Customer Retention Rate', value: '68.4%', trend: '+2.1%', color: 'text-green-600' },
          { label: 'Average Delivery Rating', value: '4.7 / 5.0', trend: '+0.2', color: 'text-teal-700' },
          { label: 'Cart Abandonment', value: '18.2%', trend: '-1.5%', color: 'text-green-600' },
          { label: 'Active App Users (Weekly)', value: '45,210', trend: '+5.4%', color: 'text-green-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <p className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-2">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-black text-gray-900">{kpi.value}</span>
              <span className={`text-sm font-bold ${kpi.color}`}>{kpi.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PEAK ORDER HOURLY VOLUME - LIGHT BAR VISUAL */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Peak Order Volume by Hour</h3>
            <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Lunch & Dinner Spikes</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 px-2 pt-4 bg-[#FFFDF8] rounded-xl border border-gray-200">
            {[
              { hr: '10am', val: 25 }, { hr: '12pm', val: 85 }, { hr: '2pm', val: 70 },
              { hr: '4pm', val: 30 }, { hr: '6pm', val: 45 }, { hr: '8pm', val: 95 }, { hr: '10pm', val: 60 },
            ].map((bar, idx) => (
              <div key={idx} className="h-full flex-1 flex flex-col justify-end items-center group cursor-pointer">
                <div 
                  style={{ height: `${bar.val}%` }} 
                  className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${bar.val > 75 ? 'bg-orange-500 group-hover:bg-orange-400 shadow-md' : 'bg-teal-700 group-hover:bg-teal-600 shadow-sm'}`}
                ></div>
                <span className="text-[10px] text-gray-500 font-bold uppercase mt-2">{bar.hr}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CUSTOMER SEGMENTATION BREAKDOWN - LIGHT PIE/BAR */}
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900">Customer Demographics & Channels</h3>
            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Platform Origin</span>
          </div>

          <div className="h-44 flex flex-col justify-around p-4 bg-[#FFFDF8] rounded-xl border border-gray-200 text-sm">
            <div>
              <div className="flex justify-between text-gray-700 mb-1.5">
                <span className="font-semibold text-gray-600">Android App Users</span>
                <span className="font-black text-gray-900 font-mono">58%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-teal-700 h-full w-[58%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1.5">
                <span className="font-semibold text-gray-600">iOS Mobile Users</span>
                <span className="font-black text-gray-900 font-mono">32%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full w-[32%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1.5">
                <span className="font-semibold text-gray-600">Web / Desktop Portal</span>
                <span className="font-black text-gray-900 font-mono">10%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full w-[10%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ===================== TAB 5: CONFIGURATION =====================
  const renderConfiguration = () => (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">System & Tax Configuration</h2>
          <p className="text-sm text-gray-500">Manage variables for: VGF_tax_gst_config & VGF_system_configurations</p>
        </div>
        <button className="px-5 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 select-none">Save All Changes</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Financial Settings</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Base Platform Commission (%)</label>
            <input type="number" defaultValue={15} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Food Item GST Rate (%)</label>
            <input type="number" defaultValue={5} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Standard Delivery Fee (₹)</label>
            <input type="number" defaultValue={40} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm space-y-5">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Dynamic Pricing</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Rain / Bad Weather Surge Multiplier</label>
            <input type="number" step="0.1" defaultValue={1.5} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Late Night Delivery Surcharge (₹)</label>
            <input type="number" defaultValue={20} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors" />
          </div>
          <div className="pt-2 flex items-center">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 bg-[#FFFDF8] text-orange-500 focus:ring-orange-500" />
              <span className="text-sm font-bold text-gray-700">Enable Automated Surge Pricing during Peak Hours</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // ===================== TAB 6: FEATURE FLAGS =====================
  const renderFeatureFlags = () => {
    const flags = [
      { name: 'AI Route Optimization Engine', key: 'ENABLE_AI_ROUTING', scope: 'Global', status: true },
      { name: 'Automated Refund Processing', key: 'AUTO_REFUND_WALLET', scope: 'Metro District Only', status: true },
      { name: 'Cash on Delivery (COD) Option', key: 'PAY_METHOD_COD', scope: 'Global', status: false },
      { name: 'VIGO Premium Subscription Banner', key: 'SHOW_PREMIUM_UPSELL', scope: 'Global', status: true },
      { name: 'New Rider App Beta UI', key: 'BETA_RIDER_UI', scope: 'South Sector Testing', status: false },
    ];

    return (
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
                <th className="p-4">System Key</th>
                <th className="p-4">Rollout Scope</th>
                <th className="p-4">Toggle State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {flags.map((f, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{f.name}</td>
                  <td className="p-4 text-teal-700 font-mono font-bold text-xs">{f.key}</td>
                  <td className="p-4 font-semibold text-gray-600">{f.scope}</td>
                  <td className="p-4">
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" className="sr-only peer" defaultChecked={f.status} />
                      {/* Orange when disabled, Green when enabled */}
                      <div className="w-11 h-6 bg-orange-500 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                      <span className="ml-3 text-xs font-black uppercase tracking-wider text-orange-500 peer-checked:text-green-600 transition-colors">
                        {f.status ? 'Enabled' : 'Disabled'}
                      </span>
                    </label>
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
      {/* SIDEBAR */}
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
              {activeTab === item && (
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          ))}
          <div className="mt-auto pb-6">
            <button onClick={handleLogout} className="w-full flex items-center justify-start gap-3 px-5 py-3 rounded-xl font-bold transition-all text-red-600 hover:bg-red-50 select-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
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