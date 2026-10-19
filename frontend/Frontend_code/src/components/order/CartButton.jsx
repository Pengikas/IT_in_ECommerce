import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import Icon from "../common/Icon";
export default function CartButton() {
  const { setDrawer } = useApp();
  const cart = useRecords("cart");
  const quantity = (cart.data || []).reduce((total, item) => total + Number(item.quantity || 0), 0);
  return <button className="icon-button cart-button" aria-label="Cart" aria-describedby="cart-count-description" onClick={() => setDrawer(true)}>
    <Icon name="cart" />
    {!cart.loading && !cart.error && quantity > 0 && <span className="cart-count" aria-hidden="true">{quantity > 99 ? "99+" : quantity}</span>}
    <span id="cart-count-description" className="sr-only" role="status">{cart.error ? "Cart count unavailable" : cart.loading ? "Loading cart" : `${quantity} items in cart`}</span>
  </button>;
}
