import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryMembers, setDeliveryMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    fetchDeliveryMembers();
  }, []);

  const fetchOrders = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const sorted = res.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sorted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeliveryMembers = async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/delivery-members", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryMembers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // =============================
  // Update Status → processing
  // =============================
  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/admin/orders/${orderId}/processing`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const assignDelivery = async (orderId, deliveryMemberId) => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.post(
        `http://127.0.0.1:8000/api/orders/${orderId}/assign-delivery`,
        { delivery_member_id: deliveryMemberId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, delivery_member_id: deliveryMemberId, status: "assigned" }
            : o
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <AdminHeader />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2>All Orders (Admin)</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20,
          }}
        >
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>User</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
              <th style={th}>Address</th>
              <th style={th}>Mobile</th>
              <th style={th}>Delivery Member</th>
              <th style={th}>Created At</th>
              <th style={th}>Order Details</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td style={td}>{order.id}</td>

                <td style={td}>
                  {order.user?.name} <br />
                  <small>{order.user?.email}</small>
                </td>

                <td style={td}>${order.total_price}</td>

                {/* Status Dropdown */}
                <td style={td}>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                  >
                    <option value="pending">pending</option>
                    <option value="processing">processing</option>
                    <option value="assigned">assigned</option>
                  </select>
                </td>

                <td style={td}>{order.address}</td>
                <td style={td}>{order.mobile}</td>

                {/* Delivery Member Dropdown */}
                <td style={td}>
                  <select
                    value={order.delivery_member_id || ""}
                    onChange={(e) =>
                      assignDelivery(order.id, e.target.value)
                    }
                  >
                    <option value="">Select Delivery</option>
                    {deliveryMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={td}>
                  {new Date(order.created_at).toLocaleString()}
                </td>

                <td style={td}>
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    style={detailsBtn}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminFooter />
    </div>
  );
};

const th = { borderBottom: "2px solid #ccc", padding: 10, textAlign: "left" };
const td = { padding: 10, borderBottom: "1px solid #eee" };

const detailsBtn = {
  padding: "6px 12px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: 4,
};

export default AdminOrders;
