"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function DashboardPage() {
  const pathname = usePathname();

  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [tracking, setTracking] = useState(null);

  const [cartCount, setCartCount] = useState(0);

  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [trackingLoading, setTrackingLoading] = useState(true);

  const [restaurantError, setRestaurantError] = useState("");
  const [ordersError, setOrdersError] = useState("");
  const [trackingError, setTrackingError] = useState("");

  useEffect(() => {
    const savedCity = localStorage.getItem("customer_city") || "";

    setCity(savedCity);

    loadCartCount();
    loadRestaurants(savedCity);
    loadOrders();
    loadTracking();
    loadOffers();

    window.addEventListener("storage", loadCartCount);

    return () => {
      window.removeEventListener("storage", loadCartCount);
    };
  }, []);

  /* =========================================================
     CART COUNT
  ========================================================= */

  function loadCartCount() {
    try {
      let count = 0;

      Object.keys(localStorage).forEach((key) => {
        if (!key.startsWith("customer_cart_")) {
          return;
        }

        const savedCart = localStorage.getItem(key);

        if (!savedCart) {
          return;
        }

        try {
          const cart = JSON.parse(savedCart);

          if (Array.isArray(cart)) {
            cart.forEach((item) => {
              count += Number(item?.quantity || 0);
            });
          }
        } catch {
          // Ignore invalid local cart data.
        }
      });

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }

  /* =========================================================
     RESTAURANTS
  ========================================================= */

  async function loadRestaurants(selectedCity) {
    setRestaurantLoading(true);
    setRestaurantError("");

    try {
      const response = await fetch(
        `${API_BASE}/customers/restaurants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: selectedCity || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Restaurant API returned ${response.status}`
        );
      }

      const data = await response.json();

      const result =
        data?.restaurants ??
        data?.data ??
        data?.results ??
        [];

      setRestaurants(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.warn("Restaurant API unavailable:", error);
      setRestaurants([]);
      setRestaurantError(
        "Restaurant information is currently unavailable."
      );
    } finally {
      setRestaurantLoading(false);
    }
  }

  /* =========================================================
     ORDERS
  ========================================================= */

  async function loadOrders() {
    setOrdersLoading(true);
    setOrdersError("");

    try {
      const customerId =
        localStorage.getItem("customer_id");

      if (!customerId) {
        setOrders([]);
        return;
      }

      const response = await fetch(
        `${API_BASE}/orders/history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Orders API returned ${response.status}`
        );
      }

      const data = await response.json();

      const result =
        data?.orders ??
        data?.data ??
        data?.results ??
        [];

      setOrders(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.warn("Orders API unavailable:", error);
      setOrders([]);
      setOrdersError(
        "Order information is currently unavailable."
      );
    } finally {
      setOrdersLoading(false);
    }
  }

  /* =========================================================
     TRACKING
  ========================================================= */

  async function loadTracking() {
    setTrackingLoading(true);
    setTrackingError("");

    try {
      const customerId =
        localStorage.getItem("customer_id");

      const orderId =
        localStorage.getItem("tracking_order_id");

      if (!customerId || !orderId) {
        setTracking(null);
        return;
      }

      const response = await fetch(
        `${API_BASE}/tracking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            order_id: Number(orderId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Tracking API returned ${response.status}`
        );
      }

      const data = await response.json();

      setTracking(
        data?.tracking ??
        data?.data ??
        data ??
        null
      );
    } catch (error) {
      console.warn("Tracking API unavailable:", error);
      setTracking(null);
      setTrackingError(
        "Tracking information is currently unavailable."
      );
    } finally {
      setTrackingLoading(false);
    }
  }

  /* =========================================================
     OFFERS
  ========================================================= */

  async function loadOffers() {
    try {
      const response = await fetch(
        `${API_BASE}/offers/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) {
        setOffers([]);
        return;
      }

      const data = await response.json();

      const result =
        data?.offers ??
        data?.data ??
        data?.results ??
        [];

      setOffers(
        Array.isArray(result) ? result : []
      );
    } catch (error) {
      console.warn("Offers API unavailable:", error);
      setOffers([]);
    }
  }

  /* =========================================================
     HELPERS
  ========================================================= */

  function restaurantId(item) {
    return (
      item?.restaurant_id ??
      item?.hotel_id ??
      item?.id ??
      null
    );
  }

  function restaurantName(item) {
    return (
      item?.restaurant_name ??
      item?.hotel_name ??
      item?.name ??
      "Restaurant"
    );
  }

  function restaurantCuisine(item) {
    return (
      item?.cuisine ??
      item?.category ??
      item?.food_type ??
      "Food"
    );
  }

  function restaurantRating(item) {
    return (
      item?.rating ??
      item?.average_rating ??
      null
    );
  }

  function restaurantTime(item) {
    return (
      item?.delivery_time ??
      item?.estimated_delivery_time ??
      null
    );
  }

  function restaurantImage(item) {
    return (
      item?.image_url ??
      item?.image ??
      item?.photo_url ??
      item?.restaurant_image ??
      item?.hotel_image ??
      null
    );
  }

  function orderId(item) {
    return (
      item?.order_id ??
      item?.id ??
      null
    );
  }

  function orderStatus(item) {
    return (
      item?.order_status ??
      item?.status ??
      null
    );
  }

  function orderAmount(item) {
    return (
      item?.total_amount ??
      item?.amount ??
      null
    );
  }

  function orderHotel(item) {
    return (
      item?.hotel_name ??
      item?.restaurant_name ??
      item?.restaurant ??
      "Restaurant"
    );
  }

  function formatStatus(status) {
    if (!status) {
      return "Status unavailable";
    }

    return String(status)
      .replaceAll("_", " ")
      .replace(
        /\w\S*/g,
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      );
  }

  function isActive(path) {
    if (path === "/dashboard") {
      return pathname === "/dashboard";
    }

    return (
      pathname === path ||
      pathname.startsWith(`${path}/`)
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="dashboard-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">
            NF
          </div>

          <div className="brand-text">
            <h1>NFDS</h1>
            <p>Customer Module</p>
          </div>
        </div>

        <nav className="navigation">

          <div className="nav-label">
            MAIN
          </div>

          <Link
            href="/dashboard"
            className={`nav-link ${
              isActive("/dashboard")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </Link>

          <Link
            href="/location"
            className={`nav-link ${
              isActive("/location")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">⌖</span>
            <span>Location</span>
          </Link>

          <Link
            href="/restaurants"
            className={`nav-link ${
              isActive("/restaurants")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">☷</span>
            <span>Restaurants</span>
          </Link>

          <Link
            href="/cart"
            className={`nav-link ${
              isActive("/cart")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">🛒</span>
            <span>Cart</span>

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>

          <Link
            href="/orders"
            className={`nav-link ${
              isActive("/orders")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">▤</span>
            <span>My Orders</span>
          </Link>

          <div className="nav-divider" />

          <div className="nav-label">
            SERVICES
          </div>

          <Link
            href="/tracking"
            className={`nav-link ${
              isActive("/tracking")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">◉</span>
            <span>Order Tracking</span>
          </Link>

          <Link
            href="/offers"
            className={`nav-link ${
              isActive("/offers")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">◇</span>
            <span>Offers & Rewards</span>
          </Link>

          <Link
            href="/feedback"
            className={`nav-link ${
              isActive("/feedback")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">★</span>
            <span>Feedback</span>
          </Link>

          <div className="nav-divider" />

          <div className="nav-label">
            ACCOUNT
          </div>

          <Link
            href="/profile"
            className={`nav-link ${
              isActive("/profile")
                ? "active"
                : ""
            }`}
          >
            <span className="nav-icon">○</span>
            <span>Profile & Addresses</span>
          </Link>

        </nav>

        <div className="sidebar-footer">

          <Link
            href="/profile"
            className="account-mini"
          >
            <div className="account-avatar">
              C
            </div>

            <div className="account-info">
              <strong>Customer</strong>
              <small>Customer Account</small>
            </div>
          </Link>

          <Link
            href="/"
            className="logout-link"
          >
            <span className="logout-icon">
              ↪
            </span>

            <span>Logout</span>
          </Link>

        </div>
      </aside>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main-content">

        <header className="topbar">

          <div className="topbar-title">
            <h2>Dashboard</h2>
            <p>
              Customer food ordering experience
            </p>
          </div>

          <div className="topbar-actions">

            <Link
              href="/location"
              className="location-chip"
            >
              <span className="green-dot">
                ●
              </span>

              <span>
                {city || "Location not selected"}
              </span>

              <span>⌄</span>
            </Link>

            <Link
              href="/profile"
              className="customer-chip"
            >
              <div className="account-avatar small">
                C
              </div>

              <div>
                <strong>Customer</strong>
                <small>Customer</small>
              </div>

              <span>⌄</span>
            </Link>

          </div>
        </header>

        <div className="page-content">

          {/* =================================================
              WELCOME
          ================================================= */}

          <section className="welcome">

            <div>
              <span className="eyebrow">
                CUSTOMER PORTAL
              </span>

              <h1>
                Welcome back, Customer
              </h1>

              <p>
                Discover restaurants, manage your
                orders and track your deliveries
                from one place.
              </p>
            </div>

            <div className="welcome-buttons">

              <Link
                href="/restaurants"
                className="primary-button"
              >
                Browse Restaurants
              </Link>

              <Link
                href="/orders"
                className="outline-button"
              >
                My Orders
              </Link>

            </div>

          </section>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <section className="summary">

            <Link
              href="/cart"
              className="summary-card"
            >
              <div className="summary-icon">
                🛒
              </div>

              <div>
                <span>Cart Items</span>
                <strong>{cartCount}</strong>
              </div>
            </Link>

            <Link
              href="/orders"
              className="summary-card"
            >
              <div className="summary-icon">
                ▤
              </div>

              <div>
                <span>Total Orders</span>
                <strong>
                  {orders.length}
                </strong>
              </div>
            </Link>

            <Link
              href="/offers"
              className="summary-card"
            >
              <div className="summary-icon">
                ◇
              </div>

              <div>
                <span>Offers</span>
                <strong>
                  {offers.length}
                </strong>
              </div>
            </Link>

            <Link
              href="/restaurants"
              className="summary-card"
            >
              <div className="summary-icon">
                ☷
              </div>

              <div>
                <span>Restaurants</span>
                <strong>
                  {restaurants.length}
                </strong>
              </div>
            </Link>

          </section>

          {/* =================================================
              RESTAURANTS
          ================================================= */}

          <section className="section">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  DISCOVER
                </span>

                <h2>
                  Restaurants near you
                </h2>

                <p>
                  {city
                    ? `Available restaurants in ${city}`
                    : "Select your location to discover restaurants"}
                </p>
              </div>

              <Link
                href="/restaurants"
                className="view-link"
              >
                View all →
              </Link>

            </div>

            {restaurantLoading ? (
              <div className="empty-card">
                <div className="loader" />
                <p>
                  Loading restaurants...
                </p>
              </div>
            ) : restaurants.length === 0 ? (
              <div className="empty-card">

                <div className="empty-icon">
                  ☷
                </div>

                <h3>
                  No restaurants available
                </h3>

                <p>
                  {restaurantError ||
                    "Restaurant information will appear here when provided by the backend."}
                </p>

                <Link
                  href="/location"
                  className="primary-button small"
                >
                  Choose Location
                </Link>

              </div>
            ) : (
              <div className="restaurant-grid">

                {restaurants
                  .slice(0, 6)
                  .map((restaurant, index) => {

                    const id =
                      restaurantId(restaurant);

                    const image =
                      restaurantImage(restaurant);

                    return (
                      <Link
                        key={
                          id ??
                          `restaurant-${index}`
                        }
                        href={
                          id
                            ? `/restaurants/${id}`
                            : "/restaurants"
                        }
                        className="restaurant-card"
                      >

                        <div className="restaurant-image">

                          {image ? (
                            <img
                              src={image}
                              alt={restaurantName(
                                restaurant
                              )}
                            />
                          ) : (
                            <div className="image-placeholder">
                              <span>Image not supplied by API</span>
                            </div>
                          )}

                        </div>

                        <div className="restaurant-body">

                          <h3>
                            {restaurantName(
                              restaurant
                            )}
                          </h3>

                          <p>
                            {restaurantCuisine(
                              restaurant
                            )}
                          </p>

                          <div className="restaurant-meta">

                            {restaurantRating(
                              restaurant
                            ) && (
                              <span>
                                ★{" "}
                                {restaurantRating(
                                  restaurant
                                )}
                              </span>
                            )}

                            {restaurantTime(
                              restaurant
                            ) && (
                              <span>
                                {restaurantTime(
                                  restaurant
                                )}
                              </span>
                            )}

                          </div>

                        </div>

                      </Link>
                    );
                  })}

              </div>
            )}

          </section>

          {/* =================================================
              ORDERS + TRACKING
          ================================================= */}

          <section className="two-column">

            <div className="panel">

              <div className="panel-heading">

                <div>
                  <span className="section-kicker">
                    ORDERS
                  </span>

                  <h2>
                    Recent orders
                  </h2>
                </div>

                <Link
                  href="/orders"
                  className="view-link"
                >
                  View all →
                </Link>

              </div>

              {ordersLoading ? (
                <div className="panel-empty">
                  Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="panel-empty">
                  <div className="empty-icon">
                    ▤
                  </div>

                  <strong>
                    No orders yet
                  </strong>

                  <p>
                    Your order history will
                    appear here.
                  </p>

                  <Link
                    href="/restaurants"
                    className="outline-button small"
                  >
                    Browse Restaurants
                  </Link>
                </div>
              ) : (
                <div className="order-list">

                  {orders
                    .slice(0, 5)
                    .map((order, index) => (

                      <Link
                        key={
                          orderId(order) ??
                          `order-${index}`
                        }
                        href={
                          orderId(order)
                            ? `/orders`
                            : "/orders"
                        }
                        className="order-row"
                      >

                        <div className="order-symbol">
                          ▤
                        </div>

                        <div className="order-info">

                          <strong>
                            {orderHotel(order)}
                          </strong>

                          <span>
                            {orderId(order)
                              ? `Order #${orderId(
                                  order
                                )}`
                              : "Order"}
                          </span>

                        </div>

                        <div className="order-right">

                          <strong>
                            {orderAmount(order) !=
                            null
                              ? `₹${Number(
                                  orderAmount(
                                    order
                                  )
                                ).toFixed(2)}`
                              : "Amount unavailable"}
                          </strong>

                          <span>
                            {formatStatus(
                              orderStatus(order)
                            )}
                          </span>

                        </div>

                      </Link>

                    ))}

                </div>
              )}

            </div>

            <div className="panel">

              <div className="panel-heading">

                <div>
                  <span className="section-kicker">
                    DELIVERY
                  </span>

                  <h2>
                    Order tracking
                  </h2>
                </div>

                <Link
                  href="/tracking"
                  className="view-link"
                >
                  Open →
                </Link>

              </div>

              {trackingLoading ? (
                <div className="panel-empty">
                  Loading tracking...
                </div>
              ) : tracking ? (

                <div className="tracking-card">

                  <div className="tracking-status">
                    <span className="status-dot" />

                    <div>
                      <strong>
                        {formatStatus(
                          tracking?.order_status ??
                          tracking?.status
                        )}
                      </strong>

                      <span>
                        Live delivery status
                      </span>
                    </div>
                  </div>

                  <div className="tracking-details">

                    <div>
                      <span>Rider</span>
                      <strong>
                        {tracking?.rider_id ??
                          "Not assigned"}
                      </strong>
                    </div>

                    <div>
                      <span>ETA</span>
                      <strong>
                        {tracking?.eta ??
                          "Not available"}
                      </strong>
                    </div>

                  </div>

                  <Link
                    href="/tracking"
                    className="primary-button full"
                  >
                    Track Order
                  </Link>

                </div>

              ) : (

                <div className="panel-empty">

                  <div className="empty-icon">
                    ◉
                  </div>

                  <strong>
                    No active delivery
                  </strong>

                  <p>
                    {trackingError ||
                      "Active order tracking will appear here."}
                  </p>

                  <Link
                    href="/orders"
                    className="outline-button small"
                  >
                    View Orders
                  </Link>

                </div>

              )}

            </div>

          </section>

          {/* =================================================
              OFFERS
          ================================================= */}

          <section className="section">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  REWARDS
                </span>

                <h2>
                  Offers & Rewards
                </h2>

                <p>
                  Available offers provided by the backend.
                </p>
              </div>

              <Link
                href="/offers"
                className="view-link"
              >
                View all →
              </Link>

            </div>

            {offers.length === 0 ? (

              <div className="offer-empty">

                <div className="offer-symbol">
                  ◇
                </div>

                <div>
                  <h3>
                    No offers currently available
                  </h3>

                  <p>
                    Offers will appear here when
                    available from the Customer Module backend.
                  </p>
                </div>

                <Link
                  href="/offers"
                  className="outline-button small"
                >
                  Open Offers
                </Link>

              </div>

            ) : (

              <div className="offer-grid">

                {offers
                  .slice(0, 3)
                  .map((offer, index) => (

                    <Link
                      href="/offers"
                      className="offer-card"
                      key={index}
                    >

                      <div className="offer-symbol">
                        ◇
                      </div>

                      <div>
                        <h3>
                          {offer?.title ??
                            offer?.name ??
                            "Available Offer"}
                        </h3>

                        <p>
                          {offer?.description ??
                            offer?.details ??
                            "Offer details available in Offers & Rewards."}
                        </p>
                      </div>

                    </Link>

                  ))}

              </div>

            )}

          </section>

          {/* =================================================
              CUSTOMER JOURNEY
          ================================================= */}

          <section className="section">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  CUSTOMER JOURNEY
                </span>

                <h2>
                  Your ordering journey
                </h2>

                <p>
                  Customer-facing services available
                  through the module.
                </p>
              </div>

            </div>

            <div className="journey">

              <Link
                href="/location"
                className="journey-step"
              >
                <span>01</span>
                <strong>Location</strong>
                <small>
                  Select delivery location
                </small>
              </Link>

              <Link
                href="/restaurants"
                className="journey-step"
              >
                <span>02</span>
                <strong>Restaurants</strong>
                <small>
                  Browse nearby restaurants
                </small>
              </Link>

              <Link
                href="/cart"
                className="journey-step"
              >
                <span>03</span>
                <strong>Cart</strong>
                <small>
                  Select menu items
                </small>
              </Link>

              <Link
                href="/checkout"
                className="journey-step"
              >
                <span>04</span>
                <strong>Checkout</strong>
                <small>
                  Confirm order details
                </small>
              </Link>

              <Link
                href="/payment"
                className="journey-step"
              >
                <span>05</span>
                <strong>Payment</strong>
                <small>
                  Complete payment
                </small>
              </Link>

              <Link
                href="/tracking"
                className="journey-step"
              >
                <span>06</span>
                <strong>Tracking</strong>
                <small>
                  Track delivery
                </small>
              </Link>

            </div>

          </section>

          {/* =================================================
              QUICK SERVICES
          ================================================= */}

          <section className="section">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  QUICK ACCESS
                </span>

                <h2>
                  Customer services
                </h2>
              </div>

            </div>

            <div className="quick-grid">

              <Link
                href="/restaurants"
                className="quick-card"
              >
                <div className="quick-icon">
                  ☷
                </div>

                <div>
                  <strong>
                    Browse Restaurants
                  </strong>

                  <span>
                    Explore restaurants and menus
                  </span>
                </div>

                <b>→</b>
              </Link>

              <Link
                href="/cart"
                className="quick-card"
              >
                <div className="quick-icon">
                  🛒
                </div>

                <div>
                  <strong>
                    Shopping Cart
                  </strong>

                  <span>
                    Review selected items
                  </span>
                </div>

                <b>→</b>
              </Link>

              <Link
                href="/orders"
                className="quick-card"
              >
                <div className="quick-icon">
                  ▤
                </div>

                <div>
                  <strong>
                    Order History
                  </strong>

                  <span>
                    View previous orders
                  </span>
                </div>

                <b>→</b>
              </Link>

              <Link
                href="/profile"
                className="quick-card"
              >
                <div className="quick-icon">
                  ○
                </div>

                <div>
                  <strong>
                    Profile & Addresses
                  </strong>

                  <span>
                    Manage customer information
                  </span>
                </div>

                <b>→</b>
              </Link>

            </div>

          </section>

          {/* =================================================
              INTEGRATIONS
          ================================================= */}

          <section className="section">

            <div className="section-heading">

              <div>
                <span className="section-kicker">
                  CONNECTED SERVICES
                </span>

                <h2>
                  Customer Module integrations
                </h2>

                <p>
                  Customer-facing information is
                  integrated with the appropriate services.
                </p>
              </div>

            </div>

            <div className="integration-grid">

              <div className="integration-card">
                <div className="integration-icon">
                  R
                </div>

                <div>
                  <strong>
                    Restaurant
                  </strong>

                  <span>
                    Restaurant and menu information
                  </span>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-icon">
                  D
                </div>

                <div>
                  <strong>
                    Delivery
                  </strong>

                  <span>
                    Rider and delivery tracking
                  </span>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-icon">
                  P
                </div>

                <div>
                  <strong>
                    Payment
                  </strong>

                  <span>
                    Approved payment integration
                  </span>
                </div>
              </div>

              <div className="integration-card">
                <div className="integration-icon">
                  M
                </div>

                <div>
                  <strong>
                    Management
                  </strong>

                  <span>
                    Authorized customer visibility
                  </span>
                </div>
              </div>

            </div>

          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="footer">

            <div>
              <strong>
                NFDS Customer Module
              </strong>

              <span>
                Customer-facing food ordering experience
              </span>
            </div>

            <div className="footer-status">
              <span>●</span>
              Customer Portal
            </div>

          </footer>

        </div>
      </main>

      {/* =====================================================
          STYLES
      ===================================================== */}

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .dashboard-shell {
          min-height: 100vh;
          background: #f7f9f8;
          color: #172b2a;
          font-family:
            Inter,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        /* ================= SIDEBAR ================= */

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;
          width: 250px;
          background: #ffffff;
          border-right: 1px solid #e5e9e8;

          display: flex;
          flex-direction: column;

          padding: 24px 16px 18px;

          z-index: 100;
          overflow-y: auto;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;

          padding: 0 10px 24px;

          border-bottom: 1px solid #edf0ef;
        }

        .brand-mark {
          width: 44px;
          height: 44px;

          border-radius: 12px;

          background: #087f67;
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 14px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .brand-text h1 {
          margin: 0;

          font-size: 20px;
          font-weight: 800;

          color: #172b2a;
        }

        .brand-text p {
          margin: 4px 0 0;

          font-size: 11px;
          color: #879492;
          font-weight: 500;
        }

        .navigation {
          margin-top: 26px;
        }

        .nav-label {
          margin: 0 12px 9px;

          color: #98a3a1;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1.2px;
        }

        .nav-link {
          width: 100%;
          min-height: 46px;

          margin-bottom: 5px;
          padding: 0 13px;

          border-radius: 10px;

          display: flex;
          align-items: center;

          gap: 13px;

          color: #526360;
          background: transparent;

          font-size: 13px;
          font-weight: 600;

          text-decoration: none;

          transition:
            background 0.18s ease,
            color 0.18s ease;
        }

        .nav-link:hover {
          background: #f0f8f5;
          color: #087f67;
        }

        .nav-link.active {
          background: #087f67;
          color: #ffffff;

          box-shadow:
            0 5px 14px
            rgba(8, 127, 103, 0.16);
        }

        .nav-icon {
          width: 24px;
          min-width: 24px;
          height: 24px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 17px;
          line-height: 1;
        }

        .cart-badge {
          margin-left: auto;

          width: 22px;
          height: 22px;

          border-radius: 50%;

          background: #087f67;
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 10px;
          font-weight: 700;
        }

        .nav-link.active .cart-badge {
          background: #ffffff;
          color: #087f67;
        }

        .nav-divider {
          height: 1px;

          background: #edf0ef;

          margin: 20px 10px;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 18px;
        }

        .account-mini {
          display: flex;
          align-items: center;
          gap: 11px;

          padding: 13px 10px;

          border-top: 1px solid #edf0ef;

          text-decoration: none;
        }

        .account-avatar {
          width: 38px;
          height: 38px;

          border-radius: 50%;

          background: #087f67;
          color: #ffffff;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 12px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .account-avatar.small {
          width: 34px;
          height: 34px;
        }

        .account-info {
          min-width: 0;
        }

        .account-info strong {
          display: block;

          color: #172b2a;

          font-size: 12px;
          font-weight: 700;
        }

        .account-info small {
          display: block;

          margin-top: 3px;

          color: #8a9795;

          font-size: 10px;
        }

        .logout-link {
          display: flex;
          align-items: center;
          gap: 11px;

          min-height: 40px;

          padding: 0 10px;

          color: #697774;

          font-size: 12px;
          font-weight: 600;

          text-decoration: none;

          border-radius: 9px;

          transition:
            background 0.18s ease,
            color 0.18s ease;
        }

        .logout-link:hover {
          background: #f5f7f6;
          color: #087f67;
        }

        .logout-icon {
          width: 24px;
          text-align: center;
          font-size: 17px;
        }

        /* ================= MAIN ================= */

        .main-content {
          margin-left: 250px;
          min-height: 100vh;
        }

        /* ================= TOPBAR ================= */

        .topbar {
          height: 74px;

          padding: 0 32px;

          background: rgba(255, 255, 255, 0.97);

          border-bottom: 1px solid #e5e9e8;

          display: flex;
          align-items: center;
          justify-content: space-between;

          position: sticky;
          top: 0;

          z-index: 50;
        }

        .topbar-title h2 {
          margin: 0;

          font-size: 19px;
          font-weight: 750;

          color: #172b2a;
        }

        .topbar-title p {
          margin: 4px 0 0;

          color: #8a9997;

          font-size: 11px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .location-chip,
        .customer-chip {
          border: 1px solid #dfe7e4;

          background: #ffffff;

          border-radius: 10px;

          text-decoration: none;
        }

        .location-chip {
          min-height: 40px;

          padding: 0 13px;

          display: flex;
          align-items: center;
          gap: 8px;

          color: #344b48;

          font-size: 12px;
          font-weight: 600;
        }

        .green-dot {
          color: #0a9b79;
          font-size: 9px;
        }

        .customer-chip {
          min-height: 44px;

          padding: 4px 10px 4px 5px;

          display: flex;
          align-items: center;
          gap: 8px;

          color: #172b2a;
        }

        .customer-chip strong {
          display: block;

          font-size: 11px;
        }

        .customer-chip small {
          display: block;

          margin-top: 2px;

          color: #8a9997;

          font-size: 9px;
        }

        /* ================= PAGE ================= */

        .page-content {
          max-width: 1500px;

          margin: 0 auto;

          padding: 30px 32px 44px;
        }

        /* ================= WELCOME ================= */

        .welcome {
          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 18px;

          padding: 30px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 25px;

          box-shadow:
            0 6px 25px
            rgba(25, 58, 52, 0.04);
        }

        .eyebrow,
        .section-kicker {
          display: block;

          color: #087f67;

          font-size: 10px;
          font-weight: 800;

          letter-spacing: 1.3px;
        }

        .welcome h1 {
          margin: 9px 0 8px;

          font-size: 28px;
          line-height: 1.2;

          color: #172b2a;
        }

        .welcome p {
          max-width: 600px;

          margin: 0;

          color: #71817e;

          font-size: 13px;
          line-height: 1.6;
        }

        .welcome-buttons {
          display: flex;
          gap: 10px;

          flex-shrink: 0;
        }

        .primary-button,
        .outline-button {
          min-height: 42px;

          padding: 0 17px;

          border-radius: 9px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          text-decoration: none;

          font-size: 12px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background 0.18s ease,
            color 0.18s ease,
            border-color 0.18s ease;
        }

        .primary-button {
          background: #087f67;
          color: #ffffff;
          border: 1px solid #087f67;
        }

        .primary-button:hover {
          background: #066c58;
          border-color: #066c58;
        }

        .outline-button {
          background: #ffffff;
          color: #087f67;
          border: 1px solid #cddbd7;
        }

        .outline-button:hover {
          background: #f0f8f5;
          border-color: #087f67;
        }

        .primary-button.small,
        .outline-button.small {
          min-height: 36px;
          padding: 0 13px;
          font-size: 11px;
        }

        .primary-button.full {
          width: 100%;
        }

        /* ================= SUMMARY ================= */

        .summary {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 14px;

          margin-top: 18px;
        }

        .summary-card {
          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 14px;

          padding: 19px;

          display: flex;
          align-items: center;

          gap: 13px;

          text-decoration: none;

          transition:
            transform 0.18s ease,
            border-color 0.18s ease;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          border-color: #b8d2ca;
        }

        .summary-icon {
          width: 42px;
          height: 42px;

          border-radius: 11px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;
        }

        .summary-card span {
          display: block;

          color: #84928f;

          font-size: 10px;
          font-weight: 600;
        }

        .summary-card strong {
          display: block;

          margin-top: 4px;

          color: #172b2a;

          font-size: 21px;
        }

        /* ================= SECTIONS ================= */

        .section {
          margin-top: 30px;
        }

        .section-heading,
        .panel-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 15px;

          margin-bottom: 15px;
        }

        .section-heading h2,
        .panel-heading h2 {
          margin: 5px 0 4px;

          color: #172b2a;

          font-size: 18px;
        }

        .section-heading p {
          margin: 0;

          color: #879492;

          font-size: 11px;
        }

        .view-link {
          color: #087f67;

          font-size: 11px;
          font-weight: 700;

          text-decoration: none;

          white-space: nowrap;
        }

        .view-link:hover {
          text-decoration: underline;
        }

        /* ================= RESTAURANTS ================= */

        .restaurant-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 16px;
        }

        .restaurant-card {
          overflow: hidden;

          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 15px;

          text-decoration: none;

          color: inherit;

          transition:
            transform 0.18s ease,
            box-shadow 0.18s ease;
        }

        .restaurant-card:hover {
          transform: translateY(-3px);

          box-shadow:
            0 12px 28px
            rgba(26, 60, 54, 0.08);
        }

        .restaurant-image {
          height: 170px;

          background: #eef3f1;
        }

        .restaurant-image img {
          width: 100%;
          height: 100%;

          object-fit: cover;

          display: block;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 20px;

          text-align: center;

          color: #9aa7a4;

          font-size: 11px;
        }

        .restaurant-body {
          padding: 16px;
        }

        .restaurant-body h3 {
          margin: 0;

          color: #172b2a;

          font-size: 14px;
        }

        .restaurant-body p {
          margin: 5px 0 12px;

          color: #899693;

          font-size: 11px;
        }

        .restaurant-meta {
          display: flex;
          align-items: center;
          gap: 12px;

          color: #647572;

          font-size: 10px;
          font-weight: 600;
        }

        /* ================= EMPTY ================= */

        .empty-card {
          min-height: 240px;

          background: #ffffff;

          border: 1px dashed #ccd9d5;

          border-radius: 15px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          padding: 30px;
        }

        .empty-icon {
          width: 48px;
          height: 48px;

          border-radius: 13px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 21px;

          margin-bottom: 12px;
        }

        .empty-card h3 {
          margin: 0;

          color: #344b48;

          font-size: 14px;
        }

        .empty-card p {
          max-width: 500px;

          margin: 7px 0 16px;

          color: #8a9997;

          font-size: 11px;
          line-height: 1.5;
        }

        .loader {
          width: 27px;
          height: 27px;

          border: 3px solid #e0ebe8;
          border-top-color: #087f67;

          border-radius: 50%;

          animation: spin 0.8s linear infinite;

          margin-bottom: 10px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================= TWO COLUMN ================= */

        .two-column {
          display: grid;

          grid-template-columns:
            minmax(0, 1.25fr)
            minmax(0, 0.75fr);

          gap: 16px;

          margin-top: 30px;
        }

        .panel {
          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 15px;

          padding: 20px;
        }

        .panel-heading {
          align-items: center;
        }

        .panel-empty {
          min-height: 210px;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;

          color: #879492;

          font-size: 11px;
        }

        .panel-empty strong {
          color: #344b48;
          font-size: 13px;
        }

        .panel-empty p {
          margin: 6px 0 14px;
        }

        /* ================= ORDERS ================= */

        .order-list {
          border-top: 1px solid #edf0ef;
        }

        .order-row {
          display: flex;
          align-items: center;

          gap: 12px;

          padding: 13px 0;

          border-bottom: 1px solid #edf0ef;

          text-decoration: none;
        }

        .order-symbol {
          width: 36px;
          height: 36px;

          border-radius: 9px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 15px;

          flex-shrink: 0;
        }

        .order-info {
          flex: 1;
          min-width: 0;
        }

        .order-info strong {
          display: block;

          color: #344b48;

          font-size: 12px;
        }

        .order-info span {
          display: block;

          margin-top: 3px;

          color: #909d9a;

          font-size: 10px;
        }

        .order-right {
          text-align: right;
        }

        .order-right strong {
          display: block;

          color: #344b48;

          font-size: 11px;
        }

        .order-right span {
          display: block;

          margin-top: 3px;

          color: #087f67;

          font-size: 9px;
          font-weight: 700;
        }

        /* ================= TRACKING ================= */

        .tracking-card {
          min-height: 210px;

          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .tracking-status {
          display: flex;
          align-items: center;
          gap: 11px;

          padding-bottom: 18px;

          border-bottom: 1px solid #edf0ef;
        }

        .status-dot {
          width: 11px;
          height: 11px;

          border-radius: 50%;

          background: #0a9b79;

          box-shadow:
            0 0 0 5px #e8f6f1;
        }

        .tracking-status strong {
          display: block;

          color: #344b48;

          font-size: 13px;
        }

        .tracking-status span:not(.status-dot) {
          display: block;

          margin-top: 3px;

          color: #8a9997;

          font-size: 10px;
        }

        .tracking-details {
          display: grid;

          grid-template-columns: 1fr 1fr;

          gap: 10px;

          padding: 17px 0;
        }

        .tracking-details div {
          background: #f7faf9;

          border-radius: 9px;

          padding: 11px;
        }

        .tracking-details span {
          display: block;

          color: #8b9996;

          font-size: 9px;
        }

        .tracking-details strong {
          display: block;

          margin-top: 4px;

          color: #344b48;

          font-size: 11px;
        }

        /* ================= OFFERS ================= */

        .offer-empty {
          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 15px;

          padding: 20px;

          display: flex;
          align-items: center;

          gap: 15px;
        }

        .offer-symbol {
          width: 44px;
          height: 44px;

          border-radius: 11px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 19px;

          flex-shrink: 0;
        }

        .offer-empty > div:nth-child(2) {
          flex: 1;
        }

        .offer-empty h3 {
          margin: 0;

          color: #344b48;

          font-size: 13px;
        }

        .offer-empty p {
          margin: 5px 0 0;

          color: #8a9997;

          font-size: 10px;
          line-height: 1.5;
        }

        .offer-grid {
          display: grid;

          grid-template-columns:
            repeat(3, minmax(0, 1fr));

          gap: 15px;
        }

        .offer-card {
          padding: 18px;

          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 14px;

          display: flex;
          gap: 13px;

          text-decoration: none;
        }

        .offer-card h3 {
          margin: 0;

          color: #344b48;

          font-size: 13px;
        }

        .offer-card p {
          margin: 5px 0 0;

          color: #8a9997;

          font-size: 10px;
          line-height: 1.5;
        }

        /* ================= JOURNEY ================= */

        .journey {
          display: grid;

          grid-template-columns:
            repeat(6, minmax(0, 1fr));

          gap: 10px;
        }

        .journey-step {
          min-height: 125px;

          padding: 16px;

          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 13px;

          text-decoration: none;

          transition:
            border-color 0.18s ease,
            transform 0.18s ease;
        }

        .journey-step:hover {
          border-color: #b7d1c9;
          transform: translateY(-2px);
        }

        .journey-step span {
          display: block;

          color: #087f67;

          font-size: 10px;
          font-weight: 800;
        }

        .journey-step strong {
          display: block;

          margin-top: 15px;

          color: #344b48;

          font-size: 12px;
        }

        .journey-step small {
          display: block;

          margin-top: 5px;

          color: #8a9997;

          font-size: 9px;
          line-height: 1.4;
        }

        /* ================= QUICK ================= */

        .quick-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 12px;
        }

        .quick-card {
          display: flex;
          align-items: center;

          gap: 13px;

          padding: 15px;

          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 13px;

          text-decoration: none;

          color: inherit;
        }

        .quick-card:hover {
          border-color: #b7d1c9;
        }

        .quick-icon {
          width: 40px;
          height: 40px;

          border-radius: 10px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 17px;

          flex-shrink: 0;
        }

        .quick-card div:nth-child(2) {
          flex: 1;
        }

        .quick-card strong {
          display: block;

          color: #344b48;

          font-size: 12px;
        }

        .quick-card span {
          display: block;

          margin-top: 3px;

          color: #8a9997;

          font-size: 10px;
        }

        .quick-card b {
          color: #087f67;

          font-size: 15px;
        }

        /* ================= INTEGRATIONS ================= */

        .integration-grid {
          display: grid;

          grid-template-columns:
            repeat(4, minmax(0, 1fr));

          gap: 12px;
        }

        .integration-card {
          display: flex;
          align-items: center;

          gap: 11px;

          padding: 15px;

          background: #ffffff;

          border: 1px solid #e4ebe8;

          border-radius: 13px;
        }

        .integration-icon {
          width: 36px;
          height: 36px;

          border-radius: 9px;

          background: #eef8f5;
          color: #087f67;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 12px;
          font-weight: 800;

          flex-shrink: 0;
        }

        .integration-card strong {
          display: block;

          color: #344b48;

          font-size: 11px;
        }

        .integration-card span {
          display: block;

          margin-top: 3px;

          color: #8a9997;

          font-size: 9px;
          line-height: 1.4;
        }

        /* ================= FOOTER ================= */

        .footer {
          margin-top: 36px;

          padding-top: 20px;

          border-top: 1px solid #e2e9e6;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 15px;
        }

        .footer strong {
          display: block;

          color: #344b48;

          font-size: 11px;
        }

        .footer span {
          display: block;

          margin-top: 3px;

          color: #8a9997;

          font-size: 9px;
        }

        .footer-status {
          display: flex;
          align-items: center;
          gap: 6px;

          color: #087f67;

          font-size: 10px;
          font-weight: 700;
        }

        .footer-status span {
          margin: 0;

          color: #0a9b79;
          font-size: 8px;
        }

        /* ================= RESPONSIVE ================= */

        @media (max-width: 1100px) {

          .restaurant-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .journey {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .integration-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        @media (max-width: 850px) {

          .sidebar {
            width: 220px;
          }

          .main-content {
            margin-left: 220px;
          }

          .topbar {
            padding: 0 20px;
          }

          .page-content {
            padding: 22px 20px 35px;
          }

          .summary {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .two-column {
            grid-template-columns: 1fr;
          }

          .welcome {
            align-items: flex-start;
            flex-direction: column;
          }

        }

        @media (max-width: 650px) {

          .sidebar {
            position: relative;

            width: 100%;
            height: auto;

            min-height: auto;

            border-right: none;
            border-bottom: 1px solid #e5e9e8;

            overflow: visible;
          }

          .navigation {
            margin-top: 18px;
          }

          .sidebar-footer {
            margin-top: 10px;
          }

          .main-content {
            margin-left: 0;
          }

          .topbar {
            height: auto;

            min-height: 70px;

            padding: 15px;

            gap: 12px;

            flex-wrap: wrap;
          }

          .topbar-actions {
            width: 100%;
          }

          .location-chip,
          .customer-chip {
            flex: 1;
          }

          .page-content {
            padding: 18px 14px 30px;
          }

          .summary {
            grid-template-columns: 1fr 1fr;
          }

          .restaurant-grid {
            grid-template-columns: 1fr;
          }

          .offer-grid {
            grid-template-columns: 1fr;
          }

          .journey {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .integration-grid {
            grid-template-columns: 1fr;
          }

          .quick-grid {
            grid-template-columns: 1fr;
          }

          .offer-empty {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .footer {
            align-items: flex-start;
            flex-direction: column;
          }

        }

        @media (max-width: 430px) {

          .summary {
            grid-template-columns: 1fr;
          }

          .journey {
            grid-template-columns: 1fr;
          }

          .welcome h1 {
            font-size: 23px;
          }

          .welcome-buttons {
            width: 100%;
            flex-direction: column;
          }

          .primary-button,
          .outline-button {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
}