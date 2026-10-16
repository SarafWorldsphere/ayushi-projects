"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CancelOrderPage() {
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [reason, setReason] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCustomerId =
      localStorage.getItem("customer_id");

    const savedOrderId =
      localStorage.getItem("last_order_id");

    setCustomerId(savedCustomerId || "");
    setOrderId(savedOrderId || "");
  }, []);

  const cancelOrder = async () => {
    setMessage("");

    if (!customerId) {
      setMessage("Customer ID is not available.");
      return;
    }

    if (!orderId) {
      setMessage("Please enter an Order ID.");
      return;
    }

    if (!reason.trim()) {
      setMessage("Please enter a cancellation reason.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/orders/cancel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(orderId),
            customer_id: Number(customerId),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Unable to cancel the order.";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (Array.isArray(data.detail)) {
          errorMessage = data.detail
            .map((item) =>
              typeof item?.msg === "string"
                ? item.msg
                : "Invalid request."
            )
            .join(", ");
        }

        setMessage(errorMessage);
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "last_cancellation_response",
        JSON.stringify({
          ...data,
          cancellation_reason: reason,
        })
      );

      setMessage(
        data.message ||
          "Order cancellation API structure is ready."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the cancellation API. Please check whether FastAPI is running."
      );
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        maxWidth: "700px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Cancel Order</h1>

      <p>
        Cancel an eligible customer order.
      </p>

      <hr />

      <section style={{ marginTop: "25px" }}>
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
      </section>

      <section style={{ marginTop: "25px" }}>
        <label>
          Cancellation Reason:
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for cancellation"
            rows={4}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "500px",
              padding: "10px",
              marginTop: "8px",
              resize: "vertical",
            }}
          />
        </label>
      </section>

      <div
        style={{
          marginTop: "25px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <p style={{ margin: 0 }}>
          <strong>Cancellation rules:</strong>
        </p>

        <p style={{ color: "#666" }}>
          Whether an order can be cancelled, and any applicable
          charges or refund amount, will depend on the approved
          business rules and current order stage.
        </p>

        <p style={{ color: "#666", marginBottom: 0 }}>
          No cancellation charge or refund percentage is
          hardcoded in this Customer Module.
        </p>
      </div>

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

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={cancelOrder}
          disabled={loading}
          style={{
            padding: "12px 24px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Cancelling..."
            : "Cancel Order"}
        </button>

        <Link href="/orders">
          <button style={{ padding: "12px 20px" }}>
            My Orders
          </button>
        </Link>

        <Link href="/tracking">
          <button style={{ padding: "12px 20px" }}>
            Track Order
          </button>
        </Link>
      </div>
    </main>
  );
}