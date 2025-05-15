import { useDispatch } from "react-redux";
import { getOrdersByUser } from "../../api/order";
import handleToastPromise from "../../utils/handleToastPromise";
import { useEffect } from "react";

function useFetchOrdersByUser() {
	const dispatch = useDispatch();

	useEffect(() => {
		const fetch = async () =>
			await handleToastPromise(
				dispatch(getOrdersByUser()).unwrap(),
				"Orders fetched successfully",
				"Failed to fetch orders"
			);

		fetch();
	}, [dispatch]);
}

export default useFetchOrdersByUser;
