"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://127.0.0.1:8001";

export default function OffersPage() {
  const [customerId, setCustomerId] = useState("");
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedCustomerId =
      localStorage.getItem("customer_id");

    setCustomerId(savedCustomerId || "");
  }, []);

  const getMessage = (data, fallback) => {
    if (!data) {
      return fallback;
    }

    if (typeof data.message === "string") {
      return data.message;
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => {
          if (typeof item === "string") {
            return item;
          }

          if (item && typeof item.msg === "string") {
            return item.msg;
          }

          return "Invalid request.";
        })
        .join(", ");
    }

    return fallback;
  };

  const loadOffers = async () => {
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/offers/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId
              ? Number(customerId)
              : null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          getMessage(data, "Unable to load offers.")
        );
        setLoading(false);
        return;
      }

      const availableOffers = Array.isArray(data.offers)
        ? data.offers
        : [];

      setOffers(availableOffers);

      if (availableOffers.length === 0) {
        setMessage(
          "No offers are available currently."
        );
      } else {
        setMessage(
          getMessage(
            data,
            "Available offers loaded successfully."
          )
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the offers API. Please check whether FastAPI is running."
      );
    }

    setLoading(false);
  };

  const applyOffer = async () => {
    setMessage("");

    if (!selectedOffer) {
      setMessage("Please select an offer.");
      return;
    }

    if (!customerId) {
      setMessage("Customer ID is not available.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/offers/apply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            offer_code: selectedOffer,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          getMessage(data, "Unable to apply offer.")
        );
        return;
      }

      localStorage.setItem(
        "selected_offer_code",
        selectedOffer
      );

      setMessage(
        getMessage(
          data,
          "Offer application API structure is ready."
        )
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Unable to connect to the offer application API."
      );
    }
  };

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Offers & Rewards</h1>

      <p>
        View available offers and apply an eligible offer
        to your order.
      </p>

      <hr />

      <section style={{ marginTop: "25px" }}>
        <p>
          <strong>Customer ID:</strong>{" "}
          {customerId || "Not available"}
        </p>

        <button
          onClick={loadOffers}
          disabled={loading}
          style={{
            padding: "12px 22px",
            cursor: loading
              ? "not-allowed"
              : "pointer",
          }}
        >
          {loading
            ? "Loading..."
            : "View Available Offers"}
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
        <h2>Available Offers</h2>

        {offers.length === 0 ? (
          <p>
            No offers are available currently.
          </p>
        ) : (
          offers.map((offer, index) => {
            const offerCode =
              typeof offer.offer_code === "string"
                ? offer.offer_code
                : typeof offer.code === "string"
                ? offer.code
                : "";

            const offerName =
              typeof offer.offer_name === "string"
                ? offer.offer_name
                : typeof offer.name === "string"
                ? offer.name
                : "Available Offer";

            const description =
              typeof offer.description === "string"
                ? offer.description
                : "";

            const validUntil =
              typeof offer.valid_until === "string"
                ? offer.valid_until
                : "";

            return (
              <div
                key={offerCode || index}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "10px",
                  padding: "20px",
                  marginBottom: "15px",
                }}
              >
                <h3>{offerName}</h3>

                {description && (
                  <p>{description}</p>
                )}

                {offerCode && (
                  <p>
                    <strong>Code:</strong>{" "}
                    {offerCode}
                  </p>
                )}

                {validUntil && (
                  <p>
                    <strong>Valid Until:</strong>{" "}
                    {validUntil}
                  </p>
                )}

                <label>
                  <input
                    type="radio"
                    name="offer"
                    value={offerCode}
                    checked={
                      selectedOffer === offerCode
                    }
                    onChange={(e) =>
                      setSelectedOffer(
                        e.target.value
                      )
                    }
                  />
                  {" "}Select this offer
                </label>
              </div>
            );
          })
        )}
      </section>

      <button
        onClick={applyOffer}
        disabled={!selectedOffer}
        style={{
          marginTop: "10px",
          padding: "12px 24px",
          cursor: !selectedOffer
            ? "not-allowed"
            : "pointer",
        }}
      >
        Apply Selected Offer
      </button>

      <div
        style={{
          marginTop: "30px",
          padding: "15px",
          border: "1px solid #ddd",
          borderRadius: "8px",
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          Final discount value and eligibility will come
          from approved offer/business rules and backend
          configuration. No discount percentage is
          hardcoded in this Customer Module screen.
        </p>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <Link href="/checkout">
          <button
            style={{
              padding: "12px 20px",
            }}
          >
            Go to Checkout
          </button>
        </Link>

        <Link href="/restaurants">
          <button
            style={{
              padding: "12px 20px",
            }}
          >
            Continue Shopping
          </button>
        </Link>
      </div>
    </main>
  );
}