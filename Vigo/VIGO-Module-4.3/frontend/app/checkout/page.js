"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
// Adjust the path if your lib folder is located differently (e.g., "../../lib/api" or "@/lib/api")
import { apiFetch } from "../lib/api"; 

export default function CheckoutPage() {
  const [customerId, setCustomerId] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const [addressId, setAddressId] = useState("");
  const [offerCode, setOfferCode] = useState("");

  const [gstAmount, setGstAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [discount, setDiscount] = useState(0);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Note: customerId is kept for UI display, but backend uses the JWT token for auth
    const savedCustomerId = localStorage.getItem("customer_id");
    const savedRestaurantId = localStorage.getItem("customer_restaurant_id");

    setCustomerId(savedCustomerId || "");
    setRestaurantId(savedRestaurantId || "");

    let foundCart = [];

    // Find the current restaurant cart
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("customer_cart_")) {
        const savedCart = localStorage.getItem(key);

        try {
          const parsedCart = JSON.parse(savedCart);

          if (Array.isArray(parsedCart) && parsedCart.length > 0) {
            foundCart = parsedCart;

            const idFromKey = key.replace("customer_cart_", "");

            if (!savedRestaurantId) {
              setRestaurantId(idFromKey);
              localStorage.setItem("customer_restaurant_id", idFromKey);
            }
          }
        } catch (error) {
          console.error("Invalid cart data:", error);
        }
      }
    });

    setCartItems(foundCart);
  }, []);

  const subtotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.unit_price || 0) * Number(item.quantity || 0),
    0
  );

  const finalAmount =
    subtotal +
    Number(gstAmount || 0) +
    Number(deliveryCharge || 0) -
    Number(discount || 0);

  const placeOrder = async () => {
    setMessage("");

    if (!restaurantId) {
      setMessage("Restaurant ID is required.");
      return;
    }

    if (!addressId) {
      setMessage("Please enter/select a delivery address ID.");
      return;
    }

    if (cartItems.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // The backend /customers/checkout endpoint now creates the order and items in the database automatically. 
      // We no longer need a separate call to the /orders endpoint.
      const checkoutData = await apiFetch("/customers/checkout", {
        method: "POST",
        body: JSON.stringify({
          restaurant_id: String(restaurantId),
          address_id: Number(addressId),
          offer_code: offerCode || null,
        }),
      });

      // Save order response for the confirmation page.
      localStorage.setItem("last_order_response", JSON.stringify(checkoutData));

      // Clear cart after successful order creation.
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("customer_cart_")) {
          localStorage.removeItem(key);
        }
      });

      localStorage.removeItem("customer_restaurant_id");

      setMessage(checkoutData.message || "Order placed successfully!");
      setLoading(false);

      // Go to confirmation page after a short delay.
      setTimeout(() => {
        window.location.href = "/order-confirmation";
      }, 1000);

    } catch (error) {
      console.error(error);
      setMessage(
        error.message || "Checkout failed. Please check your network or token."
      );
      setLoading(false);
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
      <h1>Checkout</h1>

      <p>Review your order details before placing the order.</p>

      <hr />

      {/* Customer Details */}
      <section style={{ marginTop: "25px" }}>
        <h2>Customer Details</h2>

        <p>
          <strong>Customer ID:</strong> {customerId || "Managed by Session Token"}
        </p>

        <p>
          <strong>Restaurant ID:</strong> {restaurantId || "Not available"}
        </p>
      </section>

      {/* Delivery Address */}
      <section style={{ marginTop: "25px" }}>
        <h2>Delivery Address</h2>

        <label>
          Address ID:
          <input
            type="number"
            value={addressId}
            onChange={(e) => setAddressId(e.target.value)}
            placeholder="Enter address ID"
            style={{
              display: "block",
              width: "100%",
              maxWidth: "400px",
              padding: "10px",
              marginTop: "8px",
              marginBottom: "15px",
            }}
          />
        </label>

        <p style={{ fontSize: "14px", color: "#666" }}>
          Address details will come from the Customer Address database once DB
          integration is enabled.
        </p>
      </section>

      {/* Cart Items */}
      <section style={{ marginTop: "25px" }}>
        <h2>Order Items</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cartItems.map((item, index) => (
              <div
                key={`${item.menu_id}-${index}`}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <strong>{item.name || `Menu Item ${item.menu_id}`}</strong>
                </p>

                <p>Quantity: {item.quantity}</p>

                <p>Unit Price: ₹{Number(item.unit_price || 0).toFixed(2)}</p>

                <p>
                  Item Total: ₹
                  {(
                    Number(item.unit_price || 0) * Number(item.quantity || 0)
                  ).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Offer */}
      <section style={{ marginTop: "25px" }}>
        <h2>Offers / Discount</h2>

        <input
          type="text"
          value={offerCode}
          onChange={(e) => setOfferCode(e.target.value)}
          placeholder="Enter offer code"
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "10px",
          }}
        />

        <p style={{ marginTop: "10px" }}>
          Discount:
          <strong> ₹{Number(discount || 0).toFixed(2)}</strong>
        </p>
      </section>

      {/* Charges */}
      <section style={{ marginTop: "25px" }}>
        <h2>Charges</h2>

        <label>
          GST Amount:
          <input
            type="number"
            min="0"
            value={gstAmount}
            onChange={(e) => setGstAmount(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "300px",
              padding: "10px",
              marginTop: "8px",
              marginBottom: "15px",
            }}
          />
        </label>

        <label>
          Delivery Charge:
          <input
            type="number"
            min="0"
            value={deliveryCharge}
            onChange={(e) => setDeliveryCharge(e.target.value)}
            style={{
              display: "block",
              width: "100%",
              maxWidth: "300px",
              padding: "10px",
              marginTop: "8px",
            }}
          />
        </label>

        <p style={{ fontSize: "13px", color: "#666" }}>
          These values are temporary for local testing. Final GST, delivery
          charges and discounts must come from approved business
          rules/configuration.
        </p>
      </section>

      {/* Summary */}
      <section
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
        }}
      >
        <h2>Order Summary</h2>

        <p>
          Subtotal:
          <strong> ₹{subtotal.toFixed(2)}</strong>
        </p>

        <p>
          GST:
          <strong> ₹{Number(gstAmount || 0).toFixed(2)}</strong>
        </p>

        <p>
          Delivery Charge:
          <strong> ₹{Number(deliveryCharge || 0).toFixed(2)}</strong>
        </p>

        <p>
          Discount:
          <strong> - ₹{Number(discount || 0).toFixed(2)}</strong>
        </p>

        <hr />

        <h2>Final Payable: ₹{finalAmount.toFixed(2)}</h2>
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

      {/* Buttons */}
      <div
        style={{
          marginTop: "25px",
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={placeOrder}
          disabled={loading}
          style={{
            padding: "12px 24px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        <Link href="/cart">
          <button
            style={{
              padding: "12px 24px",
              cursor: "pointer",
            }}
          >
            Back to Cart
          </button>
        </Link>
      </div>
    </main>
  );
}