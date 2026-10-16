"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
  const [customerId, setCustomerId] = useState("");
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCustomerId = localStorage.getItem("customer_id");
    setCustomerId(savedCustomerId || "");
  }, []);

  const loadOrders = async () => {
    setMessage("");
    setLoading(true);

    if (!customerId) {
      setMessage("Customer ID is not available.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/orders/history",
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

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Unable to load order history.");
        setLoading(false);
        return;
      }

      setOrders(data.orders || []);

      setMessage(
        data.message || "Order history API structure is ready."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the order history API."
      );
    }

    setLoading(false);
  };

  const viewOrderDetails = async (orderId) => {
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/orders/details",
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
        setMessage(
          data.detail || "Unable to load order details."
        );
        return;
      }

      setSelectedOrder(data);
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the order details API."
      );
    }
  };

  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

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
        setMessage(
          data.detail || "Unable to cancel the order."
        );
        return;
      }

      setMessage(
        data.message || "Order cancellation API structure is ready."
      );

      await loadOrders();
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the cancellation API."
      );
    }
  };

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>My Orders</h1>

      <p>
        View your order history, order details and cancellation
        options.
      </p>

      <hr />

      <section style={{ marginTop: "25px" }}>
        <p>
          <strong>Customer ID:</strong>{" "}
          {customerId || "Not available"}
        </p>

        <button
          onClick={loadOrders}
          disabled={loading}
          style={{
            padding: "12px 22px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading..." : "Load Order History"}
        </button>
      </section>

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

      <section style={{ marginTop: "30px" }}>
        <h2>Order History</h2>

        {orders.length === 0 ? (
          <p>No orders available yet.</p>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.order_id || index}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                marginBottom: "15px",
              }}
            >
              <p>
                <strong>Order ID:</strong>{" "}
                {order.order_id || "Not available"}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                {order.order_status || "Not available"}
              </p>

              <p>
                <strong>Total:</strong> ₹
                {Number(order.total_amount || 0).toFixed(2)}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginTop: "15px",
                }}
              >
                <button
                  onClick={() =>
                    viewOrderDetails(order.order_id)
                  }
                  style={{
                    padding: "10px 18px",
                  }}
                >
                  View Details
                </button>

                <button
                  onClick={() =>
                    cancelOrder(order.order_id)
                  }
                  style={{
                    padding: "10px 18px",
                  }}
                >
                  Cancel Order
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {selectedOrder && (
        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        >
          <h2>Order Details</h2>

          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#f7f7f7",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {JSON.stringify(selectedOrder, null, 2)}
          </pre>

          <button
            onClick={() => setSelectedOrder(null)}
            style={{
              padding: "10px 18px",
              marginTop: "10px",
            }}
          >
            Close Details
          </button>
        </section>
      )}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/tracking">
          <button style={{ padding: "12px 20px" }}>
            Track Order
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