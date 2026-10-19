import { useState } from "react";
import useApp from "../../hooks/useApp";
import Title from "../../components/common/PageTitle";
import Table from "../../components/common/DataTable";
export default function Companies() {
  const {
    db
  } = useApp();
  const [search, setSearch] = useState("");
  const companies = [...new Map(db.users.map(u => [u.companyName, {
    id: u.companyName,
    name: u.companyName,
    type: u.role === "buyer" ? "Airline / MRO buyer" : u.role === "supplier" ? "Aerospace supplier" : "Marketplace operator",
    email: u.email
  }])).values()];
  return <div className="page">
      <Title eyebrow="ADMIN / BUSINESS DIRECTORY" title="Companies & buyers" description="Sample organizations participating in this marketplace." />
      <input aria-label="Search companies" className="input max-w-md" placeholder="Search companies…" value={search} onChange={e => setSearch(e.target.value)} />
      <Table rows={companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))} columns={[{
      key: "name",
      label: "Company"
    }, {
      key: "type",
      label: "Business type"
    }, {
      key: "email",
      label: "Contact email"
    }]} />
    </div>;
}
