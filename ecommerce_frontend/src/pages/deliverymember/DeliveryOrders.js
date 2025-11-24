import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DeliveryFooter from "../../components/deliverymember/DeliveryFooter";
import DeliveryHeader from "../../components/deliverymember/deliveryHeader";


const DeliveryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders("all");
  }, []);

  // =============================
  // Title Based on Status
  // =============================
  const getTitle = () => {
    if (selectedStatus === "all") return "All Orders";
    return selectedStatus.replace(/_/g, " ").toUpperCase() + " ORDERS";
  };

  // =============================
  // Fetch Orders by Status
  // =============================
  const fetchOrders = async (status = "all") => {
    const token = localStorage.getItem("access_token");

    try {
      let url = "";

      if (status === "all") {
        url = "http://127.0.0.1:8000/api/delivery/orders";
      } else {
        url = `http://127.0.0.1:8000/api/delivery/orders/${status}`;
      }

      const res = await axios.get(url, {
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

  // =============================
  // Update Status (on_the_way / delivered / failed)
  // =============================
  const updateStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("access_token");

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/delivery/orders/${orderId}/status`,
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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div>
      <DeliveryHeader />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
        <h2>{getTitle()} (Delivery Member)</h2>

        {/* ===========================
            Toggle Button Group
        ============================ */}
        <div style={{ marginBottom: 20 }}>
          {["all", "assigned", "on_the_way", "delivered", "failed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => {
                  setSelectedStatus(status);
                  setLoading(true);
                  fetchOrders(status);
                }}
                style={{
                  padding: "8px 14px",
                  marginRight: 10,
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  backgroundColor: selectedStatus === status ? "#444" : "#eee",
                  color: selectedStatus === status ? "white" : "black",
                  cursor: "pointer",
                }}
              >
                {status.toUpperCase().replace(/_/g, " ")}
              </button>
            )
          )}
        </div>

        {/* ===========================
            Orders Table
        ============================ */}
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
                     {/* if status is assigned make it as an option and make it disabled */}
                     {order.status === "assigned" && (
                       <option value="assigned" disabled>
                         assigned
                       </option>
                     )}
                 
                     {["on_the_way", "delivered", "failed"].map((s) => (
                       <option key={s} value={s}>
                         {s.replace(/_/g, " ")}
                       </option>
                     ))}
                   </select>
                 </td>


                <td style={td}>{order.address}</td>
                <td style={td}>{order.mobile}</td>

                <td style={td}>
                  {new Date(order.created_at).toLocaleString()}
                </td>

                <td style={td}>
                  <button
                    onClick={() =>
                      navigate(`/delivery/orders/${order.id}`)
                    }
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

      <DeliveryFooter />
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

export default DeliveryOrders;
