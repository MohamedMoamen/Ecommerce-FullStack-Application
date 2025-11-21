import React, { useEffect, useState } from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
import axios from "axios";

const AdminHome = () => {
  const [counts, setCounts] = useState({ users: 0, categories: 0, products: 0 });
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

      <div style={{ display: "flex", justifyContent: "space-around", margin: "30px 0" }}>
        {/* Users */}
        <div
          style={{
            width: 200,
            height: 150,
            backgroundColor: "#4caf50",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h3>Users</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{counts.users}</p>
        </div>

        {/* Categories */}
        <div
          style={{
            width: 200,
            height: 150,
            backgroundColor: "#2196f3",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h3>Categories</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{counts.categoris}</p>
        </div>

        {/* Products */}
        <div
          style={{
            width: 200,
            height: 150,
            backgroundColor: "#ff9800",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <h3>Products</h3>
          <p style={{ fontSize: 28, margin: 0 }}>{counts.products}</p>
        </div>
      </div>

      <AdminFooter />
    </div>
  );
};

export default AdminHome;
