import handleToastPromise from "../../utils/handleToastPromise";
import { useDispatch } from "react-redux";
import { getOrdersByOwner } from "../../api/order";

function useFetchOrdersByOwner() {
	const dispatch = useDispatch();

	const fetch = async () =>
		await handleToastPromise(
			dispatch(getOrdersByOwner()).unwrap(),
			"Orders fetched successfully",
			"Failed to fetch orders"
		);

	return { fetch };
}

export default useFetchOrdersByOwner;
