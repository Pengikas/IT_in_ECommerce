import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
export default function Sales({
  orders = []
}) {
  const buckets = {};
  orders.forEach(o => {
    const key = o.placedAt.slice(0, 7);
    buckets[key] = (buckets[key] || 0) + o.total;
  });
  const data = Object.entries(buckets).sort(([a], [b]) => a.localeCompare(b)).map(([month, revenue]) => ({
    month,
    revenue
  }));
  if (!data.length) return <p className="muted p-8">Revenue trends appear after your first order.</p>;
  return <div className="chart" role="img" aria-label="Order revenue by month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{
        top: 20,
        right: 15,
        left: 0,
        bottom: 0
      }}>
          <CartesianGrid vertical={false} stroke="#edf1f6" />
          <XAxis dataKey="month" tick={{
          fontSize: 10
        }} />
          <YAxis tick={{
          fontSize: 10
        }} tickFormatter={v => "$" + (v / 1000).toFixed(0) + "k"} />
          <Tooltip formatter={v => "$" + v.toLocaleString()} />
          <Area type="monotone" dataKey="revenue" stroke="#2387ab" fill="#e5f2f8" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>;
}
