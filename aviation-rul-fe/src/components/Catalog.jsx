import { Link, useNavigate } from "react-router-dom";
import { useApp, useWishlist } from "../services/store";
import { API_MODE } from "../services/config";
import ProductArt from "./ProductArt";
import Icon from "./Icon";
import { Button, Badge, money } from "./UI";
export function useAddCart() {
  const { user, action, setDrawer } = useApp();
  const navigate = useNavigate();
  return async (product, quantity = 1, checkout = false) => {
    if (API_MODE && !user) {
      navigate("/login");
      return;
    }
    if (user && user.role !== "buyer")
      throw Error("Sign in as a buyer to purchase components.");
    if (API_MODE && !product.listingId)
      throw Error("Select a seller offer first.");
    await action("cart:add", { product, quantity });
    if (checkout) {
      setDrawer(false);
      navigate(user ? "/buyer/checkout" : "/login?redirect=/buyer/checkout");
    } else setDrawer(true);
  };
}
export default function ProductCard({ product: p, context = "" }) {
  const wish = useWishlist();
  const add = useAddCart();
  return (
    <article className="card product-card">
      <div className="product-image">
        <Link to={`/products/${p.id}${context}`}>
          <ProductArt product={p} className="h-44" />
        </Link>
        <button
          className={"save-button " + (wish.ids.includes(p.id) ? "saved" : "")}
          aria-label={
            (wish.ids.includes(p.id) ? "Remove from" : "Add to") +
            " wishlist: " +
            p.name
          }
          aria-pressed={wish.ids.includes(p.id)}
          onClick={() => wish.toggle(p.id)}
        >
          <Icon name="heart" size={16} />
        </button>
        <span className="image-label">{p.condition || "Available offers"}</span>
      </div>
      <div className="product-content">
        <p className="eyebrow">{p.compatibility.join(" / ")}</p>
        <h3>
          <Link to={`/products/${p.id}${context}`}>{p.name}</Link>
        </h3>
        <p className="mono tiny muted">P/N {p.partNumber}</p>
        <p className="tiny muted flex items-center gap-1">
          {p.supplier?.verified && <Icon name="shield" size={12} />}{" "}
          {p.supplier?.name || "Select supplier offer"}
        </p>
        <div className="flex justify-between tiny my-1">
          <span className={p.stock ? "text-success" : "text-critical"}>
            {p.stock ? `${p.stock} in stock` : "No stock available"}
          </span>
          <span>
            {p.deliveryDays
              ? p.deliveryDays + "-day delivery"
              : "Contact supplier"}
          </span>
        </div>
        <div className="product-bottom">
          <strong className="mono">{money(p.price)}</strong>
          <Button
            disabled={!p.stock}
            onClick={() => add(p)}
            className="compact"
          >
            <Icon name="cart" size={12} /> Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
