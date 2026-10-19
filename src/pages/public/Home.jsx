import { Link, useNavigate } from "react-router-dom";
import useRecords from "../../hooks/useRecords";
import Icon from "../../components/common/Icon";
import ProductArt from "../../components/marketplace/ProductArt";
import ProductCard from "../../components/marketplace/ProductCard";
import Button from "../../components/common/Button";
import Form from "../../components/common/Form";
import State from "../../components/common/QueryState";
import HowItWorks from "./HowItWorks";
export default function Home() {
  const products = useRecords("products");
  const categories = useRecords("categories");
  const suppliers = useRecords("suppliers");
  const navigate = useNavigate();
  return <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow text-sky-300 mb-6">
              PRECISION SOURCING. INFORMED DECISIONS.
            </p>
            <h1>The next mission starts with the right part.</h1>
            <p className="hero-copy">
              Connect your engine life insights to smarter sourcing. Discover
              compatible aviation components from verified suppliers, all in one
              workspace.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link className="btn btn-accent" to="/marketplace">
                Explore marketplace <Icon name="arrow" size={15} />
              </Link>
              <Link className="btn btn-outline" to="/buyer/rul-analysis">
                Analyse my engine
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <p className="eyebrow text-sky-200">FLEET INTELLIGENCE / ENG-037</p>
            <ProductArt product={{
            image: "engine",
            name: "Turbofan engine"
          }} className="h-60" />
            <div className="flex items-center justify-between border-t border-white/20 pt-5">
              <div>
                <p className="tiny text-slate-300">DEMO PREDICTED RUL</p>
                <strong className="mono text-3xl">
                  18 <span className="text-xs font-normal">cycles</span>
                </strong>
              </div>
              <span className="hero-status">Replacement planning</span>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-8">
        <Form className="card p-4 flex gap-3" onSubmit={data => navigate("/marketplace?q=" + encodeURIComponent(data.get("q")))}>
          <input className="input flex-1" name="q" aria-label="Find aviation parts" placeholder="Search part number, engine model or component…" />
          <Button type="submit">
            <Icon name="search" size={16} /> Search
          </Button>
        </Form>
      </section>
      <section className="container py-7">
        <div className="section-header">
          <div>
            <p className="eyebrow mb-2">BUILT AROUND YOUR FLEET</p>
            <h2>Explore aviation categories</h2>
          </div>
          <Link to="/marketplace?tab=categories">All categories →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {(categories.data || []).map(c => <Link key={c.id} className="card category-card" to={"/marketplace?category=" + c.id}>
              <Icon name="box" size={27} />
              <h3>{c.name}</h3>
              <span className="tiny muted">Explore components →</span>
            </Link>)}
        </div>
      </section>
      <section className="container py-8">
        <div className="section-header">
          <div>
            <p className="eyebrow mb-2">MISSION-READY SOURCING</p>
            <h2>Featured components</h2>
          </div>
          <Link to="/marketplace">View catalog →</Link>
        </div>
        <State query={products}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(products.data || []).slice(0, 3).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </State>
      </section>
      <section className="container py-9">
        <div className="section-header">
          <h2>Your global supplier network</h2>
          <Link to="/marketplace?tab=suppliers">View suppliers →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {(suppliers.data || []).map(s => <Link className="card p-6" key={s.id} to={"/marketplace?supplier=" + s.id}>
              <Icon name="building" size={26} />
              <h3 className="font-semibold mt-5 mb-2">{s.name}</h3>
              <p className="muted tiny">
                {s.region} · {s.rating} / 5
              </p>
              <p className="text-accent tiny mt-4">
                {s.verified ? "Verified supplier" : "Verification pending"} →
              </p>
            </Link>)}
        </div>
      </section>
      <HowItWorks compact />
    </>;
}
