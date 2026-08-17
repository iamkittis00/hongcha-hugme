import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Reviews from "./pages/Reviews";
import About from "./pages/About";
import Account from "./pages/Account";
import Payment from "./pages/Payment";
import Login from "./pages/login";
import ModalLogin from "./components/ModalLogin";
import ModalRegister from "./components/ModalRegister";
import ModalForgotPassword from "./components/ModalForgotPassword";
import { useAuth } from "./context/AuthContext";

function App() {
  const { authModal, openAuthModal, closeAuthModal } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-hugme-bg text-content-primary">
      <ScrollToTop />
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/order-status" element={<OrderSuccess />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      <Footer />

      {authModal === "login" && (
        <ModalLogin
          isOpen={true}
          isModal={true}
          onClose={closeAuthModal}
          onSwitchToRegister={() => openAuthModal("register")}
          onSwitchToForgot={() => openAuthModal("forgot")}
        />
      )}

      {authModal === "register" && (
        <ModalRegister
          isOpen={true}
          isModal={true}
          onClose={closeAuthModal}
          onSwitchToLogin={() => openAuthModal("login")}
        />
      )}

      {authModal === "forgot" && (
        <ModalForgotPassword
          isOpen={true}
          isModal={true}
          onClose={closeAuthModal}
          onSwitchToLogin={() => openAuthModal("login")}
        />
      )}
    </div>
  );
}

export default App;
