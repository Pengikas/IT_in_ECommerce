import useRecords from "../../hooks/useRecords";
import useWishlist from "../../hooks/useWishlist";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Empty from "../../components/common/EmptyState";
import ProductCard from "../../components/marketplace/ProductCard";
export default function Wishlist() {
  const query = useRecords("products");
  const wish = useWishlist();
  const rows = (query.data || []).filter(p => wish.ids.includes(p.id));
  return <div className="page">
      <Title eyebrow="BUYER / SAVED COMPONENTS" title="Wishlist" description="Your shortlist, ready when you are." />
      <State query={query}>
        {rows.length ? <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {rows.map(p => <ProductCard key={p.id} product={p} />)}
          </div> : <Empty title="Your shortlist is clear" text="Use the heart on a product card to save components." />}
      </State>
    </div>;
}
