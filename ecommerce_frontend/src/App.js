import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminHome from "./pages/admin/AdminHome";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategoryProducts from "./pages/admin/AdminCategoryProducts";
import UserCategoryProducts from "./pages/user/UserCategoryProducts";
import UserProductDetail from "./pages/user/UserProductDetail"; // تأكد من مسار الملف

import UserHome from "./pages/user/UserHome";
import UserCategories from "./pages/user/UserCategories";
import UserProducts from "./pages/user/UserProducts";

import Login from "./components/Login";
import UserCart from './pages/user/UserCart';
import UserOrders from './pages/user/UserOrders';
import UserOrderDetail from './pages/user/UserOrderDetail';
import AdminDeliveryMembers from './pages/admin/AdminDeliveryMembers';
import DeliveryHome from './pages/deliverymember/DeliveryHome';

function App() {
  return (
    
    <div>
    <BrowserRouter>
          {/* <Login/> */}
      <Routes>

        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/categories" element={<AdminCategories />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/deliverymembers" element={<AdminDeliveryMembers />} />
        <Route path="/admin/category/:categoryId/products" element={<AdminCategoryProducts />} />

        {/* User Routes */}
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/categories" element={<UserCategories />} />
        <Route path="/user/products" element={<UserProducts />} />
        <Route path="/user/cart" element={<UserCart />} />
        <Route path="/user/orders" element={<UserOrders />} />
        <Route path="/user/category/:categoryId/products" element={<UserCategoryProducts />} />
        <Route path="/user/product/:productId" element={<UserProductDetail />} />
        <Route path="/user/orders/:orderId" element={<UserOrderDetail />} />
        

        {/* Delivery Member Routes */}
        <Route path="/delivery/home" element={<DeliveryHome />} />

      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;