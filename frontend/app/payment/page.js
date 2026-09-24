"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PaymentPage() {
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [amount, setAmount] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [transactionRef, setTransactionRef] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCustomerId = localStorage.getItem("customer_id");
    const savedOrderId = localStorage.getItem("last_order_id");
    const savedAmount = localStorage.getItem("last_order_amount");

    setCustomerId(savedCustomerId || "");
    setOrderId(savedOrderId || "");
    setAmount(savedAmount || "");
  }, []);

  const makePayment = async () => {
    setMessage("");

    if (!customerId) {
      setMessage("Customer ID is required.");
      return;
    }

    if (!orderId) {
      setMessage(
        "Order ID is not available yet. Payment will be connected after real order creation is available."
      );
      return;
    }

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid payment amount.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_id: Number(orderId),
            method: paymentMethod,
            amount: Number(amount),
            transaction_ref: transactionRef || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.detail || "Payment failed.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "last_payment_response",
        JSON.stringify(data)
      );

      setMessage(
        data.message || "Payment API structure is ready."
      );

      setLoading(false);
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the payment API. Check whether FastAPI is running."
      );

      setLoading(false);
    }
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
      <h1>Payment</h1>

      <p>Select your payment method.</p>

      <hr />

      <section style={{ marginTop: "25px" }}>
        <h2>Order Details</h2>

        <p>
          <strong>Customer ID:</strong>{" "}
          {customerId || "Not available"}
        </p>

        <p>
          <strong>Order ID:</strong>{" "}
          {orderId || "Not available"}
        </p>

        <label>
          Payment Amount:
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
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

      <section style={{ marginTop: "30px" }}>
        <h2>Payment Method</h2>

        <label
          style={{
            display: "block",
            marginBottom: "12px",
          }}
        >
          <input
            type="radio"
            value="UPI"
            checked={paymentMethod === "UPI"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {" "}UPI
        </label>

        <label
          style={{
            display: "block",
            marginBottom: "12px",
          }}
        >
          <input
            type="radio"
            value="CREDIT_CARD"
            checked={paymentMethod === "CREDIT_CARD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {" "}Credit Card
        </label>

        <label
          style={{
            display: "block",
            marginBottom: "12px",
          }}
        >
          <input
            type="radio"
            value="DEBIT_CARD"
            checked={paymentMethod === "DEBIT_CARD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {" "}Debit Card
        </label>

        <p
          style={{
            marginTop: "20px",
            color: "#666",
          }}
        >
          COD is currently disabled as per the current
          Customer Module requirement.
        </p>
      </section>

      <section style={{ marginTop: "30px" }}>
        <h2>Transaction Reference</h2>

        <input
          type="text"
          value={transactionRef}
          onChange={(e) => setTransactionRef(e.target.value)}
          placeholder="Enter transaction reference if available"
          style={{
            width: "100%",
            maxWidth: "450px",
            padding: "10px",
          }}
        />
      </section>

      {message && (
        <div
          style={{
            marginTop: "25px",
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
          onClick={makePayment}
          disabled={loading}
          style={{
            padding: "12px 24px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <Link href="/orders">
          <button
            style={{
              padding: "12px 24px",
            }}
          >
            Order History
          </button>
        </Link>

        <Link href="/tracking">
          <button
            style={{
              padding: "12px 24px",
            }}
          >
            Track Order
          </button>
        </Link>
      </div>
    </main>
  );
}