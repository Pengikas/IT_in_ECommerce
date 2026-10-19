export default value => value ? new Date(value).toLocaleDateString("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric"
}) : "Not available";
