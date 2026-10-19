import { scopedOrders } from "../../utils/supplierOrders";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import { API_MODE } from "../../services/config";
import Title from "../../components/common/PageTitle";
import Stats from "../../components/common/StatsGrid";
import Table from "../../components/common/DataTable";
import Notice from "../../components/common/Notice";
import money from "../../utils/money";
import Sales from "../../components/charts/SalesChart";
export default function Analytics() {
  const query = useRecords("listings");
  const orders = useRecords("orders");
  const {
    user
  } = useApp();
  const mine = scopedOrders(orders.data || [], user, API_MODE);
  const rows = (query.data || []).map(p => {
    const items = mine.flatMap(o => o.items || []).filter(i => i.productId === p.id);
    return {
      ...p,
      units: items.reduce((s, i) => s + i.quantity, 0),
      revenue: items.reduce((s, i) => s + i.quantity * i.price, 0)
    };
  });
  return <div className="page">
      <Title eyebrow="SUPPLIER / BUSINESS INSIGHTS" title="Sales analytics" description="Understand store performance from recorded demo orders." />
      <Stats items={[{
      label: "TOTAL REVENUE",
      value: money(rows.reduce((s, p) => s + p.revenue, 0)),
      detail: "Recorded order item revenue",
      icon: "chart"
    }, {
      label: "UNITS SOLD",
      value: rows.reduce((s, p) => s + p.units, 0),
      detail: "All demo orders",
      icon: "box"
    }, {
      label: "SELLER ORDERS",
      value: mine.length,
      detail: "Containing your products",
      icon: "cart"
    }, {
      label: "LISTINGS",
      value: rows.length,
      detail: "Across all statuses",
      icon: "box"
    }]} />
      <section className="card p-6 min-w-0">
        <h2>Revenue over time</h2>
        <Sales orders={mine} />
      </section>
      <Table rows={rows.sort((a, b) => b.revenue - a.revenue)} columns={[{
      key: "name",
      label: "Product"
    }, {
      key: "units",
      label: "Units sold"
    }, {
      key: "revenue",
      label: "Revenue",
      render: r => money(r.revenue)
    }, {
      key: "stock",
      label: "Current stock"
    }]} />
      <Notice>Analytics summarize demonstration orders, not real sales.</Notice>
    </div>;
}
