export const API_MODE = import.meta.env.VITE_DATA_SOURCE === "api";
export const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "/api/v1"
).replace(/\/$/, "");
