import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import Icon from "../common/Icon";
import ProductArt from "../marketplace/ProductArt";
import Button from "../common/Button";
import Notice from "../common/Notice";
import Loading from "../common/Loading";
import Empty from "../common/EmptyState";
import money from "../../utils/money";
export default function CartDrawer() {
  const {
    drawer
  } = useApp();
  return drawer ? <DrawerContent /> : null;
}
function DrawerContent() {
  const {
    drawer,
    setDrawer,
    user,
    action
  } = useApp();
  const query = useRecords("cart");
  const items = query.data || [];
  const ref = useRef(null);
  useEffect(() => {
    if (!drawer) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    const key = e => {
      if (e.key === "Escape") setDrawer(false);
      if (e.key === "Tab") {
        const nodes = ref.current.querySelectorAll("a,button,input");
        const first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, [drawer]);
  if (!drawer) return null;
  return <div className="dialog-overlay" onClick={() => setDrawer(false)}>
      <section className="drawer" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={e => e.stopPropagation()}>
        <header className="drawer-header">
          <div>
            <p className="eyebrow">PROCUREMENT</p>
            <h2 id="cart-title">
              Your cart ({items.reduce((s, i) => s + i.quantity, 0)})
            </h2>
          </div>
          <button className="icon-button" aria-label="Close cart" onClick={() => setDrawer(false)}>
            <Icon name="close" />
          </button>
        </header>
        <div className="drawer-body">
          {query.loading ? <Loading /> : query.error ? <Notice error>{query.error}</Notice> : !items.length ? <Empty title="Your cart is empty" text="Find the right component for your next mission." link={null} /> : items.map(item => <div key={item.id} className="drawer-item">
                <ProductArt product={item.product} className="h-20 w-20 shrink-0 rounded" />
                <div className="min-w-0 flex-1">
                  <Link to={`/products/${item.product.id}`} onClick={() => setDrawer(false)} className="text-xs font-semibold">
                    {item.product.name}
                  </Link>
                  <p className="mono tiny my-2">{money(item.product.price)}</p>
                  <div className="flex justify-between items-center gap-3">
                    <label className="tiny">
                      Qty{" "}
                      <input className="input quantity" aria-label={`Quantity for ${item.product.name}`} type="number" min="1" max={item.product.stock} value={item.quantity} onChange={e => {
                  const quantity = Number(e.target.value);
                  if (Number.isInteger(quantity) && quantity > 0) action("cart:update", {
                    id: item.id,
                    quantity
                  }).catch(() => {});
                }} />
                    </label>
                    <Button tone="ghost" className="compact text-critical" onClick={() => action("cart:remove", {
                id: item.id
              })}>
                      Remove
                    </Button>
                  </div>
                </div>
              </div>)}
        </div>
        <footer className="drawer-footer">
          <div className="flex justify-between font-semibold text-sm">
            <span>Subtotal</span>
            <span className="mono">
              {money(items.reduce((s, i) => s + i.product.price * i.quantity, 0))}
            </span>
          </div>
          <p className="tiny muted my-4">
            Shipping calculated at checkout · USD
          </p>
          {items.length > 0 ? <Link className="btn btn-primary w-full" onClick={() => setDrawer(false)} to={user ? "/buyer/checkout" : "/login?redirect=/buyer/checkout"}>
              Proceed to checkout <Icon name="arrow" size={14} />
            </Link> : <Link className="btn btn-primary w-full" onClick={() => setDrawer(false)} to="/marketplace">
              Browse marketplace
            </Link>}
        </footer>
      </section>
    </div>;
}
