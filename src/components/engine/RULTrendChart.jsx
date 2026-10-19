import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine } from "recharts";
export default function Trend({
  data = []
}) {
  return <div className="chart" role="img" aria-label="Engine remaining useful life by operating cycle">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{
        top: 15,
        right: 20,
        left: 0,
        bottom: 0
      }}>
          <CartesianGrid stroke="#edf1f6" vertical={false} />
          <XAxis dataKey="cycle" tick={{
          fontSize: 10
        }} />
          <YAxis tick={{
          fontSize: 10
        }} />
          <Tooltip />
          <ReferenceLine y={20} stroke="#df6371" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="rul" stroke="#2387ab" strokeWidth={2.5} dot={{
          r: 3
        }} />
        </LineChart>
      </ResponsiveContainer>
    </div>;
}
