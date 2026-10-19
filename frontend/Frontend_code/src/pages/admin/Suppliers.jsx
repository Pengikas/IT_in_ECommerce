import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Notice from "../../components/common/Notice";
import Badge from "../../components/common/Badge";
export default function Suppliers() {
  const {
    db,
    action
  } = useApp();
  return <div className="page">
      <Title eyebrow="ADMIN / PARTNER NETWORK" title="Supplier verification" description="Review partners and maintain a trusted marketplace." />
      <Notice>
        These actions change local demo verification records only.
      </Notice>
      <Table rows={db.suppliers} columns={[{
      key: "name",
      label: "Business name"
    }, {
      key: "region",
      label: "Region"
    }, {
      key: "rating",
      label: "Demo rating"
    }, {
      key: "verified",
      label: "Verification",
      render: r => <Badge tone={r.verified ? "success" : "warn"}>
                {r.verified ? "Verified" : "Pending / suspended"}
              </Badge>
    }, {
      key: "action",
      label: "Action",
      render: r => <Button tone="secondary" onClick={() => action("supplier:toggle", {
        id: r.id
      })}>
                {r.verified ? "Suspend" : "Approve supplier"}
              </Button>
    }]} />
    </div>;
}
