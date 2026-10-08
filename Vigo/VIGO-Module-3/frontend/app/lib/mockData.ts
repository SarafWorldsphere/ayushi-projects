// app/lib/mockData.ts

// --- TOP HALF: REQUIRED BY PAGE.TSX AND SIDEBAR.TSX ---
export const sidebarModules = [
  { id: "3.1", title: "Delivery Partner Login", path: "/login" },
  { id: "3.2", title: "Registration & Profile", path: "/profile" },
  { id: "3.3", title: "Order Assignment", path: "/" },
  { id: "3.4", title: "Pickup & Delivery Status", path: "/status" },
  { id: "3.5", title: "Live Delivery Tracking", path: "/tracking" },
  { id: "3.6", title: "Delivery History & Earnings", path: "/history" },
];

export const riderProfile = {
  name: "Ayushi Gupta",
  code: "RIDER-001",
  phone: "+91 98765 43210",
  vehicle: "Honda Activa • GJ-05-XX-9999",
  rating: 4.9,
  deliveries: 342,
  status: "Available"
};

export const assignedOrders = [
  { id: 'VF-10231', fee: 70, restaurant: 'New Swad Restaurant', customer: 'Keanu Reeves', status: 'Assigned', time: '10 mins ago' },
  { id: 'VF-10230', fee: 65, restaurant: 'Spice Garden', customer: 'Carrie-Anne Moss', status: 'Assigned', time: '15 mins ago' },
  { id: 'VF-10229', fee: 80, restaurant: 'Urban Grill', customer: 'Laurence Fishburne', status: 'Assigned', time: '22 mins ago' },
  { id: 'VF-10228', fee: 60, restaurant: 'Bistro 99', customer: 'Hugo Weaving', status: 'Assigned', time: '28 mins ago' },
];

export const routeSteps = [
  { step: "Pickup", location: "New Swad Restaurant", time: "14:05", completed: true },
  { step: "On the way", location: "Ring Road Express", time: "14:15", completed: true },
  { step: "Dropoff", location: "Keanu Reeves, Matrix Ave", time: "Est. 14:25", completed: false },
];

// --- BOTTOM HALF: REQUIRED BY [...SLUG]/PAGE.TSX ---
export const mockDataContent = {
  "/profile": {
    title: "Registration & Profile",
    module: "Module 3.2",
    stats: [
      { label: "Full Name", value: "Ayushi Gupta", highlight: false },
      { label: "Rider ID", value: "RIDER-001", highlight: false },
      { label: "Vehicle", value: "Honda Activa • GJ-05-XX-9999", highlight: false },
      { label: "Background Check", value: "Cleared & Verified", highlight: true }
    ],
    list: [
      { id: "Doc 1", title: "Driving License", subtitle: "Valid until 2030", amount: "Verified", status: "Done" },
      { id: "Doc 2", title: "Aadhar Card", subtitle: "Identity Verification", amount: "Verified", status: "Done" },
      { id: "Doc 3", title: "Bank Details", subtitle: "For daily payouts", amount: "Pending", status: "Pending" }
    ]
  },
  "/history": {
    title: "Delivery History & Earnings",
    module: "Module 3.6",
    stats: [
      { label: "Today's Earnings", value: "₹450", highlight: true },
      { label: "Completed Deliveries", value: "6", highlight: false },
      { label: "Customer Rating", value: "4.9 / 5.0", highlight: false }
    ],
    list: [
      { id: "VF-10150", title: "New Swad Restaurant", subtitle: "Chicken Handi, Veg Spring Rolls", amount: "₹120", status: "Delivered" },
      { id: "VF-10149", title: "Domino's Pizza", subtitle: "Margherita Pizza, Beverage", amount: "₹85", status: "Delivered" },
      { id: "VF-10148", title: "Healthy Bites", subtitle: "Tata Sampann Walnuts & Almonds", amount: "₹65", status: "Delivered" }
    ]
  },
  "/status": {
    title: "Pickup & Delivery Status",
    module: "Module 3.4",
    stats: [
      { label: "Current Status", value: "At Restaurant", highlight: true },
      { label: "Active Order ID", value: "VF-10231", highlight: false }
    ],
    list: [
      { id: "Step 1", title: "Arrived at New Swad Restaurant", subtitle: "Waiting for food preparation", amount: "14:10", status: "Done" },
      { id: "Step 2", title: "Pickup Order", subtitle: "Chicken Handi, Cheese Chowmein", amount: "14:15", status: "Pending" }
    ]
  },
  "/tracking": {
    title: "Live Delivery Tracking",
    module: "Module 3.5",
    stats: [
      { label: "GPS Status", value: "Active & Broadcasting", highlight: true },
      { label: "ETA to Customer", value: "10 Minutes", highlight: false },
      { label: "Traffic Condition", value: "Light", highlight: false }
    ],
    list: [
      { id: "Ping 1", title: "Location Updated", subtitle: "Lat: 28.7041, Lng: 77.1025", amount: "14:12", status: "Done" },
      { id: "Ping 2", title: "Route Optimized", subtitle: "Avoiding high traffic zone", amount: "14:10", status: "Done" },
      { id: "Ping 3", title: "Battery Status", subtitle: "Device at 85%", amount: "Good", status: "Done" }
    ]
  }
}; // <-- This closing brace and semicolon were missing