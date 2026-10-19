import { useEffect, useState } from "react";
import { API_MODE } from "../services/config";
import * as remote from "../services/api";
import useApp from "./useApp";
export default function useRecords(resource, key = "") {
  const app = useApp();
  const [state, setState] = useState({
    data: null,
    loading: API_MODE,
    error: ""
  });
  useEffect(() => {
    if (!API_MODE) return;
    if (!key && ["history", "recommendations"].includes(resource)) {
      setState({
        data: resource === "history" ? [] : null,
        loading: false,
        error: ""
      });
      return;
    }
    let active = true;
    setState({
      data: null,
      loading: true,
      error: ""
    });
    remote.load(resource, key, app.user?.role).then(data => {
      if (active) setState({
        data,
        loading: false,
        error: ""
      });
    }).catch(e => {
      if (active) setState({
        data: null,
        loading: false,
        error: e.message
      });
    });
    return () => {
      active = false;
    };
  }, [resource, key, app.version, app.user?.id, app.user?.role]);
  return API_MODE ? state : {
    data: app.demoLoad(resource, key),
    loading: false,
    error: ""
  };
}
