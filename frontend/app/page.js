'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [customerName, setCustomerName] = useState("Ayushi");
  const [location, setLocation] = useState("Adajan, Surat");
  const [wantsCutlery, setWantsCutlery] = useState(false);
  
  // NEW STATE: Controls the mobile sidebar visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("customer_name");
    const savedLocation = localStorage.getItem("customer_location");
    if (savedName) setCustomerName(savedName);
    if (savedLocation) setLocation(savedLocation);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = process.env.NEXT_PUBLIC_LOGIN_URL || "/";
  };

  // Helper function to handle mobile menu auto-close on selection
  const handleNavClick = (tabName) => {
    setActiveTab(tabName);
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Cart', icon: '🛒' },
    { name: 'My Orders', icon: '📦' },
    { name: 'Tracking', icon: '🚚' },
    { name: 'Offers', icon: '🎁' },
    { name: 'Profile', icon: '👤' }
  ];

  // ===================== SOFT CODED MOCK DATA =====================
  const mockRestaurants = [
    { id: 1, name: "Saurashtra Thali", cuisine: "Gujarati, North Indian", rating: "4.8", time: "25-30 min", address: "Adajan, Surat", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80" },
    { id: 2, name: "The Pizzeria Hub", cuisine: "Italian, Fast Food", rating: "4.5", time: "30-40 min", address: "Vesu, Surat", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
    { id: 3, name: "Bombay Street Cafe", cuisine: "Street Food, Beverages", rating: "4.2", time: "15-20 min", address: "Piplod, Surat", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80" }
  ];

  const mockCart = [
    { id: 1, name: "Margherita Pizza", price: 299, qty: 1, restaurant: "The Pizzeria Hub", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=150&q=80" },
    { id: 2, name: "Cheesy Jalapeno Poppers", price: 149, qty: 2, restaurant: "The Pizzeria Hub", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=150&q=80" }
  ];

  const mockOrders = [
    { id: "ORD-8821", date: "Today, 1:30 PM", status: "Delivered", total: 450, restaurant: "Burger Point", items: "2x Veg Burger, 1x Fries", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80" },
    { id: "ORD-8705", date: "Yesterday, 8:15 PM", status: "Delivered", total: 890, restaurant: "Spicy Wok", items: "1x Hakka Noodles, 1x Manchurian", image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=200&q=80" },
    { id: "ORD-8622", date: "15 Sep, 7:00 PM", status: "Cancelled", total: 320, restaurant: "Healthy Bites", items: "1x Quinoa Salad", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=200&q=80" }
  ];

  const mockOffers = [
    { id: 1, code: "GANPATI20", desc: "Celebrate Ganesh Chaturthi with 20% off all Indian Sweets", validTill: "Valid till 30 Sep" },
    { id: 2, code: "WELCOME50", desc: "Get 50% off on your first order up to ₹100", validTill: "Valid till 30 Sep" },
    { id: 3, code: "FREEBIE", desc: "Free delivery on orders above ₹399", validTill: "Valid till 15 Oct" }
  ];

  // ===================== TAB 1: DASHBOARD =====================
  const renderDashboard = () => (
    <div className="animate-in fade-in duration-300">
      
      {/* HERO SECTION */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-gray-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 z-0 pointer-events-none"></div>
        <div className="flex-1 relative z-10 w-full">
          <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Deliver To</p>
          <div className="flex items-center gap-2 cursor-pointer group">
            <span className="text-teal-700 text-xl group-hover:animate-bounce">📍</span>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 border-b-2 border-dashed border-gray-300 group-hover:border-teal-700 transition-colors pb-1 truncate">{location}</h2>
            <span className="text-gray-400 text-sm">▼</span>
          </div>
        </div>
        <div className="flex-1 w-full relative z-10">
          <div className="flex bg-[#FFFDF8] border border-gray-300 rounded-2xl overflow-hidden focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 transition-all shadow-inner">
            <span className="pl-4 flex items-center justify-center text-gray-400">🔍</span>
            <input type="text" placeholder="Search for restaurant, cuisine or a dish..." className="w-full bg-transparent px-4 py-3 md:py-4 outline-none text-sm font-semibold text-gray-800" />
            <button className="bg-teal-700 hover:bg-teal-800 text-white px-4 md:px-6 font-bold text-sm transition-colors">Search</button>
          </div>
        </div>
      </div>

      {/* FESTIVE BANNER */}
      <div className="mb-8 w-full bg-gradient-to-r from-orange-400 to-red-500 rounded-3xl overflow-hidden relative shadow-lg flex flex-col md:flex-row items-center cursor-pointer hover:shadow-xl transition-shadow group">
        <div className="p-6 md:p-10 relative z-10 flex-1 w-full">
          <span className="bg-white/20 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md backdrop-blur-sm border border-white/30 mb-3 inline-block">Festive Special</span>
          <h2 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">Celebrate Ganesh Chaturthi!</h2>
          <p className="text-orange-50 font-medium mb-5 max-w-md text-sm md:text-base">Enjoy Modaks and grand feasts with your family. Use code <span className="bg-white text-orange-500 font-black px-2 py-0.5 rounded">GANPATI20</span> for 20% off traditional sweets.</p>
          <button className="bg-white text-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:scale-105 transition-transform w-full md:w-auto">Explore Sweets</button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 overflow-hidden opacity-90 transition-opacity hidden md:block">
           <img src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" alt="Festive Indian Sweets Modak" className="w-full h-full object-cover mask-image-gradient" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 30%)' }} />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Good morning, {customerName}!</h2>
        <p className="text-sm text-gray-500 mt-1">What are you craving today?</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {[
          { title: 'Order', desc: 'Track Status', tab: 'Tracking', icon: '🛍️' },
          { title: 'History', desc: 'Reorder Now', tab: 'My Orders', icon: '📦' },
          { title: 'Offers', desc: 'Explore', tab: 'Offers', icon: '🎁' },
          { title: 'Account', desc: 'Profile', tab: 'Profile', icon: '👤' },
        ].map((card, i) => (
          <div key={i} onClick={() => handleNavClick(card.tab)} className="bg-white border border-gray-200 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer flex flex-col md:flex-row items-center md:justify-between group gap-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">{card.icon}</div>
              <div>
                <p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase">{card.title}</p>
                <p className="text-xs md:text-sm font-black text-gray-800">{card.desc}</p>
              </div>
            </div>
            <span className="text-gray-300 group-hover:text-orange-500 transition-colors hidden md:block">→</span>
          </div>
        ))}
      </div>

      {/* RESTAURANTS GRID */}
      <div className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-xs font-bold text-teal-700 uppercase tracking-widest mb-1">Top Picks for you</p>
          <h3 className="text-xl font-extrabold text-gray-900">Popular Restaurants in Surat</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {mockRestaurants.map((res) => (
          <div key={res.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group">
            <div className="h-40 md:h-48 w-full relative overflow-hidden bg-gray-100">
               <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                 <span className="text-yellow-500 text-xs">⭐</span>
                 <span className="text-xs font-bold text-gray-800">{res.rating}</span>
               </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-extrabold text-gray-900 text-lg truncate pr-2">{res.name}</h4>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-md whitespace-nowrap">{res.time}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium mb-3 truncate">{res.cuisine}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-gray-100 pt-3">
                <span>📍</span>
                <span>{res.address}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FFFDF8] font-sans text-gray-800 relative">
      
      {/* MOBILE TOP NAVIGATION BAR */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40 flex items-center justify-between p-4 shadow-sm h-16">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative rounded-lg overflow-hidden border border-gray-100">
            <Image src="/logo.jpeg" alt="Vigo Feast Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">VIGO Feast</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="text-xl px-3 py-1 bg-gray-50 text-gray-700 rounded-xl border border-gray-200 focus:outline-none hover:bg-gray-100"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* MOBILE OVERLAY BACKDROP */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* RESPONSIVE SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 bg-white w-[260px] min-h-screen flex flex-col pt-6 lg:pt-8 border-r border-gray-200 z-50 
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-screen lg:sticky lg:top-0
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        
        <div className="px-6 mb-8 flex flex-col items-center text-center mt-2 lg:mt-0">
          <div className="w-20 h-20 lg:w-24 lg:h-24 mb-4 relative rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <Image src="/logo.jpeg" alt="Vigo Feast Logo" fill style={{ objectFit: 'contain' }} />
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">VIGO Feast</h1>
          <p className="text-[11px] text-teal-700 mt-1 uppercase tracking-widest font-bold border-b border-gray-100 pb-4 w-full text-center">
            Customer Module
          </p>
        </div>
        
        <nav className="flex flex-col gap-1 px-4 flex-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.name)}
              className={`text-left px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-3 select-none ${
                activeTab === item.name 
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                : 'text-gray-500 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              <span className={activeTab === item.name ? 'opacity-100' : 'opacity-60'}>{item.icon}</span>
              {item.name}
            </button>
          ))}
          <div className="mt-auto pb-6 pt-4 border-t border-gray-100">
            <button onClick={handleLogout} className="w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-bold transition-all text-red-600 hover:bg-red-50 select-none">
              <span>🚪</span> Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* MAIN AREA - Dynamic Padding for Mobile Header */}
      <main className="flex-1 p-4 pt-20 lg:p-10 overflow-y-auto min-h-screen">
        {activeTab === 'Dashboard' && renderDashboard()}
        
        {/* CART */}
        {activeTab === 'Cart' && (
          <div className="animate-in fade-in duration-300 max-w-4xl flex gap-6 flex-col lg:flex-row pb-10">
            <div className="flex-1 w-full">
              <div className="mb-6 lg:mb-8">
                <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Your Cart</h2>
                <p className="text-sm text-gray-500">Review your selected items from <span className="font-bold text-gray-800">The Pizzeria Hub</span>.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 lg:p-6 shadow-sm mb-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-2 h-full bg-teal-600"></div>
                 <h3 className="font-extrabold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-3">Delivery Details</h3>
                 <div className="flex items-start gap-4 mb-4">
                    <span className="text-xl">📍</span>
                    <div className="flex-1">
                       <p className="font-bold text-gray-900">Home</p>
                       <p className="text-sm text-gray-500 line-clamp-1">{location}</p>
                    </div>
                    <button className="text-sm font-bold text-orange-500">Change</button>
                 </div>
                 <div className="flex items-start gap-4 pt-4 border-t border-gray-100">
                    <span className="text-xl">⏱️</span>
                    <div>
                       <p className="font-bold text-gray-900">Fastest Delivery in 30 mins</p>
                       <p className="text-xs text-orange-500 font-bold mt-1">Gold Member Benefit Applied</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-6 w-full">
                <div className="p-4 lg:p-6">
                  {mockCart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row justify-between sm:items-center py-4 border-b border-gray-100 last:border-0 gap-4">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover border border-gray-100 shadow-sm flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-gray-500">₹{item.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1">
                           <button className="text-gray-500 hover:text-orange-500 font-bold px-3 py-1">-</button>
                           <span className="text-sm font-black text-gray-900">{item.qty}</span>
                           <button className="text-gray-500 hover:text-orange-500 font-bold px-3 py-1">+</button>
                        </div>
                        <span className="font-black text-gray-900 text-lg w-16 text-right">₹{item.price * item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between rounded-b-2xl">
                   <div className="flex items-center gap-3 cursor-pointer" onClick={() => setWantsCutlery(!wantsCutlery)}>
                      <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${wantsCutlery ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-gray-300'}`}>
                         {wantsCutlery && <span className="text-xs">✓</span>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">Add Cutlery 🍴</p>
                        <p className="text-[10px] md:text-xs text-gray-500 line-clamp-1">Help the environment by opting out</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-80 flex flex-col gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                 <h3 className="font-extrabold text-gray-900 mb-3 text-sm uppercase tracking-wider">Offers & Benefits</h3>
                 <div className="border border-dashed border-teal-500 bg-teal-50 rounded-xl p-3 flex items-center justify-between cursor-pointer mb-3 hover:bg-teal-100 transition-colors">
                    <div className="flex items-center gap-2">
                       <span className="text-lg">🏷️</span>
                       <span className="text-sm font-bold text-teal-800">Apply Coupon</span>
                    </div>
                    <span className="text-teal-700">→</span>
                 </div>
                 <div className="border border-orange-200 bg-orange-50 rounded-xl p-3 flex items-start gap-3">
                    <span className="text-lg mt-0.5">🏅</span>
                    <div>
                       <p className="text-sm font-bold text-orange-800">Gold Member Benefit</p>
                       <p className="text-xs text-orange-600 mt-0.5">Free delivery and priority support applied!</p>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <h3 className="font-extrabold text-gray-900 mb-4 text-lg border-b border-gray-100 pb-3">Bill Details</h3>
                 <div className="space-y-3 mb-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                       <span>Item Total</span>
                       <span className="font-bold text-gray-800">₹597</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                       <span>Delivery Fee</span>
                       <span className="font-bold text-orange-500">Free <span className="line-through text-gray-400 text-xs ml-1">₹45</span></span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                       <span>Taxes & Charges</span>
                       <span className="font-bold text-gray-800">₹30</span>
                    </div>
                 </div>
                 <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center mb-6">
                   <span className="text-lg font-bold text-gray-800">To Pay</span>
                   <span className="text-2xl font-black text-gray-900">₹627</span>
                 </div>
                 <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-colors text-lg">Proceed to Pay</button>
              </div>
            </div>
          </div>
        )}

        {/* MY ORDERS */}
        {activeTab === 'My Orders' && (
          <div className="animate-in fade-in duration-300 max-w-4xl">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Order History</h2>
              <p className="text-sm text-gray-500">View your past orders and their status.</p>
            </div>
            <div className="space-y-4">
              {mockOrders.map((order, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center hover:border-orange-300 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <img src={order.image} alt={order.restaurant} className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-gray-100 flex-shrink-0" />
                    <div className="flex-1 sm:hidden">
                       <span className="font-black text-gray-900 block text-lg">{order.restaurant}</span>
                       <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase inline-block mt-1 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1 hidden sm:block">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-black text-gray-900 text-lg line-clamp-1">{order.restaurant}</span>
                      <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase whitespace-nowrap ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 font-medium line-clamp-1">{order.items}</p>
                    <p className="text-xs text-gray-400">Order #{order.id} • {order.date}</p>
                  </div>

                  <div className="sm:hidden text-sm text-gray-600 font-medium">
                     <p className="line-clamp-1">{order.items}</p>
                     <p className="text-xs text-gray-400 mt-1">Order #{order.id} • {order.date}</p>
                  </div>

                  <div className="flex justify-between items-center sm:flex-col sm:items-end sm:pl-4 sm:border-l border-gray-100 mt-2 sm:mt-0 w-full sm:w-auto">
                    <span className="block font-black text-lg sm:text-xl text-gray-800 sm:mb-1">₹{order.total}</span>
                    <button className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-2 sm:py-1.5 rounded-lg hover:bg-teal-100 transition-colors group-hover:text-orange-600 group-hover:bg-orange-50">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TRACKING - EXACT GOOGLE MAPS REPLICA (NEW RIDER ICON) */}
{activeTab === 'Tracking' && (
   <div className="animate-in fade-in flex flex-col h-[calc(100vh-100px)]">
     <div className="mb-6">
       <h2 className="text-3xl font-extrabold text-gray-900">Track Order</h2>
       <p className="text-sm text-gray-500">Enter your Order ID to see live delivery status on the map.</p>
     </div>
     
     <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0 pb-6">
       {/* Left Panel: Order Info */}
       <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm w-full md:w-1/3 flex flex-col h-full overflow-y-auto">
         <input type="text" defaultValue="ORD-8821" className="w-full bg-[#FFFDF8] border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-teal-700 font-bold mb-4" />
         
         <div className="bg-gray-50 rounded-xl p-6 mb-auto border border-gray-100 relative">
            <div className="absolute left-[33px] top-10 bottom-10 w-0.5 bg-gray-200 z-0"></div>
            <div className="absolute left-[33px] top-10 h-1/2 w-0.5 bg-teal-500 z-0"></div>

            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div className="w-5 h-5 rounded-full bg-teal-500 border-[3px] border-white shadow flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Order Placed</p>
                <p className="text-xs text-gray-500">1:30 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div className="w-5 h-5 rounded-full bg-teal-500 border-[3px] border-white shadow flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Food Preparing</p>
                <p className="text-xs text-gray-500">1:45 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div className="w-5 h-5 rounded-full bg-teal-500 border-[3px] border-white shadow flex-shrink-0 mt-0.5 animate-pulse"></div>
              <div>
                <p className="text-sm font-bold text-gray-900 text-teal-700">Out for Delivery</p>
                <p className="text-xs font-bold text-orange-500">Arriving in approx. 15 mins</p>
              </div>
            </div>

            <div className="flex items-start gap-4 relative z-10 opacity-40">
              <div className="w-5 h-5 rounded-full bg-gray-300 border-[3px] border-white shadow flex-shrink-0 mt-0.5"></div>
              <div>
                <p className="text-sm font-bold text-gray-900">Delivered</p>
              </div>
            </div>
         </div>
         <button className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md mt-4 transition-colors">Contact Driver</button>
       </div>

       {/* Right Panel: Map & Custom Icons */}
       <div className="rounded-3xl w-full md:w-2/3 h-full relative border border-gray-200 shadow-sm overflow-hidden font-sans" style={{ backgroundColor: '#f3f4f6' }}>
         
         {/* Background SVG - Roads, Line, and Water */}
         <svg viewBox="0 0 1000 1000" className="absolute inset-0 w-full h-full z-0" preserveAspectRatio="none">
            {/* Water Bodies */}
            <path d="M 350 100 Q 400 50 450 100 T 400 200 Q 300 150 350 100 Z" fill="#bce1fd" />
            <path d="M 800 50 Q 850 20 900 70 T 850 170 Q 700 120 800 50 Z" fill="#bce1fd" />
            <path d="M 180 320 Q 240 320 240 390 T 160 440 Q 140 360 180 320 Z" fill="#bce1fd" />
            <path d="M 150 700 Q 200 680 230 750 T 200 850 Q 100 800 150 700 Z" fill="#bce1fd" />
            <path d="M 550 850 Q 600 800 650 850 T 600 950 Q 500 930 550 850 Z" fill="#bce1fd" />
            <path d="M 800 650 Q 850 600 900 650 T 850 780 Q 750 750 800 650 Z" fill="#bce1fd" />

            {/* Minor Roads (White) */}
            <path d="M -100 650 L 1100 650" fill="none" stroke="#ffffff" strokeWidth="16" vectorEffect="non-scaling-stroke" />
            <path d="M 300 -100 L 300 1100" fill="none" stroke="#ffffff" strokeWidth="16" vectorEffect="non-scaling-stroke" />
            <path d="M 500 -100 L 500 1100" fill="none" stroke="#ffffff" strokeWidth="16" vectorEffect="non-scaling-stroke" />
            <path d="M -100 450 L 400 450" fill="none" stroke="#ffffff" strokeWidth="16" vectorEffect="non-scaling-stroke" />
            <path d="M 750 200 L 750 1100" fill="none" stroke="#ffffff" strokeWidth="16" vectorEffect="non-scaling-stroke" />

            {/* Highway 44 */}
            <path d="M -100 400 L 480 410 L 700 420 L 1100 390" fill="none" stroke="#f0d57d" strokeWidth="20" vectorEffect="non-scaling-stroke" />
            <path d="M -100 400 L 480 410 L 700 420 L 1100 390" fill="none" stroke="#ffffff" strokeWidth="8" vectorEffect="non-scaling-stroke" />

            {/* Solid Blue Route Line */}
            <path d="M 250 450 L 300 450 L 300 650 L 500 650 L 500 415 L 700 420 L 750 350" fill="none" stroke="#2563eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
         </svg>

         {/* 1. RESTAURANT MARKER ("BURGER POINT") */}
         <div style={{ top: '45%', left: '25%', transform: 'translate(-50%, -50%)' }} className="absolute z-20 flex flex-col items-center">
            {/* White Burger Box */}
            <div style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb' }} className="w-10 h-10 rounded-xl shadow-md border flex items-center justify-center text-xl mb-1 z-10">
                🍔
            </div>
            {/* Burger Point Label */}
            <div style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#1f2937' }} className="px-2 py-1 rounded shadow-sm text-[10px] font-black tracking-wider border uppercase">
                Burger Point
            </div>
         </div>

         {/* 2. RIDER MARKER (Clear "Bike + Rider" Icon) */}
         <div style={{ top: '58%', left: '30%', transform: 'translate(-50%, -50%)' }} className="absolute z-30 flex flex-col items-center">
            {/* Teal Circle with Bike/Rider Icon */}
            <div style={{ backgroundColor: '#0f766e', borderColor: '#ffffff' }} className="w-10 h-10 rounded-full shadow-lg border-2 flex items-center justify-center relative z-10 mb-1">
                {/* NEW Clear "Bike with Rider" SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ef4444" className="w-6 h-6">
                  <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4-.8-.8c-1.3 1.3-3 2.1-4.9 2.1v2c2.5 0 4.7-1 6.3-2.6l1.3 1.3v4.4h2V10h-2.5l-1.5-1.5c-.3-.3-.7-.5-1.1-.5H10.6l-1.3-1.6 1.5-1.5zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/>
                </svg>
            </div>
            {/* 15 min Pill */}
            <div style={{ backgroundColor: '#0f766e', color: '#ffffff' }} className="px-3 py-1 rounded-full shadow-md text-[10px] font-bold tracking-wide">
                15 min
            </div>
         </div>

         {/* 3. HOME MARKER ("HOME") */}
         <div style={{ top: '35%', left: '75%', transform: 'translate(-50%, -50%)' }} className="absolute z-20 flex flex-col items-center">
            {/* Orange Circle with Home Icon */}
            <div style={{ backgroundColor: '#f97316', borderColor: '#ffffff' }} className="w-9 h-9 rounded-full shadow-md border-2 flex items-center justify-center mb-1 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ffffff" className="w-4 h-4">
                  <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.06 1.06l8.69-8.689Z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                </svg>
            </div>
            {/* HOME Label */}
            <div style={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#1f2937' }} className="px-3 py-1 rounded shadow-sm text-[10px] font-black tracking-wide border uppercase">
                Home
            </div>
         </div>

         {/* Map Expand Control (Opposing Arrows) */}
         <button className="absolute top-4 right-4 bg-white rounded-full shadow-md w-11 h-11 flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors z-20 border border-gray-100">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
               <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            </svg>
         </button>
       </div>
       
     </div>
   </div>
)}

        {/* OFFERS */}
        {activeTab === 'Offers' && (
           <div className="animate-in fade-in duration-300 max-w-4xl">
             <div className="mb-6 lg:mb-8">
               <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Exclusive Offers</h2>
               <p className="text-sm text-gray-500">Apply these promo codes at checkout.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {mockOffers.map((offer) => (
                  <div key={offer.id} className="bg-white border-2 border-dashed border-orange-200 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col justify-between hover:border-orange-400 transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-orange-50 rounded-bl-full -mr-4 -mt-4 z-0 group-hover:scale-110 transition-transform"></div>
                    <div className="relative z-10">
                      <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 font-black tracking-widest uppercase rounded-md text-[10px] lg:text-sm mb-3 border border-orange-200">{offer.code}</span>
                      <p className="font-bold text-gray-800 text-base lg:text-lg leading-tight mb-4">{offer.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 relative z-10">
                      <span className="text-[10px] lg:text-xs text-gray-400 font-bold uppercase">{offer.validTill}</span>
                      <button className="text-teal-700 font-black text-xs lg:text-sm hover:text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg">Copy Code</button>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}
        
        {/* PROFILE */}
        {activeTab === 'Profile' && (
          <div className="animate-in fade-in duration-300 max-w-4xl pb-10">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Customer Profile</h2>
              <p className="text-sm text-gray-500 mt-1">Manage your personal information and delivery settings.</p>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6 lg:mb-8">
              <div className="p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 items-center md:items-start border-b border-gray-100">
                <div className="relative group cursor-pointer flex-shrink-0">
                  <img src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=Customer&backgroundColor=f97316" alt="Profile" className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-lg bg-orange-100" />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs lg:text-sm font-bold">Edit Photo</span>
                  </div>
                </div>
                
                <div className="flex-1 w-full text-center md:text-left">
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 mb-1">{customerName}</h3>
                  <p className="text-xs lg:text-sm text-gray-500 mb-6">Foodie Level: <span className="text-orange-500 font-bold bg-orange-50 px-2 py-1 rounded-md ml-1">Gold 🏅</span></p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 lg:gap-y-6 text-left">
                    <div>
                      <label className="block text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 lg:mb-2">Customer ID</label>
                      <input type="text" defaultValue="CUST-90812" readOnly className="w-full bg-gray-50 border border-gray-200 text-gray-600 font-medium rounded-lg px-3 lg:px-4 py-2 outline-none cursor-not-allowed text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">Full Name</label>
                      <input type="text" defaultValue={customerName} className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-3 lg:px-4 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">Email Address</label>
                      <input type="email" defaultValue="customer@vigofeast.com" className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-3 lg:px-4 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] lg:text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 lg:mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full bg-[#FFFDF8] border border-gray-300 text-gray-900 font-semibold rounded-lg px-3 lg:px-4 py-2 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 lg:p-6 bg-gray-50 flex justify-end gap-3 lg:gap-4">
                <button className="px-4 lg:px-6 py-2 bg-white border border-gray-300 text-gray-700 text-xs lg:text-sm font-bold rounded-xl hover:bg-gray-100 transition-all shadow-sm">Cancel</button>
                <button className="px-6 lg:px-8 py-2 bg-orange-500 text-white text-xs lg:text-sm font-bold rounded-xl hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20">Save</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}