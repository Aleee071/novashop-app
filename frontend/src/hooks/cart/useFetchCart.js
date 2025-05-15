import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCart } from "../../api/cart";
import handleToastPromise from "../../utils/handleToastPromise";

let mountedRef = false;

function useFetchCart() {
	const role = localStorage.getItem("role");

	if (role !== "user") return {};

	const dispatch = useDispatch();
	const { cart } = useSelector((state) => state.cart);

	const refetch = useCallback(async () => {
		await handleToastPromise(
			dispatch(getCart()).unwrap(),
			"🛒 Cart fetched successfully",
			"❌ Failed to fetch cart"
		);
	}, [dispatch]);

	useEffect(() => {
		if (!mountedRef) {
			mountedRef = true;
			if (!cart?.products?.length) {
				refetch();
			}
		}
	}, [cart?.products?.length, dispatch, refetch]);

	return { refetch };
}

export default useFetchCart;
