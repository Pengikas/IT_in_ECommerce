import { useContext } from "react";
import { Context } from "../app/providers/AppContext";
export default function useApp() {
  return useContext(Context);
}
