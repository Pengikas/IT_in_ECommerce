export default (value, currency = "USD") => value == null || !Number.isFinite(Number(value)) ? "No offer" : new Intl.NumberFormat("en-US", {
  style: "currency",
  currency,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
}).format(value);
