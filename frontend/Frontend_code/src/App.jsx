import { Component, Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import BuyerLayout from "./layouts/BuyerLayout";
import SupplierLayout from "./layouts/SupplierLayout";
import AdminLayout from "./layouts/AdminLayout";
import Guard from "./routes/ProtectedRoute";
import CartDrawer from "./components/order/CartDrawer";
import Loading from "./components/common/Loading";
const Home = lazy(() => import("./pages/public/Home"));
const Login = lazy(() => import("./pages/public/Login"));
const Register = lazy(() => import("./pages/public/Register"));
const Marketplace = lazy(() => import("./pages/public/Marketplace"));
const Product = lazy(() => import("./pages/public/ProductDetail"));
const How = lazy(() => import("./pages/public/HowItWorks"));
const BuyerDashboard = lazy(() => import("./pages/buyer/Dashboard"));
const Engines = lazy(() => import("./pages/buyer/MyEngines"));
const Engine = lazy(() => import("./pages/buyer/EngineDetail"));
const RUL = lazy(() => import("./pages/buyer/RULAnalysis"));
const Recommendations = lazy(() => import("./pages/buyer/Recommendations"));
const Wishlist = lazy(() => import("./pages/buyer/Wishlist"));
const Cart = lazy(() => import("./pages/buyer/Cart"));
const Checkout = lazy(() => import("./pages/buyer/Checkout"));
const Orders = lazy(() => import("./pages/buyer/Orders"));
const Order = lazy(() => import("./pages/buyer/OrderDetail"));
const SellerDashboard = lazy(() => import("./pages/supplier/Dashboard"));
const SellerProducts = lazy(() => import("./pages/supplier/Products"));
const ProductForm = lazy(() => import("./pages/supplier/ProductForm"));
const Inventory = lazy(() => import("./pages/supplier/Inventory"));
const SellerOrderDetail = lazy(() => import("./pages/supplier/OrderDetail"));
const SellerOrders = lazy(() => import("./pages/supplier/Orders"));
const Reviews = lazy(() => import("./pages/supplier/Reviews"));
const Analytics = lazy(() => import("./pages/supplier/Analytics"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const Users = lazy(() => import("./pages/admin/Users"));
const Companies = lazy(() => import("./pages/admin/Companies"));
const Suppliers = lazy(() => import("./pages/admin/Suppliers"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const System = lazy(() => import("./pages/admin/SystemStatus"));
const Notifications = lazy(() => import("./pages/buyer/Notifications"));
const Profile = lazy(() => import("./pages/shared/BusinessProfile"));
const Settings = lazy(() => import("./pages/shared/AccountSettings"));
class Boundary extends Component {
  state = {
    error: false
  };
  static getDerivedStateFromError() {
    return {
      error: true
    };
  }
  render() {
    return this.state.error ? <main className="card p-8 m-6">
        <h1>Unable to display this page</h1>
        <p className="muted mt-3 mb-5">Reload the workspace and try again.</p>
        <button className="btn btn-primary" onClick={() => location.reload()}>
          Reload
        </button>
      </main> : this.props.children;
  }
}
export default function App() {
  return <Boundary>
      <Suspense fallback={<div className="p-6">
            <Loading />
          </div>}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="products/:id" element={<Product />} />
            <Route path="how-it-works" element={<How />} />
          </Route>
          <Route element={<Guard role="buyer" />}>
            <Route element={<BuyerLayout />}>
              <Route path="buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="buyer/engines" element={<Engines />} />
              <Route path="buyer/engines/:id" element={<Engine />} />
              <Route path="buyer/rul-analysis" element={<RUL />} />
              <Route path="buyer/recommendations" element={<Recommendations />} />
              <Route path="buyer/wishlist" element={<Wishlist />} />
              <Route path="buyer/cart" element={<Cart />} />
              <Route path="buyer/checkout" element={<Checkout />} />
              <Route path="buyer/orders" element={<Orders />} />
              <Route path="buyer/orders/:id" element={<Order />} />
              <Route path="buyer/notifications" element={<Notifications />} />
              <Route path="buyer/company-profile" element={<Profile />} />
              <Route path="buyer/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<Guard role="supplier" />}>
            <Route element={<SupplierLayout />}>
              <Route path="supplier/dashboard" element={<SellerDashboard />} />
              <Route path="supplier/products" element={<SellerProducts />} />
              <Route path="supplier/products/new" element={<ProductForm />} />
              <Route path="supplier/products/:id/edit" element={<ProductForm />} />
              <Route path="supplier/inventory" element={<Inventory />} />
              <Route path="supplier/orders" element={<SellerOrders />} />
              <Route path="supplier/orders/:id" element={<SellerOrderDetail />} />
              <Route path="supplier/reviews" element={<Reviews />} />
              <Route path="supplier/analytics" element={<Analytics />} />
              <Route path="supplier/store-profile" element={<Profile />} />
              <Route path="supplier/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<Guard role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="admin/dashboard" element={<AdminDashboard />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/companies" element={<Companies />} />
              <Route path="admin/suppliers" element={<Suppliers />} />
              <Route path="admin/products" element={<AdminProducts />} />
              <Route path="admin/categories" element={<Categories />} />
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="admin/reports" element={<Reports />} />
              <Route path="admin/rul-status" element={<System />} />
              <Route path="admin/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route path="*" element={<main className="card p-8 m-6">
                <h1>Page not found</h1>
                <Link className="btn btn-primary mt-5" to="/">
                  Back to AeroRUL
                </Link>
              </main>} />
        </Routes>
        <CartDrawer />
      </Suspense>
    </Boundary>;
}
