import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../api/product";
import { getUser } from "../api/auth";
import { getOwner } from "../api/owner";
import handleToastPromise from "../utils/handleToastPromise";
import { useFetchCart } from "./cart";
// import Cookies from "js-cookie";

export default function useInitialFetch() {
	const { refetch: fetchCart } = useFetchCart();

	const { user, isLoading } = useSelector((state) => state.auth);
	const { owner, isLoading: ownerLoading } = useSelector(
		(state) => state.owner
	);
	const { cart } = useSelector((state) => state.cart);
	const { products = [] } = useSelector((state) => state.product);
	const dispatch = useDispatch();
	const role = localStorage.getItem("role");

	const userCart = user?.cart?.[0]?._id;

	useEffect(() => {
		// const token = Cookies.get("accessToken");

		const fetchData = async () => {
			const promises = [];

			if (role === "user" && !user?._id && !isLoading) {
				promises.push(
					handleToastPromise(
						dispatch(getUser()).unwrap(),
						"User fetched successfully",
						"Failed to fetch user"
					)
				);
			} else if (role === "owner" && !owner?._id && !ownerLoading) {
				promises.push(
					handleToastPromise(
						dispatch(getOwner()).unwrap(),
						"Owner fetched successfully",
						"Failed to fetch owner"
					)
				);
			}

			if (!products.length) {
				promises.push(
					handleToastPromise(
						dispatch(getProducts()).unwrap(),
						"Products fetched successfully",
						"Failed to fetch products"
					)
				);
			}

			try {
				await Promise.all(promises);
			} catch (error) {
				console.error("Error fetching initial data:", error);
			}
		};

		fetchData();
	}, [role, user?._id, owner?._id, products.length, userCart, cart?._id]);

	useEffect(() => {
		async function fetchCartData() {
			if (
				role === "user" &&
				!isLoading &&
				user?._id &&
				userCart !== cart?._id
			) {
				await fetchCart();
			}
		}

		fetchCartData();
	}, [dispatch, fetchCart, user?._id, userCart, cart?._id]);
}
