import { useNavigate } from "react-router-dom";
import useApp from "./useApp";
import { API_MODE } from "../services/config";
export default function useAddCart() {
  const {
    user,
    action,
    setDrawer
  } = useApp();
  const navigate = useNavigate();
  return async (product, quantity = 1, checkout = false) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user && user.role !== "buyer") throw Error("Sign in as a buyer to purchase components.");
    if (API_MODE && !product.listingId) throw Error("Select a seller offer first.");
    await action("cart:add", {
      product,
      quantity
    });
    if (checkout) {
      setDrawer(false);
      navigate(user ? "/buyer/checkout" : "/login?redirect=/buyer/checkout");
    } else setDrawer(true);
  };
}
