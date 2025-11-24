import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";

const AdminHome = () => {
  const [counts, setCounts] = useState({
    users: 0,
    categoris: 0,
    products: 0,
    delivery_members: 0,
    delivered_orders: 0,
    top_products: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const res = await axios.get("http://127.0.0.1:8000/api/counts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCounts(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching counts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <AdminHeader />

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          padding: 20,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <Card title="Users" value={counts.users} color="#4caf50" />
        <Card title="Categories" value={counts.categories} color="#2196f3" />
        <Card title="Products" value={counts.products} color="#ff9800" />
        <Card title="Delivery Members" value={counts.delivery_members} color="#9c27b0" />
        <Card title="Delivered Orders" value={counts.delivered_orders} color="#009688" />
      </div>

      {/* Top Products Table */}
      <div style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
        <h2>Top 5 Selling Products</h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: 20,
          }}
        >
          <thead>
            <tr>
              <th style={th}>Product ID</th>
              <th style={th}>Name</th>
              <th style={th}>Total Sold</th>
            </tr>
          </thead>

          <tbody>
            {counts.top_products.map((p, index) => (
              <tr key={index}>
                <td style={td}>{p.product_id}</td>
                <td style={td}>{p.product_name}</td>
                <td style={td}>{p.total_sold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminFooter />
    </div>
  );
};

const Card = ({ title, value, color }) => {
  return (
    <div
      style={{
        padding: 20,
        height: 150,
        backgroundColor: color,
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: 32, margin: 0 }}>{value}</p>
    </div>
  );
};

const th = { borderBottom: "2px solid #ccc", padding: 10, textAlign: "left" };
const td = { padding: 10, borderBottom: "1px solid #eee" };

export default AdminHome;
