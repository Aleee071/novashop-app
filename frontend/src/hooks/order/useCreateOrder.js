import { useDispatch } from "react-redux";
import { createOrder } from "../../api/order";
import handleToastPromise from "../../utils/handleToastPromise";

export default function useCreateOrder() {
	const dispatch = useDispatch();

	const create = async (address) => {
		await handleToastPromise(
			dispatch(
				createOrder({
					shippingAddress: address,
				})
			).unwrap(),
			"✅ Order created successfully",
			"❌ Failed to create order"
		);
	};

	return create;
}
