import { useDispatch } from "react-redux";
import handleToastPromise from "../../utils/handleToastPromise";
import { removeProductFromCart } from "../../api/cart";

function useRemoveItem() {
	const dispatch = useDispatch();

	const remove = async (productId) =>
		await handleToastPromise(
			dispatch(removeProductFromCart(productId)).unwrap(),
			"Product removed from cart successfully",
			"Failed to remove product from cart"
		);

	return { remove };
}

export default useRemoveItem;