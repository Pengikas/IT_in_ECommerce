import { useState } from "react";
import { Link } from "react-router-dom";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Table from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
export default function Products() {
  const query = useRecords("listings");
  const [search, setSearch] = useState("");
  const rows = (query.data || []).filter(p => (p.name + p.partNumber).toLowerCase().includes(search.toLowerCase()));
  return <div className="page">
      <Title eyebrow="SUPPLIER / PRODUCT CATALOG" title="Products" description="Manage your component listings and seller offers." action={<Link className="btn btn-primary" to="/supplier/products/new">
            Add product
          </Link>} />
      <input aria-label="Search listings" className="input max-w-md" placeholder="Search product or part number…" value={search} onChange={e => setSearch(e.target.value)} />
      <State query={query}>
        <Table rows={rows} columns={[{
        key: "name",
        label: "Component"
      }, {
        key: "partNumber",
        label: "Part number",
        render: p => <span className="mono tiny">{p.partNumber}</span>
      }, {
        key: "price",
        label: "Unit price",
        render: p => money(p.price)
      }, {
        key: "stock",
        label: "Stock"
      }, {
        key: "status",
        label: "Status",
        render: p => <Badge tone={p.status === "Active" ? "success" : ""}>
                  {p.status || "Active"}
                </Badge>
      }, {
        key: "action",
        label: "Action",
        render: p => <Link className="text-accent" to={`/supplier/products/${p.id}/edit`}>
                  Edit listing →
                </Link>
      }]} />
      </State>
    </div>;
}
