"use client";

import { useState } from "react";
import Link from "next/link";

export default function RestaurantsPage() {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:8001";

  const handleSearch = async (e) => {
    e.preventDefault();

    const requestedCity = city.trim();

    if (!requestedCity) {
      setMessage("Please enter your city.");
      setRestaurants([]);
      return;
    }

    setLoading(true);
    setMessage("");
    setRestaurants([]);

    try {
      const response = await fetch(
        `${API_URL}/customers/restaurants`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: requestedCity,
          }),
        }
      );

      const data = await response.json();

      console.log("Restaurant API response:", data);

      if (!response.ok) {
        let errorMessage = "Restaurant search failed.";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) => item.msg || "Invalid request.")
            .join(", ");
        }

        setMessage(errorMessage);
        return;
      }

      const restaurantList = Array.isArray(data.restaurants)
        ? data.restaurants
        : [];

      setRestaurants(restaurantList);

      if (restaurantList.length === 0) {
        setMessage(
          `No restaurants are currently available for ${requestedCity}.`
        );
      }
    } catch (error) {
      console.error("Restaurant search error:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();

    const logoutPath =
      process.env.NEXT_PUBLIC_LOGOUT_REDIRECT_PATH || "/";

    window.location.href = logoutPath;
  };

  return (
    <div className="customer-dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-logo">VF</div>

          <div>
            <h2>VIGO FEAST</h2>
            <span>Customer</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <Link href="/" className="nav-item">
            <span>⌂</span>
            <span>Dashboard</span>
          </Link>

          <button
            type="button"
            className="nav-item active"
          >
            <span>🍴</span>
            <span>Restaurants</span>
          </button>

          <Link href="/location" className="nav-item">
            <span>📍</span>
            <span>Location</span>
          </Link>

          <Link href="/cart" className="nav-item">
            <span>🛒</span>
            <span>Cart</span>
          </Link>

          <Link href="/orders" className="nav-item">
            <span>📦</span>
            <span>My Orders</span>
          </Link>

          <Link href="/tracking" className="nav-item">
            <span>🚚</span>
            <span>Tracking</span>
          </Link>

          <Link href="/offers" className="nav-item">
            <span>🎁</span>
            <span>Offers</span>
          </Link>

          <Link href="/profile" className="nav-item">
            <span>👤</span>
            <span>Profile</span>
          </Link>

        </nav>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          <span>Logout</span>
        </button>

      </aside>

      {/* ================= MAIN ================= */}

      <main className="dashboard-main">

        {/* ================= HEADER ================= */}

        <header className="dashboard-header">

          <div className="header-content">

            <p className="welcome-label">
              VIGO FEAST
            </p>

            <h1>Restaurants</h1>

            <p className="header-subtitle">
              Discover restaurants available for ordering.
            </p>

          </div>

          <Link
            href="/location"
            className="location-button"
          >
            <span className="location-icon">📍</span>

            <div>
              <small>Deliver to</small>
              <strong>Select your location</strong>
            </div>

          </Link>

        </header>

        {/* ================= SEARCH ================= */}

        <section className="restaurant-search-panel">

          <div>

            <p className="section-label">
              RESTAURANT DISCOVERY
            </p>

            <h2>Find Restaurants</h2>

            <p className="search-description">
              Search restaurants based on your city.
            </p>

          </div>

          <form
            className="restaurant-search-form"
            onSubmit={handleSearch}
          >

            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="restaurant-city-input"
              required
            />

            <button
              type="submit"
              className="primary-action search-button"
              disabled={loading}
            >
              {loading
                ? "Loading..."
                : "Search Restaurants"}
            </button>

          </form>

        </section>

        {/* ================= MESSAGE ================= */}

        {message && (
          <div className="restaurant-message">
            {message}
          </div>
        )}

        {/* ================= RESTAURANTS ================= */}

        <section className="content-section">

          <div className="section-heading">

            <div>

              <p className="section-label">
                DISCOVER
              </p>

              <h2>
                Available Restaurants
              </h2>

            </div>

            <span className="result-count">
              {restaurants.length} available
            </span>

          </div>

          {restaurants.length > 0 ? (

            <div className="restaurant-results-grid">

              {restaurants.map((restaurant) => {

                const restaurantId =
                  restaurant.id;

                const restaurantName =
                  restaurant.name ||
                  "Restaurant";

                const restaurantAddress =
                  restaurant.address ||
                  "Location details available";

                const restaurantImage =
                  restaurant.cover_image_url ||
                  restaurant.logo_url;

                return (

                  <article
                    className="restaurant-result-card"
                    key={restaurantId}
                  >

                    {/* IMAGE */}

                    <div className="restaurant-image-area">

                      {restaurantImage ? (

                        <img
                          src={restaurantImage}
                          alt={restaurantName}
                          className="restaurant-image"
                        />

                      ) : (

                        <div className="restaurant-image-placeholder">
                          <span>🍽️</span>
                        </div>

                      )}

                    </div>

                    {/* INFORMATION */}

                    <div className="restaurant-result-content">

                      <div className="restaurant-title-row">

                        <h3>
                          {restaurantName}
                        </h3>

                        {restaurant.status && (
                          <span className="restaurant-status">
                            {restaurant.status}
                          </span>
                        )}

                      </div>

                      <p className="restaurant-address">
                        {restaurantAddress}
                      </p>

                      <div className="restaurant-card-footer">

                        <span className="restaurant-location">
                          📍 {city || "VIGO FEAST"}
                        </span>

                        <Link
                          href={`/restaurants/${restaurantId}`}
                          className="restaurant-view-button"
                        >
                          View Restaurant →
                        </Link>

                      </div>

                    </div>

                  </article>

                );
              })}

            </div>

          ) : (

            !loading && (

              <div className="empty-restaurant-state">

                <div className="empty-state-icon">
                  🍴
                </div>

                <h3>
                  No Restaurants Available
                </h3>

                <p>
                  Search using your city to see
                  available restaurants.
                </p>

              </div>

            )

          )}

        </section>

        {/* ================= BACK ================= */}

        <div className="page-bottom-actions">

          <Link
            href="/"
            className="secondary-page-button"
          >
            ← Back to Dashboard
          </Link>

        </div>

      </main>

    </div>
  );
}