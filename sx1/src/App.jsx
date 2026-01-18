import { Route, Routes } from "react-router-dom";
import ScrollToTop from "@/sx1frontend/components/ScrollToTop.jsx";
import UserAuthProvider from "@/sx1frontend/context/UserAuthProvider.jsx";
import CartProvider from "@/sx1frontend/context/CartContext.jsx";
import WishlistProvider from "@/sx1frontend/context/WishlistContext.jsx";
import RootLayout from "@/sx1frontend/_root/RootLayout.jsx";
import Home from "@/sx1frontend/_root/pages/Home.jsx";
import ProductDetails from "@/sx1frontend/components/ProductDetails.jsx";
import AllProducts from "@/sx1frontend/_root/pages/AllProducts.jsx";
import FAQ from "@/sx1frontend/components/FAQ.jsx";
import PrivacyPolicy from "@/sx1frontend/components/PrivacyPolicy.jsx";
import ShippingReturnPolicy from "@/sx1frontend/components/Shipping.jsx";
import TermsConditions from "@/sx1frontend/components/Terms.jsx";
import About from "@/sx1frontend/components/About.jsx";
import UserAuthLayout from "@/sx1frontend/_auth/UserAuthLayout.jsx";
import UserLogin from "@/sx1frontend/_auth/forms/UserLogin.jsx";
import UserSignup from "@/sx1frontend/_auth/forms/UserSignup.jsx";
import Verification from "@/sx1frontend/_auth/forms/Verification.jsx";
import AdminAuthProvider from "@/sx1admin/context/AdminAuthProvider.jsx";
import AdminAuthLayout from "@/sx1admin/_auth/AdminAuthLayout.jsx";
import AdminLogin from "@/sx1admin/_auth/forms/AdminLogin.jsx";
import AdminSignUp from "@/sx1admin/_auth/forms/AdminSignUp.jsx";
import AdminRootLayout from "@/sx1admin/_root/AdminRootLayout.jsx";
import AdminDashboard from "@/sx1admin/_root/pages/AdminDashboard.jsx";
import Product from "@/sx1admin/_root/pages/Product.jsx";
import AddProducts from "@/sx1admin/_root/pages/AddProducts.jsx";
import ProductList from "@/sx1admin/components/ProductList.jsx";
import ProductProfile from "@/sx1admin/_root/pages/ProductProfile.jsx";
import Users from "@/sx1admin/_root/pages/Users.jsx";
import Admins from "@/sx1admin/_root/pages/Admins.jsx";
import Configs from "@/sx1admin/_root/pages/Configs.jsx";
import AddVariant from "@/sx1admin/_root/pages/AddVariant.jsx";

function App() {
  return (
    <main className="min-h-screen min-w-screen bg-dark-2 text-light-2">
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          element={
            <UserAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <RootLayout />
                </WishlistProvider>
              </CartProvider>
            </UserAuthProvider>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/allproducts" element={<AllProducts />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/shipping" element={<ShippingReturnPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/about" element={<About />} />
        </Route>

        <Route
          element={
            <UserAuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <UserAuthLayout />
                </WishlistProvider>
              </CartProvider>
            </UserAuthProvider>
          }
        >
          <Route path="/login" element={<UserLogin />} />
          <Route path="/signup" element={<UserSignup />} />
          <Route path="/verify" element={<Verification />} />
        </Route>

        {/* Admin Routes wrapped with AdminAuthProvider */}
        <Route
          element={
            <AdminAuthProvider>
              <AdminAuthLayout />
            </AdminAuthProvider>
          }
        >
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />
        </Route>

        <Route
          element={
            <AdminAuthProvider>
              <AdminRootLayout />
            </AdminAuthProvider>
          }
        >
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<Product />} />
          <Route path="/admin/addproducts" element={<AddProducts />} />
          <Route path="/admin/updateproducts" element={<ProductList />} />
          <Route path="/admin/deleteproducts" element={<ProductList />} />
          <Route path="/admin/productslist" element={<ProductProfile />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/admin-users" element={<Admins />} />
          <Route path="/admin/configs" element={<Configs />} />
          <Route path="/admin/addvariant" element={<AddVariant />} />
          <Route path="/admin/updatevariant" element={<AddVariant />} />
        </Route>
      </Routes>
    </main>
  );
}

export default App;
