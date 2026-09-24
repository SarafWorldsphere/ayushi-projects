"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001";

export default function RestaurantDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params?.id;

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!restaurantId) return;

    const loadRestaurant = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_BASE}/customers/restaurant/details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          let errorMessage = "Unable to load restaurant details.";

          if (typeof data?.detail === "string") {
            errorMessage = data.detail;
          } else if (Array.isArray(data?.detail)) {
            errorMessage = data.detail
              .map((item) => item.msg || "Invalid request.")
              .join(", ");
          }

          throw new Error(errorMessage);
        }

        setRestaurant(data.restaurant || data);
      } catch (err) {
        console.error("Restaurant details error:", err);
        setError(
          err.message || "Unable to connect to backend."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [restaurantId]);

  if (loading) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>Restaurant / Hotel Details</h1>
          <p>Loading restaurant details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>Restaurant / Hotel Details</h1>

          <p>{error}</p>

          <button
            type="button"
            onClick={() => router.push("/restaurants")}
          >
            Back to Restaurants
          </button>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="login-page">
        <div className="login-card">
          <h1>Restaurant / Hotel Details</h1>

          <p>Restaurant details are not available.</p>

          <button
            type="button"
            onClick={() => router.push("/restaurants")}
          >
            Back to Restaurants
          </button>
        </div>
      </main>
    );
  }

  const image =
    restaurant.cover_image_url ||
    restaurant.logo_url ||
    null;

  return (
    <main className="restaurant-details-page">
      <div className="restaurant-details-container">

        {/* Back */}
        <button
          type="button"
          className="back-button"
          onClick={() => router.push("/restaurants")}
        >
          ← Back to Restaurants
        </button>

        {/* Restaurant Image */}
        <div className="restaurant-details-image">
          {image ? (
            <img
              src={image}
              alt={restaurant.name || "Restaurant"}
            />
          ) : (
            <div className="restaurant-image-placeholder">
              🍽️
            </div>
          )}
        </div>

        {/* Restaurant Information */}
        <div className="restaurant-details-card">
          <p className="section-label">
            RESTAURANT / HOTEL
          </p>

          <h1>
            {restaurant.name || "Restaurant"}
          </h1>

          {restaurant.description && (
            <p className="restaurant-description">
              {restaurant.description}
            </p>
          )}

          {restaurant.address && (
            <div className="restaurant-detail-row">
              <strong>Address</strong>
              <span>{restaurant.address}</span>
            </div>
          )}

          {restaurant.phone && (
            <div className="restaurant-detail-row">
              <strong>Phone</strong>
              <span>{restaurant.phone}</span>
            </div>
          )}

          {restaurant.email && (
            <div className="restaurant-detail-row">
              <strong>Email</strong>
              <span>{restaurant.email}</span>
            </div>
          )}

          {restaurant.status && (
            <div className="restaurant-detail-row">
              <strong>Status</strong>
              <span>{restaurant.status}</span>
            </div>
          )}

          <div className="restaurant-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() =>
                router.push(
                  `/restaurants/${restaurantId}/menu`
                )
              }
            >
              View Menu
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}