import { useId } from "react";
export default function ProductArt({
  product = {},
  className = ""
}) {
  const key = useId().replace(/:/g, "");
  const type = product.image || "engine";
  const ring = ["bearing", "engine", "combustor", "compressor"].includes(type);
  return <div className={"product-art " + className} role="img" aria-label={(product.name || "Aircraft engine") + " — component illustration"}>
      <svg viewBox="0 0 420 260">
        <defs>
          <linearGradient id={key} x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#d4dfe6" />
            <stop offset=".4" stopColor="#778b9b" />
            <stop offset=".6" stopColor="#c1d0da" />
            <stop offset="1" stopColor="#526978" />
          </linearGradient>
        </defs>
        <ellipse cx="214" cy="221" rx="125" ry="8" fill="#597080" opacity=".12" />
        {ring ? <g transform="translate(210 130) rotate(-15)">
            <path d="M-90-68H60c95 0 95 140 0 140H-90Z" fill={`url(#${key})`} stroke="#62798b" />
            <ellipse cx="-83" cy="2" rx="68" ry="82" fill="#304758" stroke="#94a8b7" strokeWidth="8" />
            <ellipse cx="-83" cy="2" rx="53" ry="65" fill="#142e41" />
            {Array.from({
          length: type === "bearing" ? 12 : 22
        }, (_, i) => <path key={i} transform={`translate(-83 2) rotate(${i * 360 / (type === "bearing" ? 12 : 22)})`} d={type === "bearing" ? "M0-48a9 9 0 1 0 1 0" : "M0-14 10-60 1-63-9-24Z"} fill={i % 2 ? "#a8bac7" : "#6c879b"} stroke="#becbd5" strokeWidth=".5" />)}
            <ellipse cx="-83" cy="2" rx="14" ry="18" fill="#c1cfda" />
            <path d="M10-64v131M27-65v131M44-65v131M62-65v131" stroke="#526d80" strokeWidth="4" opacity=".6" />
            <path d="M-20-77h65v-12h-65z M-5 74h55v12H-5z" fill="#7f96a7" stroke="#4d687d" />
          </g> : type === "sensor" ? <g transform="translate(90 65)">
            <path d="m15 110 40-25 115-40" stroke="#526577" strokeWidth="9" fill="none" />
            <rect x="120" y="20" width="100" height="65" rx="9" fill={`url(#${key})`} stroke="#60798d" />
            <path d="M150 85v30h40V85" fill="#738b9e" />
            <circle cx="170" cy="48" r="18" fill="#2c4e64" />
          </g> : <g transform="translate(120 35) rotate(12 100 90)">
            {[0, 1, 2, 3, 4].map(i => <g transform={`translate(${i * 31} ${i % 2 * 5})`} key={i}>
                <path d="M0 145 10 116C-12 63 10 18 31 3c-9 42-1 69 4 105l8 21-15 22z" fill={`url(#${key})`} stroke="#567085" />
                <path d="m10 116 23-8 M10 126l27-8 M5 137l25-6" stroke="#345265" strokeWidth="3" />
              </g>)}
          </g>}
        <path d="M24 25h25M24 25v25M396 25h-25M396 25v25M24 235h25M24 235v-25M396 235h-25M396 235v-25" stroke="#c1ced8" />
      </svg>
      <span> AERORUL / COMPONENT REFERENCE</span>
    </div>;
}
