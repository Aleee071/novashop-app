import { useDispatch } from "react-redux";
import { deleteOrder } from "../../api/order";
import handleToastPromise from "../../utils/handleToastPromise";

function useDeleteOrder() {
	const dispatch = useDispatch();

	const del = async (orderId) =>
		await handleToastPromise(
			dispatch(deleteOrder(orderId)).unwrap(),
			"Order deleted successfully",
			"Failed to delete order"
		);

	return { del };
}

export default useDeleteOrder;
