"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001";

export default function RestaurantMenuPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params?.id;

  const [restaurantName, setRestaurantName] = useState("Restaurant");
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [customerId, setCustomerId] = useState("");

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [message, setMessage] = useState("");

  /* =========================================================
     LOAD CUSTOMER AND SAVED CART
     ========================================================= */

  useEffect(() => {
    if (!restaurantId) return;

    try {
      const savedCustomerId =
        localStorage.getItem("customer_id");

      const savedCart = localStorage.getItem(
        `customer_cart_${restaurantId}`
      );

      const savedRestaurantName =
        localStorage.getItem(
          `restaurant_name_${restaurantId}`
        );

      if (savedCustomerId) {
        setCustomerId(savedCustomerId);
      }

      if (savedRestaurantName) {
        setRestaurantName(savedRestaurantName);
      }

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Unable to load saved customer/cart information:",
        error
      );
    }
  }, [restaurantId]);

  /* =========================================================
     LOAD RESTAURANT DETAILS
     ========================================================= */

  useEffect(() => {
    if (!restaurantId) return;

    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `${API_URL}/customers/restaurant/details`,
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
          return;
        }

        const restaurant =
          data.restaurant || data;

        if (restaurant?.name) {
          setRestaurantName(restaurant.name);

          localStorage.setItem(
            `restaurant_name_${restaurantId}`,
            restaurant.name
          );
        }
      } catch (error) {
        console.error(
          "Unable to load restaurant details:",
          error
        );
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  /* =========================================================
     LOAD MENU
     ========================================================= */

  useEffect(() => {
    if (!restaurantId) return;

    const fetchMenu = async () => {
      setLoading(true);
      setMessage("");

      try {
        const response = await fetch(
          `${API_URL}/customers/restaurant/menu`,
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

        console.log(
          "Restaurant menu API response:",
          data
        );

        if (!response.ok) {
          setMessage(
            data?.detail ||
              data?.message ||
              "Unable to load menu."
          );
          return;
        }

        setCategories(
          Array.isArray(data.categories)
            ? data.categories
            : []
        );

        setMenuItems(
          Array.isArray(data.menu_items)
            ? data.menu_items
            : []
        );

        if (
          (!data.categories ||
            data.categories.length === 0) &&
          (!data.menu_items ||
            data.menu_items.length === 0)
        ) {
          setMessage(
            data.message ||
              "No menu items are currently available."
          );
        }
      } catch (error) {
        console.error(
          "Menu loading error:",
          error
        );

        setMessage(
          "Unable to connect to the Customer Module backend."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  /* =========================================================
     SAVE CART LOCALLY
     ========================================================= */

  const saveCart = (
    items,
    currentCustomerId
  ) => {
    try {
      localStorage.setItem(
        `customer_cart_${restaurantId}`,
        JSON.stringify(items)
      );

      if (currentCustomerId) {
        localStorage.setItem(
          "customer_id",
          String(currentCustomerId)
        );
      }
    } catch (error) {
      console.error(
        "Unable to save cart:",
        error
      );
    }
  };

  /* =========================================================
     ADD ITEM TO CART
     ========================================================= */

  const handleAddToCart = async (item) => {
    if (!customerId) {
      setMessage(
        "Customer information is not available. Please login first."
      );
      return;
    }

    const menuId =
      item.menu_id || item.id;

    if (!menuId) {
      setMessage(
        "Menu item ID is not available."
      );
      return;
    }

    const unitPrice = Number(
      item.price ??
        item.unit_price ??
        item.base_price ??
        0
    );

    const existingItem =
      cartItems.find(
        (cartItem) =>
          String(cartItem.menu_id) ===
          String(menuId)
      );

    let updatedItems;

    if (existingItem) {
      updatedItems =
        cartItems.map(
          (cartItem) =>
            String(cartItem.menu_id) ===
            String(menuId)
              ? {
                  ...cartItem,
                  quantity:
                    Number(
                      cartItem.quantity
                    ) + 1,
                }
              : cartItem
        );
    } else {
      updatedItems = [
        ...cartItems,
        {
          menu_id: menuId,
          name:
            item.name ||
            item.menu_name ||
            "Menu Item",
          quantity: 1,
          unit_price: unitPrice,
        },
      ];
    }

    setCartItems(updatedItems);

    saveCart(
      updatedItems,
      customerId
    );

    setCartLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/customers/cart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            restaurant_id: restaurantId,
            items: updatedItems.map(
              (cartItem) => ({
                menu_id:
                  cartItem.menu_id,
                quantity:
                  cartItem.quantity,
                unit_price:
                  cartItem.unit_price,
              })
            ),
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Cart API response:",
        data
      );

      if (!response.ok) {
        setMessage(
          data?.detail ||
            data?.message ||
            "Unable to add item to cart."
        );
        return;
      }

      setMessage(
        data.message ||
          "Item added to cart."
      );
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setMessage(
        "Unable to connect to backend."
      );
    } finally {
      setCartLoading(false);
    }
  };

  /* =========================================================
     CART TOTAL
     ========================================================= */

  const cartTotal =
    cartItems.reduce(
      (total, item) => {
        const quantity =
          Number(
            item.quantity || 0
          );

        const price =
          Number(
            item.unit_price || 0
          );

        return (
          total +
          quantity * price
        );
      },
      0
    );

  /* =========================================================
     LOADING
     ========================================================= */

  if (loading) {
    return (
      <main className="login-container">
        <div className="login-card">
          <h1>
            {restaurantName} Menu
          </h1>

          <p>
            Loading menu...
          </p>
        </div>
      </main>
    );
  }

  /* =========================================================
     PAGE
     ========================================================= */

  return (
    <main className="login-container">
      <div
        className="login-card"
        style={{
          maxWidth: "900px",
          margin: "30px auto",
        }}
      >
        <h1>
          {restaurantName}
        </h1>

        <p>Menu</p>

        <p>
          Restaurant ID:{" "}
          {restaurantId}
        </p>

        {message && (
          <div
            style={{
              marginTop: "20px",
              marginBottom: "20px",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
          >
            {message}
          </div>
        )}

        {/* MENU CATEGORIES */}

        {categories.length > 0 && (
          <section
            style={{
              marginTop: "25px",
            }}
          >
            <h2>
              Menu Categories
            </h2>

            {categories.map(
              (category, index) => (
                <div
                  key={
                    category.id ||
                    category.category_id ||
                    index
                  }
                  style={{
                    padding: "10px",
                    marginBottom: "8px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                  }}
                >
                  {category.name ||
                    category.category_name ||
                    "Category"}
                </div>
              )
            )}
          </section>
        )}

        {/* MENU ITEMS */}

        <section
          style={{
            marginTop: "30px",
          }}
        >
          <h2>
            Menu Items
          </h2>

          {menuItems.length === 0 ? (
            <p>
              No menu items are
              currently available.
            </p>
          ) : (
            menuItems.map(
              (item, index) => {
                const menuId =
                  item.menu_id ||
                  item.id;

                const price =
                  Number(
                    item.price ??
                      item.unit_price ??
                      item.base_price ??
                      0
                  );

                return (
                  <div
                    key={
                      menuId || index
                    }
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      padding: "15px",
                      marginBottom: "15px",
                    }}
                  >
                    <h3>
                      {item.name ||
                        item.menu_name ||
                        "Menu Item"}
                    </h3>

                    {item.description && (
                      <p>
                        {item.description}
                      </p>
                    )}

                    <p>
                      <strong>
                        ₹
                        {price.toFixed(2)}
                      </strong>
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleAddToCart(
                          item
                        )
                      }
                      disabled={
                        cartLoading ||
                        !customerId
                      }
                    >
                      {cartLoading
                        ? "Adding..."
                        : "Add to Cart"}
                    </button>
                  </div>
                );
              }
            )
          )}
        </section>

        {/* CART SUMMARY */}

        <section
          style={{
            marginTop: "30px",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h2>Cart</h2>

          {cartItems.length === 0 ? (
            <p>
              Your cart is empty.
            </p>
          ) : (
            <>
              {cartItems.map(
                (item) => (
                  <div
                    key={
                      item.menu_id
                    }
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "10px",
                    }}
                  >
                    <span>
                      {item.name ||
                        `Menu ID: ${item.menu_id}`}
                    </span>

                    <span>
                      Qty:{" "}
                      {item.quantity}
                    </span>

                    <span>
                      ₹
                      {(
                        Number(
                          item.quantity
                        ) *
                        Number(
                          item.unit_price
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                )
              )}

              <hr />

              <h3>
                Cart Total: ₹
                {cartTotal.toFixed(2)}
              </h3>

              <Link href="/cart">
                <button type="button">
                  View Cart
                </button>
              </Link>
            </>
          )}
        </section>

        {/* NAVIGATION */}

        <div
          style={{
            marginTop: "25px",
          }}
        >
          <button
            type="button"
            onClick={() =>
              router.push(
                `/restaurants/${restaurantId}`
              )
            }
          >
            ← Back to Restaurant
          </button>
        </div>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          <Link href="/restaurants">
            <button type="button">
              Back to Restaurants
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}