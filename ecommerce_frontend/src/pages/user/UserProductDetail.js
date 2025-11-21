import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

const UserProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1); // NEW

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`http://127.0.0.1:8000/api/product/${productId}`);
      const productData = res.data;

      setProduct({
        ...productData,
        image_url: productData.imagepath
          ? `http://127.0.0.1:8000/storage/${productData.imagepath}`
          : null,
      });

      const catRes = await axios.get(
        `http://127.0.0.1:8000/api/category/${productData.category_id}`
      );
      setCategoryName(catRes.data.name);
    } catch (err) {
      setError(err.response?.data || "Error fetching product");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      const token = localStorage.getItem('access_token');

      await axios.post(
        "http://127.0.0.1:8000/api/cart/add",
        {
          product_id: product.id,
          quantity: quantity,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product added to cart successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (error) return <p style={{ color: "red" }}>{JSON.stringify(error)}</p>;
  if (!product) return <p>No product found</p>;

  return (
    <div>
      <UserHeader />

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
        <h2>{product.name}</h2>
        <p style={{ fontStyle: "italic" }}>{categoryName} Category</p>

        <img
          src={product.image_url}
          alt={product.name}
          style={{ width: "100%", objectFit: "cover", marginBottom: 20 }}
        />

        <p>{product.description}</p>
        <p style={{ fontWeight: "bold" }}>Price: ${product.price}</p>
        <p>Quantity Available: {product.quantity}</p>

        {/* SELECT QUANTITY */}
        <div style={{ marginTop: 20 }}>
          <label style={{ marginRight: 10 }}>Select Quantity:</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            style={{ padding: 5, fontSize: 16 }}
          >
            {Array.from({ length: product.quantity }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={addToCart}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            fontSize: 16,
            background: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add To Cart
        </button>
      </div>

      <UserFooter />
    </div>
  );
};

export default UserProductDetail;
