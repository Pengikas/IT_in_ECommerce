import { read } from "../services/demo/database";
import { useEffect, useState } from "react";
import { API_MODE } from "../services/config";
import useApp from "./useApp";
export default function useWishlist() {
  const {
    db,
    user,
    action,
    version,
    flash
  } = useApp();
  const key = `aerorul_api_wishlist_${user?.id || "guest"}`;
  const [saved, setSaved] = useState(() => read(key, []));
  useEffect(() => setSaved(read(key, [])), [key, version]);
  return {
    ids: user?.role === "buyer" ? API_MODE ? saved : db.wishlist[user.id] || [] : [],
    toggle: async id => {
      if (!user || user.role !== "buyer") {
        flash("Sign in as a buyer to save components.", true);
        return;
      }
      if (API_MODE) {
        const previous = read(key, []);
        const value = previous.includes(id) ? previous.filter(x => x !== id) : [...previous, id];
        localStorage.setItem(key, JSON.stringify(value));
        setSaved(value);
      } else await action("wishlist:toggle", {
        id
      });
    }
  };
}
