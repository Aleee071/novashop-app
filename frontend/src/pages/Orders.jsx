import { useState } from "react";
import { useSelector } from "react-redux";
import { Package, CreditCard, MapPin, Trash2 } from "lucide-react";
import Loading from "../components/Loading";
import ConfirmationModal from "../components/ConfirmationModal";
import { useFetchOrdersByUser, useDeleteOrder } from "../hooks/order";

export default function OrdersPage() {
	// Hooks
	useFetchOrdersByUser();
	const { del: deleteOrder } = useDeleteOrder();

	// Redux
	const { isLoading, ordersByUser, error } = useSelector(
		(state) => state.order
	);

	// States
	const [isOpen, setIsOpen] = useState(false);
	const [orderToBeDeleted, setOrderToBeDeleted] = useState(null);

	const handleDeleteOrder = async (orderId) => {
		await deleteOrder(orderId);
	};

	const handleModalOpen = (orderId) => {
		setIsOpen(true);
		setOrderToBeDeleted(orderId);
	};

	const handleModalClose = () => {
		setIsOpen(false);
		setOrderToBeDeleted(null);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100'>
			<ConfirmationModal
				isOpen={isOpen}
				onClose={handleModalClose}
				onConfirm={() => handleDeleteOrder(orderToBeDeleted)}
				title='Delete Order'
				message='Are you sure you want to delete this order?'
			/>
			<div className='relative max-w-5xl mx-auto px-4 py-12'>
				<h1 className='text-4xl font-bold text-white mb-8'>My Orders</h1>

				{isLoading ? (
					<Loading />
				) : error ? (
					<p className='text-red-400'>{error}</p>
				) : ordersByUser?.length === 0 ? (
					<p className='text-gray-400'>You haven't placed any orders yet.</p>
				) : (
					<div className='space-y-6'>
						{ordersByUser?.map((order) => (
							<div
								key={order._id}
								className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-lg border border-gray-700 p-6'
							>
								<div className='flex justify-between items-center mb-4'>
									<div className='flex items-center gap-3'>
										<Package className='text-indigo-400' size={20} />
										<h2 className='text-lg font-semibold'>
											#ORD-{order?._id?.slice(-5).toUpperCase()}
										</h2>
									</div>

									<div className='flex items-center gap-3'>
										<span className='text-sm text-gray-400'>
											{new Date(order?.createdAt)?.toLocaleDateString()}
										</span>
										<button
											onClick={() => handleModalOpen(order?._id)}
											className='text-red-500 hover:text-red-600 transition p-1 rounded-md hover:bg-red-500/10'
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>

								<p className='flex items-center text-md text-gray-400 mb-4'>
									<MapPin size={16} className='text-indigo-400 mr-2' /> Shipping
									to: {order?.shippingAddress}
								</p>

								<div className='flex flex-wrap gap-2 mb-3'>
									{order?.products?.map((p) => (
										<div
											key={p._id}
											className='bg-gray-700 px-3 py-1 rounded-lg text-sm text-gray-200'
										>
											{p.product?.name} × {p.quantity}
										</div>
									))}
								</div>

								<div className='flex justify-between items-center'>
									<div className='flex items-center text-sm text-gray-300 gap-2'>
										<CreditCard size={16} className='text-green-400' />
										<span>Paid</span>
									</div>
									<div className='text-lg font-bold text-white'>
										PKR {order?.totalPrice?.toFixed(2)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
