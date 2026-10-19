import Empty from "./EmptyState";
export default function Table({
  columns,
  rows = [],
  empty = "No records match your filters."
}) {
  if (!rows.length) return <Empty title="No matching records" text={empty} link={null} />;
  return <div className="card table-scroll" tabIndex={0} aria-label="Scrollable data table">
      <table>
        <thead>
          <tr>
            {columns.map(c => <th key={c.key}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => <tr key={r.id || i}>
              {columns.map(c => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}
            </tr>)}
        </tbody>
      </table>
    </div>;
}
