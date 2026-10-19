import { Link } from "react-router-dom";
import { scopedOrders } from "../../utils/supplierOrders";
import { useState } from "react";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
import date from "../../utils/date";
import stages from "../../utils/orderStages";
export default function SellerOrders() {
  const query = useRecords("orders");
  const {
    user,
    action
  } = useApp();
  const [filter, setFilter] = useState("");
  const rows = scopedOrders(query.data || [], user, API_MODE).filter(o => !filter || o.status === filter);
  return <div className="page">
      <Title eyebrow="SUPPLIER / FULFILMENT" title="Orders" description="Process the items assigned to your store." />
      <select aria-label="Filter seller order status" className="input w-auto max-w-xs" value={filter} onChange={e => setFilter(e.target.value)}>
        <option value="">All statuses</option>
        {stages.map(s => <option key={s}>{s}</option>)}
      </select>
      <State query={query}>
        <Table rows={rows} columns={[{
        key: "id",
        label: "Seller order"
      }, {
        key: "placedAt",
        label: "Placed",
        render: o => date(o.placedAt)
      }, {
        key: "items",
        label: "Your items",
        render: o => <span className="whitespace-normal text-xs">
                  {o.items?.map(i => `${i.product?.name || i.productId} × ${i.quantity}`).join(", ") || "Server seller order"}
                </span>
      }, {
        key: "total",
        label: "Item subtotal",
        render: o => money(o.total)
      }, {
        key: "status",
        label: "Status",
        render: o => <Badge>{o.status}</Badge>
      }, {
        key: "action",
        label: "Details",
        render: o => <Link className="btn btn-secondary compact" to={`/supplier/orders/${o.id}`}>View order</Link>
      }]} />
      </State>
    </div>;
}
