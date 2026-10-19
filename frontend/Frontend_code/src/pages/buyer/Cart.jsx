import { Link } from "react-router-dom";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import ProductArt from "../../components/marketplace/ProductArt";
import Icon from "../../components/common/Icon";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import Button from "../../components/common/Button";
import Field from "../../components/common/Field";
import Notice from "../../components/common/Notice";
import money from "../../utils/money";
export default function Cart() {
  const query = useRecords("cart");
  const {
    action,
    flash
  } = useApp();
  const items = query.data || [];
  return <div className="page">
      <Title eyebrow="PROCUREMENT / CART" title={`Your cart (${items.reduce((s, i) => s + i.quantity, 0)} items)`} description="Review your selected components before checkout." action={<Link className="btn btn-secondary" to="/marketplace">
            Continue sourcing →
          </Link>} />
      <State query={query}>
        {!items.length ? <Empty title="Your next mission starts here" text="Your cart is empty. Explore the catalog to find compatible components." /> : <div className="purchase-layout">
            <section className="card p-5">
              {items.map(item => <div key={item.id} className="cart-row">
                  <ProductArt product={item.product} className="w-24 h-24 rounded shrink-0" />
                  <div className="min-w-0 flex-1">
                    <Link className="text-xs font-semibold" to={"/products/" + item.product.id}>
                      {item.product.name}
                    </Link>
                    <p className="tiny mono muted my-2">
                      {item.product.partNumber}
                    </p>
                    <p className="tiny text-success">
                      {item.product.stock} available · {item.product.condition}
                    </p>
                    <Button tone="ghost" className="compact text-critical mt-2" onClick={() => action("cart:remove", {
                id: item.id
              })}>
                      Remove
                    </Button>
                  </div>
                  <div className="cart-price">
                    <b className="mono text-xs">
                      {money(item.product.price * item.quantity)}
                    </b>
                    <Field label="Quantity">
                      <input aria-label={"Quantity " + item.product.name} className="input w-20" type="number" min="1" max={item.product.stock} value={item.quantity} onChange={e => {
                  const quantity = Number(e.target.value);
                  if (Number.isInteger(quantity) && quantity > 0) action("cart:update", {
                    id: item.id,
                    quantity
                  }).catch(e => flash(e.message, true));
                }} />
                    </Field>
                  </div>
                </div>)}
            </section>
            <aside className="card p-6 h-fit">
              <h2 className="mb-6">Order summary</h2>
              <p className="flex justify-between text-xs mb-4">
                <span>Subtotal</span>
                <b className="mono">
                  {money(items.reduce((s, i) => s + i.product.price * i.quantity, 0))}
                </b>
              </p>
              <p className="tiny muted mb-5">
                Shipping calculated at checkout.
              </p>
              <Link className="btn btn-primary w-full" to="/buyer/checkout">
                Proceed to checkout <Icon name="arrow" size={14} />
              </Link>
              <div className="mt-5">
                <Notice>
                  {API_MODE ? "The server revalidates stock and final prices." : "Demo procurement · No real charge."}
                </Notice>
              </div>
            </aside>
          </div>}
      </State>
    </div>;
}
