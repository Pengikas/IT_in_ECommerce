import { Link } from "react-router-dom";
import useWishlist from "../../hooks/useWishlist";
import ProductArt from "./ProductArt";
import Icon from "../common/Icon";
import Button from "../common/Button";
import money from "../../utils/money";
import useAddCart from "../../hooks/useAddCart";
export default function ProductCard({
  product: p,
  context = ""
}) {
  const wish = useWishlist();
  const add = useAddCart();
  return <article className="card product-card">
      <div className="product-image">
        <Link to={`/products/${p.id}${context}`}>
          <ProductArt product={p} className="h-44" />
        </Link>
        <button className={"save-button " + (wish.ids.includes(p.id) ? "saved" : "")} aria-label={(wish.ids.includes(p.id) ? "Remove from" : "Add to") + " wishlist: " + p.name} aria-pressed={wish.ids.includes(p.id)} onClick={() => wish.toggle(p.id)}>
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
            {p.deliveryDays ? p.deliveryDays + "-day delivery" : "Contact supplier"}
          </span>
        </div>
        <div className="product-bottom">
          <strong className="mono">{money(p.price)}</strong>
          <Button disabled={!p.stock} onClick={() => add(p)} className="compact">
            <Icon name="cart" size={12} /> Add to cart
          </Button>
        </div>
      </div>
    </article>;
}
