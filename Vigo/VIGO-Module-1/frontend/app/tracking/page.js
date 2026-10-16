"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function TrackingPage() {
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");

  const [trackingData, setTrackingData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCustomerId = localStorage.getItem("customer_id");
    const savedOrderId = localStorage.getItem("last_order_id");

    setCustomerId(savedCustomerId || "");
    setOrderId(savedOrderId || "");
  }, []);

  const trackOrder = async () => {
    setMessage("");
    setTrackingData(null);

    if (!orderId) {
      setMessage("Please enter an Order ID.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tracking",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(orderId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Unable to get order tracking details."
        );
        setLoading(false);
        return;
      }

      setTrackingData(data);

      setMessage(
        data.message || "Order tracking API structure is ready."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the tracking API. Please check whether FastAPI is running."
      );
    }

    setLoading(false);
  };

  const getStatusStep = (status) => {
    if (!status) return 0;

    const normalizedStatus = status
      .toString()
      .toUpperCase()
      .replaceAll(" ", "_");

    if (
      normalizedStatus.includes("DELIVERED")
    ) {
      return 5;
    }

    if (
      normalizedStatus.includes("IN_TRANSIT") ||
      normalizedStatus.includes("TRANSIT")
    ) {
      return 4;
    }

    if (
      normalizedStatus.includes("PICKED") ||
      normalizedStatus.includes("RIDER")
    ) {
      return 3;
    }

    if (
      normalizedStatus.includes("READY")
    ) {
      return 2;
    }

    if (
      normalizedStatus.includes("PREPARING")
    ) {
      return 1;
    }

    if (
      normalizedStatus.includes("ACCEPTED")
    ) {
      return 1;
    }

    return 0;
  };

  const currentStep = getStatusStep(
    trackingData?.order_status
  );

  const steps = [
    "Order Placed",
    "Preparing",
    "Ready",
    "Rider Picked Up",
    "In Transit",
    "Delivered",
  ];

  return (
    <main
      style={{
        maxWidth: "850px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Order Tracking</h1>

      <p>
        Track your order status and delivery information.
      </p>

      <hr />

      {/* Order Details */}
      <section style={{ marginTop: "25px" }}>
        <h2>Track Order</h2>

        <p>
          <strong>Customer ID:</strong>{" "}
          {customerId || "Not available"}
        </p>

        <label>
          Order ID:
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "350px",
              padding: "10px",
              marginTop: "8px",
            }}
          />
        </label>

        <button
          onClick={trackOrder}
          disabled={loading}
          style={{
            marginTop: "15px",
            padding: "12px 24px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Checking..." : "Track Order"}
        </button>
      </section>

      {/* Message */}
      {message && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            background: "#f3f3f3",
            borderRadius: "8px",
          }}
        >
          {message}
        </div>
      )}

      {/* Tracking Information */}
      {trackingData && (
        <section style={{ marginTop: "30px" }}>
          <h2>Delivery Status</h2>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <p>
              <strong>Order ID:</strong>{" "}
              {trackingData.order_id || orderId}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {trackingData.order_status || "Not available"}
            </p>

            <p>
              <strong>Rider ID:</strong>{" "}
              {trackingData.rider_id || "Not assigned"}
            </p>

            <p>
              <strong>Estimated Time:</strong>{" "}
              {trackingData.eta || "Not available"}
            </p>
          </div>

          {/* Status Timeline */}
          <div style={{ marginTop: "30px" }}>
            <h2>Order Progress</h2>

            {steps.map((step, index) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    border: "1px solid #333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    background:
                      index <= currentStep
                        ? "#ddd"
                        : "white",
                  }}
                >
                  {index <= currentStep ? "✓" : ""}
                </div>

                <span>{step}</span>
              </div>
            ))}
          </div>

          {/* Rider Location */}
          <div style={{ marginTop: "30px" }}>
            <h2>Rider Location</h2>

            {trackingData.latitude != null &&
            trackingData.longitude != null ? (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <p>
                  <strong>Latitude:</strong>{" "}
                  {trackingData.latitude}
                </p>

                <p>
                  <strong>Longitude:</strong>{" "}
                  {trackingData.longitude}
                </p>

                <p>
                  Google Maps tracking will be connected here
                  using the approved location/API integration.
                </p>
              </div>
            ) : (
              <div
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                }}
              >
                <p>
                  Rider location is not available yet.
                </p>

                <p
                  style={{
                    color: "#666",
                    fontSize: "14px",
                  }}
                >
                  Location will come from the Rider/Delivery
                  system when the rider is assigned and tracking
                  starts.
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Navigation */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/orders">
          <button style={{ padding: "12px 20px" }}>
            My Orders
          </button>
        </Link>

        <Link href="/restaurants">
          <button style={{ padding: "12px 20px" }}>
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}