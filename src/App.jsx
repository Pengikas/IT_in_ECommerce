import { Component, Suspense, lazy } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Layout, Guard, CartDrawer } from "./components/Shell";
import { Loading } from "./components/UI";
const modules = {
  Public: () => import("./pages/Public"),
  Fleet: () => import("./pages/Fleet"),
  Commerce: () => import("./pages/Commerce"),
  Supplier: () => import("./pages/Supplier"),
  Admin: () => import("./pages/Admin"),
  Account: () => import("./pages/Account"),
};
const page = (module, name) =>
  lazy(() => modules[module]().then((exports) => ({ default: exports[name] })));
const Home = page("Public", "Home"),
  Login = page("Public", "Login"),
  Register = page("Public", "Register"),
  Marketplace = page("Public", "Marketplace"),
  Product = page("Public", "ProductDetail"),
  How = page("Public", "HowItWorks");
const BuyerDashboard = page("Fleet", "Dashboard"),
  Engines = page("Fleet", "Engines"),
  Engine = page("Fleet", "EngineDetail"),
  RUL = page("Fleet", "RUL"),
  Recommendations = page("Fleet", "Recommendations"),
  Wishlist = page("Fleet", "Wishlist");
const Cart = page("Commerce", "Cart"),
  Checkout = page("Commerce", "Checkout"),
  Orders = page("Commerce", "Orders"),
  Order = page("Commerce", "OrderDetail");
const SellerDashboard = page("Supplier", "Dashboard"),
  SellerProducts = page("Supplier", "Products"),
  ProductForm = page("Supplier", "ProductForm"),
  Inventory = page("Supplier", "Inventory"),
  SellerOrders = page("Supplier", "SellerOrders"),
  Reviews = page("Supplier", "Reviews"),
  Analytics = page("Supplier", "Analytics");
const AdminDashboard = page("Admin", "Dashboard"),
  Users = page("Admin", "Users"),
  Companies = page("Admin", "Companies"),
  Suppliers = page("Admin", "Suppliers"),
  AdminProducts = page("Admin", "Products"),
  Categories = page("Admin", "Categories"),
  AdminOrders = page("Admin", "Orders"),
  Reports = page("Admin", "Reports"),
  System = page("Admin", "SystemStatus");
const Notifications = page("Account", "Notifications"),
  Profile = page("Account", "Profile"),
  Settings = page("Account", "Settings");
class Boundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="card p-8 m-6">
        <h1>Unable to display this page</h1>
        <p className="muted mt-3 mb-5">Reload the workspace and try again.</p>
        <button className="btn btn-primary" onClick={() => location.reload()}>
          Reload
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
export default function App() {
  return (
    <Boundary>
      <Suspense
        fallback={
          <div className="p-6">
            <Loading />
          </div>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="products/:id" element={<Product />} />
            <Route path="how-it-works" element={<How />} />
          </Route>
          <Route element={<Guard role="buyer" />}>
            <Route element={<Layout role="buyer" />}>
              <Route path="buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="buyer/engines" element={<Engines />} />
              <Route path="buyer/engines/:id" element={<Engine />} />
              <Route path="buyer/rul-analysis" element={<RUL />} />
              <Route
                path="buyer/recommendations"
                element={<Recommendations />}
              />
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
            <Route element={<Layout role="supplier" />}>
              <Route path="supplier/dashboard" element={<SellerDashboard />} />
              <Route path="supplier/products" element={<SellerProducts />} />
              <Route path="supplier/products/new" element={<ProductForm />} />
              <Route
                path="supplier/products/:id/edit"
                element={<ProductForm />}
              />
              <Route path="supplier/inventory" element={<Inventory />} />
              <Route path="supplier/orders" element={<SellerOrders />} />
              <Route path="supplier/reviews" element={<Reviews />} />
              <Route path="supplier/analytics" element={<Analytics />} />
              <Route path="supplier/store-profile" element={<Profile />} />
              <Route path="supplier/settings" element={<Settings />} />
            </Route>
          </Route>
          <Route element={<Guard role="admin" />}>
            <Route element={<Layout role="admin" />}>
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
          <Route
            path="*"
            element={
              <main className="card p-8 m-6">
                <h1>Page not found</h1>
                <Link className="btn btn-primary mt-5" to="/">
                  Back to AeroRUL
                </Link>
              </main>
            }
          />
        </Routes>
        <CartDrawer />
      </Suspense>
    </Boundary>
  );
}
