import React, { useEffect, useState } from "react";
import axios from "axios";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const createOrder = async () => {
    const token = localStorage.getItem("access_token");
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/cart/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order created successfully!");
      fetchCart();
    } catch (error) {
      console.log("Error creating order:", error.response?.data || error.message);
      alert("Failed to create order");
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

            <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Total: ${calculateTotal()}</h3>

              <div>
                <button
                  onClick={clearCart}
                  style={{ ...actionBtn, backgroundColor: "orange", marginRight: 10 }}
                >
                  Clear Cart
                </button>

                <button
                  onClick={createOrder}
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
  padding: "5px 10px",
  marginRight: 5,
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
};

export default UserCart;
