import { Route, Routes } from "react-router-dom";
import ScrollToTop from "./zinfrontend/components/ScrollToTop.jsx";
import UserAuthProvider from "./zinfrontend/context/UserAuthProvider.jsx";
import CartProvider from "./zinfrontend/context/CartContext.jsx";
import RootLayout from "./zinfrontend/_root/RootLayout.jsx";
import Home from "./zinfrontend/_root/pages/Home.jsx";
import ProductDetails from "./zinfrontend/components/ProductDetails.jsx";
import AllProducts from "./zinfrontend/_root/pages/AllProducts.jsx";
import FAQ from "./zinfrontend/components/FAQ.jsx";
import PrivacyPolicy from "./zinfrontend/components/PrivacyPolicy.jsx";
import ShippingReturnPolicy from "./zinfrontend/components/Shipping.jsx";
import TermsConditions from "./zinfrontend/components/Terms.jsx";
import About from "./zinfrontend/components/About.jsx";
import UserAuthLayout from "./zinfrontend/_auth/UserAuthLayout.jsx";
import UserLogin from "./zinfrontend/_auth/forms/UserLogin.jsx";
import UserSignup from "./zinfrontend/_auth/forms/UserSignup.jsx";
import Verification from "./zinfrontend/_auth/forms/Verification.jsx";
import AdminAuthProvider from "./zinadmin/context/AdminAuthProvider.jsx";
import AdminAuthLayout from "./zinadmin/_auth/AdminAuthLayout.jsx";
import AdminLogin from "./zinadmin/_auth/forms/AdminLogin.jsx";
import AdminSignUp from "./zinadmin/_auth/forms/AdminSignUp.jsx";
import AdminRootLayout from "./zinadmin/_root/AdminRootLayout.jsx";
import AdminDashboard from "./zinadmin/_root/pages/AdminDashboard.jsx";
import Product from "./zinadmin/_root/pages/Product.jsx";
import AddProducts from "./zinadmin/_root/pages/AddProducts.jsx";
import ProductList from "./zinadmin/components/ProductList.jsx";
import ProductProfile from "./zinadmin/_root/pages/ProductProfile.jsx";
import Users from "./zinadmin/_root/pages/Users.jsx";
import Admins from "./zinadmin/_root/pages/Admins.jsx";
import Configs from "./zinadmin/_root/pages/Configs.jsx";
import AddVariant from "./zinadmin/_root/pages/AddVariant.jsx";

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
                <RootLayout />
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
                <UserAuthLayout />
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
