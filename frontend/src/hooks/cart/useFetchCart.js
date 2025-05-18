import { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../../api/cart";
import handleToastPromise from "../../utils/handleToastPromise";

function useFetchCart() {
	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.cart);

	const role = localStorage.getItem("role");
	const isUser = role === "user";

	const mountedRef = useRef(false);

	const refetch = useCallback(async () => {
		if (!isUser) return;

		await handleToastPromise(
			dispatch(getCart()).unwrap(),
			"🛒 Cart fetched successfully",
			"❌ Failed to fetch cart"
		);
	}, [dispatch]);

	useEffect(() => {
		if (!isUser) return;
		if (!mountedRef.current) {
			mountedRef.current = true;
			if (!cart?.products?.length) {
				refetch();
			}
		}
	}, [dispatch, cart?.products?.length, refetch, isUser]);

	return { refetch };
}

export default useFetchCart;
