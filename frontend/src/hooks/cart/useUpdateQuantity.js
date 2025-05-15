import { useDispatch } from "react-redux";
import { updateQuantityInCart } from "../../api/cart";

function useUpdateQuantity() {
	const dispatch = useDispatch();

	const update = async (productId, newQuantity) => {
		try {
			await dispatch(
				updateQuantityInCart({
					productId: productId,
					quantity: newQuantity,
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	return { update };
}

export default useUpdateQuantity;
