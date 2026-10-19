import { useState } from "react";
import useApp from "../../hooks/useApp";
import useRecords from "../../hooks/useRecords";
import Title from "../../components/common/PageTitle";
import State from "../../components/common/QueryState";
import Table from "../../components/common/DataTable";
import Button from "../../components/common/Button";
export default function Inventory() {
  const query = useRecords("listings");
  const {
    action,
    flash
  } = useApp();
  const [draft, setDraft] = useState({});
  return <div className="page">
      <Title eyebrow="SUPPLIER / INVENTORY" title="Inventory" description="Keep marketplace stock accurate and ready for procurement." />
      <State query={query}>
        <Table rows={query.data || []} columns={[{
        key: "name",
        label: "Component"
      }, {
        key: "partNumber",
        label: "Part number"
      }, {
        key: "stock",
        label: "Available units",
        render: p => <input className="input w-24" type="number" min="0" step="1" aria-label={"Stock for " + p.name} value={draft[p.id] ?? p.stock} onChange={e => setDraft({
          ...draft,
          [p.id]: e.target.value
        })} />
      }, {
        key: "action",
        label: "Action",
        render: p => <Button tone="secondary" onClick={async () => {
          await action("stock:update", {
            id: p.id,
            stock: Number(draft[p.id] ?? p.stock)
          });
          flash("Stock updated for " + p.partNumber);
        }}>
                  Update stock
                </Button>
      }]} />
      </State>
    </div>;
}
