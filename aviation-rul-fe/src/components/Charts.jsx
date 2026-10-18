import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
export function Trend({ data = [] }) {
  return (
    <div
      className="chart"
      role="img"
      aria-label="Engine remaining useful life by operating cycle"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 15, right: 20, left: 0, bottom: 0 }}
        >
          <CartesianGrid stroke="#edf1f6" vertical={false} />
          <XAxis dataKey="cycle" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} />
          <Tooltip />
          <ReferenceLine y={20} stroke="#df6371" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="rul"
            stroke="#2387ab"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export function Sales({ orders = [] }) {
  const buckets = {};
  orders.forEach((o) => {
    const key = o.placedAt.slice(0, 7);
    buckets[key] = (buckets[key] || 0) + o.total;
  });
  const data = Object.entries(buckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month, revenue }));
  if (!data.length)
    return (
      <p className="muted p-8">Revenue trends appear after your first order.</p>
    );
  return (
    <div className="chart" role="img" aria-label="Order revenue by month">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 15, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} stroke="#edf1f6" />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => "$" + (v / 1000).toFixed(0) + "k"}
          />
          <Tooltip formatter={(v) => "$" + v.toLocaleString()} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2387ab"
            fill="#e5f2f8"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
