import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("access_token");

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data);
    } catch (error) {
      console.log("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );
  };

  // open modal
  const openCheckoutModal = () => {
    setAddress("");
    setMobile("");
    setShowCheckoutModal(true);
  };

  // close modal
  const closeCheckoutModal = () => {
    if (!checkoutLoading) setShowCheckoutModal(false);
  };

  // create order using address + mobile from modal
  const createOrder = async (e) => {
    e?.preventDefault?.();
    const token = localStorage.getItem("access_token");

    // simple frontend validation
    if (!address || address.trim().length === 0) {
      alert("Please enter your address");
      return;
    }
    if (!mobile || mobile.trim().length === 0) {
      alert("Please enter your mobile number");
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/cart/checkout",
        {
          address,
          mobile,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Order created successfully!");
      setShowCheckoutModal(false);
      fetchCart();
    } catch (error) {
      console.log("Error creating order:", error.response?.data || error.message);
      const msg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to create order";
      alert(msg);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const clearCart = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/clear",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cart cleared!");
      fetchCart();
    } catch (error) {
      console.log(error);
      alert("Failed to clear cart");
    }
  };

  const deleteItem = async (itemId) => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/cart/item/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (error) {
      console.log(error);
      alert("Failed to delete item");
    }
  };

  const editItemQuantity = async (itemId) => {
    const newQty = prompt("Enter new quantity:");
    if (!newQty || isNaN(newQty) || newQty < 1) return;

    const token = localStorage.getItem("access_token");

    try {
      await axios.put(
        "http://127.0.0.1:8000/api/cart/update",
        {
          item_id: itemId,
          quantity: parseInt(newQty),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.log(error);
      alert("Failed to update quantity");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div>
      <UserHeader />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <h2>Your Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 20,
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Product</th>
                  <th style={th}>Price</th>
                  <th style={th}>Quantity</th>
                  <th style={th}>Subtotal</th>
                  <th style={th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td style={td}>{item.product.name}</td>
                    <td style={td}>${item.product.price}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>${item.quantity * item.product.price}</td>
                    <td style={td}>
                      <button
                        onClick={() => editItemQuantity(item.id)}
                        style={actionBtn}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        style={{ ...actionBtn, backgroundColor: "red" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div
              style={{
                marginTop: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3>Total: ${calculateTotal()}</h3>

              <div>
                <button
                  onClick={clearCart}
                  style={{
                    ...actionBtn,
                    backgroundColor: "orange",
                    marginRight: 10,
                  }}
                >
                  Clear Cart
                </button>

                <button
                  onClick={openCheckoutModal}
                  style={{ ...actionBtn, backgroundColor: "green" }}
                >
                  Create Order
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <UserFooter />

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div style={modalOverlayStyle} onClick={closeCheckoutModal}>
          <div
            style={modalStyle}
            onClick={(e) => {
              e.stopPropagation(); // prevent overlay click from closing when clicking inside modal
            }}
          >
            <h3 style={{ marginTop: 0 }}>Checkout</h3>
            <form onSubmit={createOrder}>
              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Address</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={labelStyle}>Mobile</label>
                <input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                  placeholder="01012345678"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={closeCheckoutModal}
                  disabled={checkoutLoading}
                  style={{
                    ...actionBtn,
                    backgroundColor: "#777",
                    marginRight: 8,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  style={{ ...actionBtn, backgroundColor: "green" }}
                >
                  {checkoutLoading ? "Placing..." : "OK"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const th = {
  borderBottom: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};
const td = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};
const actionBtn = {
  padding: "7px 12px",
  marginRight: 5,
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  borderRadius: 6,
};

/* Modal styles */
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};
const modalStyle = {
  width: 400,
  maxWidth: "90%",
  background: "white",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
};
const labelStyle = {
  display: "block",
  marginBottom: 6,
  fontWeight: "600",
};

export default UserCart;
