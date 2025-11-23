import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("access_token");
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/admin/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setOrderInfo(res.data); 
        setOrderItems(res.data.items);
      } catch (error) {
        console.log("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order...</p>;
  if (!orderInfo) return <p>Order not found</p>;

  return (
    <div>
      <AdminHeader />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
        <h2>Order #{orderId}</h2>
        <p>Status: {orderInfo.status}</p>
        <p>Created At: {new Date(orderInfo.created_at).toLocaleString()}</p>

        <p>
          User: {orderInfo.user?.name} ({orderInfo.user?.email})
        </p>
        <p>
          Delivery Member: {orderInfo.delivery_member?.name || "Not assigned"}
        </p>

        {orderItems.length === 0 ? (
          <p>No items in this order.</p>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}
          >
            <thead>
              <tr>
                <th style={th}>Product</th>
                <th style={th}>Price</th>
                <th style={th}>Quantity</th>
                <th style={th}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item) => (
                <tr key={item.id}>
                  <td style={td}>{item.product?.name}</td>
                  <td style={td}>${item.product?.price}</td>
                  <td style={td}>{item.quantity}</td>
                  <td style={td}>${item.product?.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h3 style={{ marginTop: 20 }}>Total: ${orderInfo.total_price}</h3>
      </div>
      <AdminFooter />
    </div>
  );
};

const th = { borderBottom: "1px solid #ccc", padding: 10, textAlign: "left" };
const td = { padding: 10, borderBottom: "1px solid #eee" };

export default AdminOrderDetail;
