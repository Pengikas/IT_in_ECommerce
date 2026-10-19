import { useState } from "react";
import { Link } from "react-router-dom";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Table from "../../components/common/DataTable";
import Timeline from "../../components/order/OrderStatusTimeline";
import money from "../../utils/money";
import date from "../../utils/date";
import stages from "../../utils/orderStages";
export default function Orders() {
  const query = useRecords("orders");
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const rows = (query.data || []).filter(o => (!filter || o.status === filter) && o.id.toLowerCase().includes(search.toLowerCase()));
  return <div className="page">
      <Title eyebrow="BUYER / PROCUREMENT" title="Orders" description="Track your sourcing activity from placement to delivery." />
      <div className="toolbar">
        <input aria-label="Search orders" className="input max-w-md" placeholder="Search order reference…" value={search} onChange={e => setSearch(e.target.value)} />
        <select className="input w-auto" aria-label="Filter order status" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All statuses</option>
          {stages.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      <State query={query}>
        <Table rows={rows} columns={[{
        key: "id",
        label: "Order reference",
        render: o => <Link className="mono text-accent" to={"/buyer/orders/" + o.id}>
                  {o.id}
                </Link>
      }, {
        key: "placedAt",
        label: "Placed",
        render: o => date(o.placedAt)
      }, {
        key: "total",
        label: "Total",
        render: o => money(o.total)
      }, {
        key: "status",
        label: "Order progress",
        render: o => <Timeline status={o.status} />
      }]} />
      </State>
    </div>;
}
