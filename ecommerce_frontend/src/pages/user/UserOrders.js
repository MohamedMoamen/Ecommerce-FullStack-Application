import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sortedOrders = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
    } catch (error) {
      console.log("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // Determine row color based on status
  // =============================
  const getRowColor = (status) => {
    switch (status) {
      case "failed":
        return "#dc3545"; //red
      case "delivered":
        return "#28a745";//green
      case "pending":
        return "#ffffff";//white
      case "processing":
      case "assigned":
      case "on_the_way":
        return "#fff3cd"; //yellow
      default:
        return "#ffffff";
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <UserHeader />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <h2>Your Orders</h2>

        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
            <thead>
              <tr>
                <th style={th}>Order ID</th>
                <th style={th}>Total Price</th>
                <th style={th}>Status</th>
                <th style={th}>Address</th>
                <th style={th}>Mobile</th>
                <th style={th}>Created At</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ backgroundColor: getRowColor(order.status) }}>
                  <td style={td}>{order.id}</td>
                  <td style={td}>${order.total_price}</td>
                  <td style={td}>{order.status}</td>
                  <td style={td}>{order.address}</td>
                  <td style={td}>{order.mobile}</td>
                  <td style={td}>{new Date(order.created_at).toLocaleString()}</td>

                  <td style={td}>
                    <button
                      onClick={() => navigate(`/user/orders/${order.id}`)}
                      style={actionBtn}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <UserFooter />
    </div>
  );
};

const th = { borderBottom: "1px solid #ccc", padding: 10, textAlign: "left" };
const td = { padding: 10, borderBottom: "1px solid #eee" };
const actionBtn = {
  padding: "5px 10px",
  backgroundColor: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};

export default UserOrders;
