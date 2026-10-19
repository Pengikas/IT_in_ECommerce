import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Notice from "../../components/common/Notice";
export default function Reports() {
  const {
    db,
    action
  } = useApp();
  return <div className="page">
      <Title eyebrow="ADMIN / TRUST & QUALITY" title="Reviews & reports" description="Resolve sample marketplace quality reports." />
      <Notice>Sample moderation cases for interface demonstration.</Notice>
      <Table rows={db.reports} columns={[{
      key: "id",
      label: "Report"
    }, {
      key: "subject",
      label: "Issue"
    }, {
      key: "product",
      label: "Product"
    }, {
      key: "status",
      label: "Status"
    }, {
      key: "action",
      label: "Action",
      render: r => <Button tone="secondary" onClick={() => action("report:toggle", {
        id: r.id
      })}>
                {r.status === "Open" ? "Resolve" : "Reopen"}
              </Button>
    }]} />
    </div>;
}
