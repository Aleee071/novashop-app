import { useDispatch } from "react-redux";
import { getProductsByOwner } from "../../api/product";
import handleToastPromise from "../../utils/handleToastPromise";

function useFetchProductsByOwner() {
	const dispatch = useDispatch();

	const fetch = async () =>
		await handleToastPromise(
			dispatch(getProductsByOwner()).unwrap(),
			"Products fetched successfully",
			"Failed to fetch products"
		);

	return { fetch };
}

export default useFetchProductsByOwner;
