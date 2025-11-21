import React, { useEffect, useState } from "react";
import UserHeader from '../../components/user/UserHeader'
import UserFooter from '../../components/user/UserFooter'


import axios from "axios";

const UserCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://127.0.0.1:8000/api/categories");
      // Add image_url if imagepath exists
      const categoriesWithImage = res.data.map((cat) => ({
        ...cat,
        image_url: cat.imagepath
          ? `http://127.0.0.1:8000/storage/${cat.imagepath}`
          : null,
      }));
      setCategories(categoriesWithImage);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <UserHeader/>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Categories</h2>
      
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onClick={() => {
              // هنا ممكن تحط navigation لصفحة المنتجات بتاعة ال category
              window.location.href = `/user/category/${cat.id}/products`;
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {cat.image_url ? (
              <img
                src={cat.image_url}
                alt={cat.name}
                style={{ width: "100%", height: 200, objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: 200, backgroundColor: "#eee" }} />
            )}
            <div style={{ padding: "15px" }}>
              <h3 style={{ margin: "10px 0", fontSize: "20px" }}>{cat.name}</h3>
              <p style={{ fontSize: "14px", color: "#555" }}>{cat.description}</p>
            </div>
          </div>
        ))}
      </div>
      <UserFooter/>
    </div>
  );
};

export default UserCategories;
