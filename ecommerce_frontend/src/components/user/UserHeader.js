import React, { useState } from "react";
import './UserHeader.css';
// import { FaShoppingCart, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
const UserHeader = () => {
  const [menu,setMenu]=useState("shop");
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        await axios.post('http://127.0.0.1:8000/api/user/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('role');

    navigate('/');
  };
  return (
    <div className="navbar">
        <div className="nav-logo">
            <img className="nav-logo-img" src={"/logo.png"} alt="logo"/>
            <p>SHOPPER</p>
        </div>
        <ul className="nav-menu">
            {/* <li onClick={()=>{setMenu("home")}}><Link style={{textDecoration:"none"}} to='/user/home'>Home</Link>{menu==="home"?<hr/>:<></>} </li> */}
            <li onClick={()=>{setMenu("categories")}}><Link style={{textDecoration:"none"}} to='/user/categories'>Categories</Link>{menu==="categories"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("products")}}><Link style={{textDecoration:"none"}} to='/user/products'>Products</Link>{menu==="products"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("orders")}}><Link style={{textDecoration:"none"}} to='/user/orders'>Orders</Link>{menu==="orders"?<hr/>:<></>}</li>
            <li onClick={()=>{setMenu("cart")}}><Link style={{textDecoration:"none"}} to='/user/cart'>Cart</Link>{menu==="cart"?<hr/>:<></>}</li>        
        </ul>
        <div className="nav-login-cart">
            <button onClick={handleLogout}>Logout</button>
            {/* <Link to='/cart'><img className="nav-cart-icon" src={cart_icon} alt=""/></Link> */}
        </div>
    </div>
  );
};

export default UserHeader;
