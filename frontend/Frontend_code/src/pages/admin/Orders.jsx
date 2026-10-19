import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
import Badge from "../../components/common/Badge";
import money from "../../utils/money";
import date from "../../utils/date";
export default function Orders() {
  const {
    db
  } = useApp();
  return <div className="page">
      <Title eyebrow="ADMIN / PROCUREMENT OVERVIEW" title="Orders" description="Observe order activity; fulfilment belongs to the assigned supplier." />
      <Table rows={db.orders} columns={[{
      key: "id",
      label: "Order reference"
    }, {
      key: "placedAt",
      label: "Placed",
      render: o => date(o.placedAt)
    }, {
      key: "total",
      label: "Order value",
      render: o => money(o.total)
    }, {
      key: "status",
      label: "Status",
      render: o => <Badge>{o.status}</Badge>
    }]} />
    </div>;
}
