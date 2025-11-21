import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserCategoryProducts = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/category/${categoryId}`);
      setCategory(res.data);
    } catch (err) {
      console.log("Error fetching category", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/api/productsOfCategory/${categoryId}`
      );

      const productsWithImage = res.data.map((p) => ({
        ...p,
        image_url: p.imagepath
          ? `http://127.0.0.1:8000/storage/${p.imagepath}`
          : null,
      }));

      setProducts(productsWithImage);
    } catch (err) {
      setError("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <UserHeader />
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        {category ? `Products of ${category.name}` : "Products"}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 8,
              overflow: "hidden",
              textAlign: "center",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            {product.image_url ? (
              <Link to={`/user/product/${product.id}`}>
                <img
                  src={product.image_url}
                  alt={product.name}
                  style={{ width: "100%", height: 200, objectFit: "cover" }}
                />
              </Link>
            ) : (
              <div style={{ width: "100%", height: 200, backgroundColor: "#eee" }} />
            )}

            <div style={{ padding: "15px" }}>
              <h3 style={{ margin: "10px 0", fontSize: "18px" }}>
                {product.name}
              </h3>
              <p style={{ fontSize: "16px", fontWeight: "bold" }}>
                ${product.price}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {product.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <UserFooter />
    </div>
  );
};

export default UserCategoryProducts;
