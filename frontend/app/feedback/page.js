"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function FeedbackPage() {
  const [customerId, setCustomerId] = useState("");
  const [orderId, setOrderId] = useState("");
  const [rating, setRating] = useState("");
  const [comments, setComments] = useState("");

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

  const submitFeedback = async () => {
    setMessage("");

    if (!customerId) {
      setMessage("Customer ID is not available.");
      return;
    }

    if (!orderId) {
      setMessage("Please enter the Order ID.");
      return;
    }

    if (!rating) {
      setMessage("Please select a rating.");
      return;
    }

    if (Number(rating) < 1 || Number(rating) > 5) {
      setMessage("Rating must be between 1 and 5.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/feedback",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            order_id: Number(orderId),
            rating: Number(rating),
            comments: comments.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        let errorMessage = "Unable to submit feedback.";

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
        "last_feedback_response",
        JSON.stringify(data)
      );

      setMessage(
        data.message ||
          "Feedback API structure is ready."
      );

      setLoading(false);
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the feedback API. Please check whether FastAPI is running."
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
      <h1>Feedback & Rating</h1>

      <p>
        Share your experience after your order has been
        delivered.
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

      <section style={{ marginTop: "30px" }}>
        <h2>Rating</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setRating(String(value))}
              style={{
                padding: "12px 18px",
                border:
                  rating === String(value)
                    ? "2px solid black"
                    : "1px solid #ccc",
                borderRadius: "8px",
                cursor: "pointer",
                background:
                  rating === String(value)
                    ? "#eee"
                    : "white",
              }}
            >
              {value} ⭐
            </button>
          ))}
        </div>

        {rating && (
          <p style={{ marginTop: "15px" }}>
            Selected Rating: <strong>{rating}/5</strong>
          </p>
        )}
      </section>

      <section style={{ marginTop: "25px" }}>
        <label>
          Comments / Feedback:
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share your experience"
            rows={5}
            style={{
              display: "block",
              width: "100%",
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
          Feedback is intended to be associated with the
          relevant customer order. Final feedback rules and
          database implementation will follow the approved
          Customer Module design.
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
          onClick={submitFeedback}
          disabled={loading}
          style={{
            padding: "12px 24px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Submitting..."
            : "Submit Feedback"}
        </button>

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