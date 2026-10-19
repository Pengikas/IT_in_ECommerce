import { Navigate, Outlet } from "react-router-dom";
import useApp from "../hooks/useApp";
import Loading from "../components/common/Loading";
export default function Guard({
  role
}) {
  const {
    user,
    loading
  } = useApp();
  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <Outlet />;
}
