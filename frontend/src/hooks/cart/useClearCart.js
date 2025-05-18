import { useDispatch } from "react-redux";
import { clearCart } from "../../api/cart";
import handleToastPromise from "../../utils/handleToastPromise";

function useClearCart() {
	const dispatch = useDispatch();

	const clear = async () => {
		await handleToastPromise(
			dispatch(clearCart()).unwrap(),
			"🧹 Cart cleared successfully",
			"❌ Failed to clear cart"
		);
	};

	return clear;
}

export default useClearCart;
