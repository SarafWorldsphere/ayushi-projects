"use client";

import { useState } from "react";

export default function ProfilePage() {
  // =============================
  // PROFILE STATES
  // =============================

  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // =============================
  // ADDRESS STATES
  // =============================

  const [addressId, setAddressId] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [addressType, setAddressType] = useState("HOME");

  // =============================
  // COMMON STATES
  // =============================

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = "http://127.0.0.1:8000";

  // =============================
  // SAVE PROFILE
  // =============================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            name: name,
            email: email,
            phone: phone,
          }),
        }
      );

      const data = await response.json();

      console.log("Profile API response:", data);

      if (!response.ok) {
        setMessage("Profile request failed.");
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error("Profile error:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // ADD ADDRESS
  // =============================

  const handleAddAddress = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/address`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            pincode: pincode,
            latitude:
              latitude === ""
                ? null
                : Number(latitude),
            longitude:
              longitude === ""
                ? null
                : Number(longitude),
            address_type: addressType,
          }),
        }
      );

      const data = await response.json();

      console.log("Add Address API response:", data);

      if (!response.ok) {
        setMessage("Add address request failed.");
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error("Add address error:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // VIEW ADDRESS
  // =============================

  const handleViewAddress = async () => {
    if (!customerId || !addressId) {
      setMessage(
        "Please enter Customer ID and Address ID."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/address/view`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            address_id: Number(addressId),
          }),
        }
      );

      const data = await response.json();

      console.log("View Address API response:", data);

      if (!response.ok) {
        setMessage("View address request failed.");
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error("View address error:", error);
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // UPDATE ADDRESS
  // =============================

  const handleUpdateAddress = async () => {
    if (!customerId || !addressId) {
      setMessage(
        "Please enter Customer ID and Address ID."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/address`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            pincode: pincode,
            latitude:
              latitude === ""
                ? null
                : Number(latitude),
            longitude:
              longitude === ""
                ? null
                : Number(longitude),
            address_type: addressType,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Update Address API response:",
        data
      );

      if (!response.ok) {
        setMessage(
          "Update address request failed."
        );
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error(
        "Update address error:",
        error
      );
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // DELETE ADDRESS
  // =============================

  const handleDeleteAddress = async () => {
    if (!customerId || !addressId) {
      setMessage(
        "Please enter Customer ID and Address ID."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/address`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            address_id: Number(addressId),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Delete Address API response:",
        data
      );

      if (!response.ok) {
        setMessage(
          "Delete address request failed."
        );
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error(
        "Delete address error:",
        error
      );
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // SET DEFAULT ADDRESS
  // =============================

  const handleSetDefaultAddress = async () => {
    if (!customerId || !addressId) {
      setMessage(
        "Please enter Customer ID and Address ID."
      );
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/address/default`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: Number(customerId),
            address_id: Number(addressId),
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Default Address API response:",
        data
      );

      if (!response.ok) {
        setMessage(
          "Set default address request failed."
        );
        return;
      }

      setMessage(data.message);
    } catch (error) {
      console.error(
        "Default address error:",
        error
      );
      setMessage("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // CLEAR ADDRESS FORM
  // =============================

  const clearAddressForm = () => {
    setAddressId("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPincode("");
    setLatitude("");
    setLongitude("");
    setAddressType("HOME");
  };

  // =============================
  // PAGE UI
  // =============================

  return (
    <main className="login-container">
      <div
        className="login-card"
        style={{
          maxWidth: "650px",
          margin: "30px auto",
        }}
      >
        {/* =============================
            PROFILE
        ============================== */}

        <h1>Customer Profile</h1>

        <h2>Profile Details</h2>

        <form onSubmit={handleProfileSubmit}>
          <label htmlFor="customerId">
            Customer ID
          </label>

          <input
            id="customerId"
            type="number"
            placeholder="Enter customer ID"
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
            required
          />

          <label htmlFor="name">
            Name
          </label>

          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />

          <label htmlFor="email">
            Gmail
          </label>

          <input
            id="email"
            type="email"
            placeholder="Enter your Gmail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <label htmlFor="phone">
            Phone
          </label>

          <input
            id="phone"
            type="tel"
            placeholder="Enter your phone"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>

        <hr
          style={{
            margin: "30px 0",
          }}
        />

        {/* =============================
            ADD ADDRESS
        ============================== */}

        <h2>Delivery Address</h2>

        <form onSubmit={handleAddAddress}>
          <label htmlFor="addressLine1">
            Address Line 1
          </label>

          <input
            id="addressLine1"
            type="text"
            placeholder="House / Flat / Street"
            value={addressLine1}
            onChange={(e) =>
              setAddressLine1(e.target.value)
            }
            required
          />

          <label htmlFor="addressLine2">
            Address Line 2
          </label>

          <input
            id="addressLine2"
            type="text"
            placeholder="Area / Landmark"
            value={addressLine2}
            onChange={(e) =>
              setAddressLine2(e.target.value)
            }
          />

          <label htmlFor="city">
            City
          </label>

          <input
            id="city"
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            required
          />

          <label htmlFor="state">
            State
          </label>

          <input
            id="state"
            type="text"
            placeholder="Enter state"
            value={state}
            onChange={(e) =>
              setState(e.target.value)
            }
            required
          />

          <label htmlFor="pincode">
            Pincode
          </label>

          <input
            id="pincode"
            type="text"
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value)
            }
            required
          />

          <label htmlFor="latitude">
            Latitude
          </label>

          <input
            id="latitude"
            type="number"
            step="any"
            placeholder="Optional"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
          />

          <label htmlFor="longitude">
            Longitude
          </label>

          <input
            id="longitude"
            type="number"
            step="any"
            placeholder="Optional"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
          />

          <label htmlFor="addressType">
            Address Type
          </label>

          <select
            id="addressType"
            value={addressType}
            onChange={(e) =>
              setAddressType(e.target.value)
            }
          >
            <option value="HOME">
              Home
            </option>

            <option value="WORK">
              Work
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : "Add Address"}
          </button>
        </form>

        <hr
          style={{
            margin: "30px 0",
          }}
        />

        {/* =============================
            ADDRESS MANAGEMENT
        ============================== */}

        <h2>Manage Address</h2>

        <label htmlFor="addressId">
          Address ID
        </label>

        <input
          id="addressId"
          type="number"
          placeholder="Enter address ID"
          value={addressId}
          onChange={(e) =>
            setAddressId(e.target.value)
          }
        />

        <button
          type="button"
          onClick={handleViewAddress}
          disabled={loading}
        >
          View Address
        </button>

        <button
          type="button"
          onClick={handleUpdateAddress}
          disabled={loading}
        >
          Update Address
        </button>

        <button
          type="button"
          onClick={handleSetDefaultAddress}
          disabled={loading}
        >
          Set as Default
        </button>

        <button
          type="button"
          onClick={handleDeleteAddress}
          disabled={loading}
        >
          Delete Address
        </button>

        <button
          type="button"
          onClick={clearAddressForm}
          disabled={loading}
        >
          Clear Address Form
        </button>

        {/* =============================
            MESSAGE
        ============================== */}

        {message && (
          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
}