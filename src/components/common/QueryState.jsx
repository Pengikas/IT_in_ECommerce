import Notice from "./Notice";
import Loading from "./Loading";
export default function State({
  query,
  children
}) {
  if (query.loading) return <Loading />;
  if (query.error) return <Notice error>
        {query.error}{" "}
        <button className="underline" onClick={() => location.reload()}>
          Retry
        </button>
      </Notice>;
  return children;
}
