import Icon from "./Icon";
export default function Notice({
  children,
  error = false,
  success = false
}) {
  return <div role={error ? "alert" : "status"} className={"notice " + (error ? "notice-error" : success ? "notice-success" : "")}>
      <Icon name={error ? "alert" : "shield"} size={16} />
      <div>{children}</div>
    </div>;
}
