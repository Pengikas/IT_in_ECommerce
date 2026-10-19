import { useState } from "react";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Notice from "../../components/common/Notice";
import Badge from "../../components/common/Badge";
export default function Users() {
  const {
    db,
    action
  } = useApp();
  const [search, setSearch] = useState("");
  return <div className="page">
      <Title eyebrow="ADMIN / ACCESS DIRECTORY" title="User management" description="Review sample accounts and their access status." />
      <Notice>
        This directory is a local UI demo. Suspension is not enforced by an
        identity server.
      </Notice>
      <input aria-label="Search users" className="input max-w-md" placeholder="Search name, company or email…" value={search} onChange={e => setSearch(e.target.value)} />
      <Table rows={db.users.filter(u => (u.name + u.companyName + u.email).toLowerCase().includes(search.toLowerCase()))} columns={[{
      key: "name",
      label: "User"
    }, {
      key: "companyName",
      label: "Company"
    }, {
      key: "email",
      label: "Business email"
    }, {
      key: "role",
      label: "Role"
    }, {
      key: "active",
      label: "Status",
      render: u => <Badge tone={u.active ? "success" : "warn"}>
                {u.active ? "Active" : "Suspended"}
              </Badge>
    }, {
      key: "action",
      label: "Action",
      render: u => u.role !== "admin" && <Button tone="secondary" onClick={() => action("user:toggle", {
        id: u.id
      })}>
                  {u.active ? "Suspend" : "Restore"}
                </Button>
    }]} />
    </div>;
}
