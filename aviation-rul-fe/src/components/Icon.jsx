const paths = {
  dashboard: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  plane: "M22 2 9 15 M22 2l-7 20-4-9-9-4z",
  search: "M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  cart: "M2 3h3l3 12h11l3-9H6 M9 21h.01 M18 21h.01",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4",
  box: "m12 2 10 5-10 5L2 7z M2 7v10l10 5 10-5V7 M12 12v10 M7 4l10 5",
  chart: "M3 3v18h18 M6 15l5-6 4 3 6-8",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z",
  settings:
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8 M9 2h6l1 4 4 1 2 5-3 3v5l-5 2-3-3H6l-4-5 3-3V6z",
  building: "M4 22V4h12v18 M16 10h5v12H2 M8 8h4 M8 12h4 M8 16h4",
  users:
    "M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3 M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M17 3a4 4 0 0 1 0 8 M22 21v-3a4 4 0 0 0-3-4",
  shield: "M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6z m-5 9 3 3 6-6",
  check: "m5 12 4 4L20 5",
  menu: "M3 6h18 M3 12h18 M3 18h18",
  close: "m6 6 12 12 M6 18 18 6",
  arrow: "M4 12h16 m-6-6 6 6-6 6",
  logout: "M9 3H3v18h6 M9 12h12 m-5-5 5 5-5 5",
  upload: "M12 16V3 m-5 5 5-5 5 5 M3 16v5h18v-5",
  filter: "M3 5h18 M6 12h12 M9 19h6",
  star: "m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z",
  alert: "m12 3 10 18H2z M12 9v5 M12 17h.01",
  clock: "M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
};
export default function Icon({ name = "box", size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.box} />
    </svg>
  );
}
