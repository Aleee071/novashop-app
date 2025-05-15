import { useState } from "react";
import OrderCard from "../OrderCard";
import ProductCard from "../ProductCard";
import UpdateOrderStatusModal from "../UpdateOrderModal";
import { useDispatch } from "react-redux";
import {
	DollarSign,
	TrendingUp,
	ShoppingBag,
	Calendar,
	Clock,
	Truck,
	CheckCircle,
	Package,
	PackageX,
	PlusCircle,
} from "lucide-react";
import handleToastPromise from "../../utils/handleToastPromise";
import { updateOrder } from "../../api/order";

const ProductsTab = ({
	orders,
	products,
	searchTerm,
	PendingOrders,
	ShippedOrders,
	DeliveredOrders,
	filteredOrders,
}) => {
	let totalRevenue = orders?.reduce((total, order) => {
		if (order.status === "Delivered") {
			return total + order.totalPrice;
		}
		return total;
	}, 0);

	const dispatch = useDispatch();
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedOrderId, setSelectedOrderId] = useState(null);

	const handleModalOpen = (orderId) => {
		setModalOpen(true);
		setSelectedOrderId(orderId);
	};

	const selectedOrder = orders.find((order) => order._id === selectedOrderId);

	const handleModalClose = () => {
		setModalOpen(false);
		setSelectedOrderId(null);
	};

	const handleUpdateOrderStatus = async ({ orderId, status }) => {
		await handleToastPromise(
			dispatch(updateOrder({ orderId, status })).unwrap(),
			"Order updated successfully",
			"Failed to update order"
		);
	};

	return (
		<div>
			{/* Dashboard Stats */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
				<div className='bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider'>
								Total Revenue
							</p>
							<h3 className='text-2xl font-bold mt-1'>
								PKR {totalRevenue || 0}
							</h3>
						</div>
						<div className='p-3 bg-green-600 bg-opacity-20 rounded-full'>
							<DollarSign size={20} className='text-green-500' />
						</div>
					</div>
					<div className='mt-2 flex items-center text-xs text-green-500'>
						<TrendingUp size={14} className='mr-1' />
						<span>+5.3% from last month</span>
					</div>
				</div>

				<div className='bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider'>
								Total Orders
							</p>
							<h3 className='text-2xl font-bold mt-1'>{orders?.length || 0}</h3>
						</div>
						<div className='p-3 bg-indigo-600 bg-opacity-20 rounded-full'>
							<ShoppingBag size={20} className='text-indigo-500' />
						</div>
					</div>
					<div className='mt-2 flex items-center text-xs text-indigo-500'>
						<Calendar size={14} className='mr-1' />
						<span>Last 30 days</span>
					</div>
				</div>

				<div className='bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider'>
								Pending Orders
							</p>
							<h3 className='text-2xl font-bold mt-1'>
								{PendingOrders?.length || 0}
							</h3>
						</div>
						<div className='p-3 bg-blue-600 bg-opacity-20 rounded-full'>
							<Clock size={20} className='text-blue-500' />
						</div>
					</div>
					<div className='mt-2 flex items-center text-xs text-yellow-500'>
						<span>Needs attention</span>
					</div>
				</div>

				<div className='bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider'>
								Shipped Orders
							</p>
							<h3 className='text-2xl font-bold mt-1'>
								{ShippedOrders?.length || 0}
							</h3>
						</div>
						<div className='p-3 bg-yellow-600 bg-opacity-20 rounded-full'>
							<Truck size={20} className='text-yellow-500' />
						</div>
					</div>
					<div className='mt-2 flex items-center text-xs text-blue-500'>
						<span>On the way</span>
					</div>
				</div>

				<div className='bg-gray-900 rounded-lg p-4 border border-gray-800 shadow-lg'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-400 uppercase font-semibold tracking-wider'>
								Completed
							</p>
							<h3 className='text-2xl font-bold mt-1'>
								{DeliveredOrders?.length || 0}
							</h3>
						</div>
						<div className='p-3 bg-green-600 bg-opacity-20 rounded-full'>
							<CheckCircle size={20} className='text-green-500' />
						</div>
					</div>
					<div className='mt-2 flex items-center text-xs text-green-500'>
						<span>Successfully delivered</span>
					</div>
				</div>
			</div>

			{/* Products Section */}
			<div className='mb-6'>
				<div className='bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden'>
					<div className='px-6 py-4'>
						<div className='flex justify-between items-center border-b py-3 border-gray-800'>
							<h3 className='text-lg font-semibold'>My Products</h3>
							<span className='bg-gradient-to-r from-indigo-700 to-violet-500 px-3 py-1 rounded-lg shadow text-md'>
								{products?.length}
							</span>
						</div>

						{/* Horizontal Scroll Area */}
						{products?.length > 0 ? (
							<div className='py-4 overflow-x-auto custom-scrollbar'>
								<div className='flex items-stretch gap-4 w-max'>
									{products &&
										products?.length > 0 &&
										products.map((product) => (
											<div className='min-w-[320px]' key={product?._id}>
												<ProductCard product={product} variant='horizontal' />
											</div>
										))}
								</div>
							</div>
						) : (
							<div className='col-span-full mt-10 mb-10 text-center'>
								<PackageX className='mx-auto h-12 w-12 text-gray-400' />
								<p className='mt-4 text-lg font-semibold text-gray-600'>
									No products found
								</p>
								<p className='mt-2 text-sm text-gray-600'>
									Try adding some products to your inventory to get started
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Orders Section */}
			<div className='bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden'>
				<div className='flex items-center justify-between px-6 py-4 border-b border-gray-800'>
					<h3 className='text-lg font-semibold'>My Orders</h3>

					<div className='flex items-center space-x-2'>
						<select className='bg-gray-800 border border-gray-700 rounded text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
							<option>All Orders</option>
							<option>Pending</option>
							<option>Completed</option>
							<option>Cancelled</option>
						</select>

						<select className='bg-gray-800 border border-gray-700 rounded text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
							<option>Last 30 days</option>
							<option>Last 7 days</option>
							<option>Today</option>
							<option>All time</option>
						</select>
					</div>
				</div>

				<div className='p-6'>
					{filteredOrders?.length > 0 ? (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
							{filteredOrders.map((order) => (
								<OrderCard
									order={order}
									handleUpdateOrderStatus={() => handleModalOpen(order?._id)}
									key={order?._id}
								/>
							))}
						</div>
					) : (
						<div className='py-12 text-center'>
							<Package size={48} className='mx-auto text-gray-600 mb-4' />
							<h3 className='text-lg font-medium text-gray-400'>
								No orders found
							</h3>
							<p className='text-gray-500 text-sm mt-2'>
								{searchTerm
									? "Try adjusting your search"
									: "You don't have any orders yet"}
							</p>
						</div>
					)}
				</div>
				{filteredOrders?.length > 0 && (
					<div className='flex items-center justify-between px-6 py-4 border-t border-gray-800'>
						<p className='text-sm text-gray-400'>
							Showing {filteredOrders?.length} of {orders?.length || 0} orders
						</p>

						<div className='flex items-center space-x-1'>
							<button className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm'>
								Previous
							</button>
							<button className='px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-sm'>
								1
							</button>
							<button className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm'>
								2
							</button>
							<button className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm'>
								3
							</button>
							<button className='px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-sm'>
								Next
							</button>
						</div>
					</div>
				)}
			</div>
			<UpdateOrderStatusModal
				isOpen={modalOpen}
				onClose={handleModalClose}
				onConfirm={handleUpdateOrderStatus}
				order={selectedOrder}
			/>
		</div>
	);
};

export default ProductsTab;
