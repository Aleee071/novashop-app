import React, { useMemo } from "react";
import { Package, Clock, TruckIcon, CheckCircle } from "lucide-react";

function Stats({ orders }) {
	if (!orders) return null;

	// Move calculations outside of useState to fix the logic
	const totalOrders = orders?.length;

	// Calculate total amount from all orders
	const totalAmount = useMemo(() => {
		return orders.reduce((sum, order) => {
			return sum + (order.totalPrice || 0);
		}, 0);
	}, [orders]);

	// Filter orders by status
	const pendingOrders = orders.filter(
		(order) => order.status?.toLowerCase() === "pending"
	);
	const shippedOrders = orders.filter(
		(order) => order.status?.toLowerCase() === "shipped"
	);
	const deliveredOrders = orders.filter(
		(order) => order.status?.toLowerCase() === "delivered"
	);

	return (
		<div className='space-y-6 mt-6'>
			{/* Main stats grid */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				{/* Total Orders Card */}
				<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl hover:border-indigo-700 transition-all duration-300'>
					<div className='flex items-center mb-4'>
						<div className='bg-indigo-900 bg-opacity-70 p-3 rounded-lg mr-3'>
							<Package size={20} className='text-indigo-400' />
						</div>
						<h3 className='text-gray-400 text-sm uppercase font-semibold'>
							Total Orders
						</h3>
					</div>
					<div className='mt-2'>
						<span className='text-3xl font-bold text-gray-200'>
							{totalOrders}
						</span>
					</div>
					<div className='mt-4 text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
						Lifetime orders
					</div>
				</div>

				{/* Total Spent Card */}
				<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl hover:border-purple-700 transition-all duration-300'>
					<div className='flex items-center mb-4'>
						<div className='bg-purple-900 bg-opacity-70 p-3 rounded-lg mr-3'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='text-purple-400'
							>
								<path
									d='M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C10.54 10.69 9.97 10.2 9.97 9.47C9.97 8.63 10.76 8.04 12.07 8.04C13.45 8.04 13.97 8.7 14.01 9.68H15.72C15.67 8.34 14.85 7.11 13.23 6.71V5H10.9V6.69C9.39 7.01 8.18 7.97 8.18 9.47C8.18 11.21 9.67 12.08 11.84 12.61C13.79 13.08 14.18 13.74 14.18 14.47C14.18 15 13.71 15.87 12.09 15.87C10.58 15.87 9.93 15.14 9.83 14.23H8.1C8.2 15.85 9.4 16.9 10.9 17.21V19H13.24V17.22C14.75 16.93 15.97 16.06 15.97 14.47C15.96 12.36 14.07 11.59 12.31 11.14Z'
									fill='currentColor'
								/>
							</svg>
						</div>
						<h3 className='text-gray-400 text-sm uppercase font-semibold'>
							Total Spent
						</h3>
					</div>
					<div className='mt-2'>
						<span className='text-3xl font-bold text-gray-200'>
							RS {totalAmount.toFixed(2)}
						</span>
					</div>
					<div className='mt-4 text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
						Total purchases
					</div>
				</div>

				{/* Average Order Card */}
				<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl hover:border-blue-700 transition-all duration-300'>
					<div className='flex items-center mb-4'>
						<div className='bg-blue-900 bg-opacity-70 p-3 rounded-lg mr-3'>
							<svg
								width='20'
								height='20'
								viewBox='0 0 24 24'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='text-blue-400'
							>
								<path
									d='M3 13H5V11H3V13ZM3 17H5V15H3V17ZM3 9H5V7H3V9ZM7 13H21V11H7V13ZM7 17H21V15H7V17ZM7 7V9H21V7H7Z'
									fill='currentColor'
								/>
							</svg>
						</div>
						<h3 className='text-gray-400 text-sm uppercase font-semibold'>
							Average Order
						</h3>
					</div>
					<div className='mt-2'>
						<span className='text-3xl font-bold text-gray-200'>
							RS{" "}
							{totalOrders > 0
								? (totalAmount / totalOrders).toFixed(2)
								: "0.00"}
						</span>
					</div>
					<div className='mt-4 text-sm bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
						Per order average
					</div>
				</div>
			</div>

			{/* Order Status Cards */}
			<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 border border-gray-700 shadow-xl'>
				<h2 className='text-xl font-bold text-gray-200 mb-6'>Order Status</h2>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{/* Pending Orders */}
					<div className='bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600'>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='text-gray-300 font-medium'>Pending</h3>
							<div className='bg-yellow-900 bg-opacity-30 p-2 rounded-md'>
								<Clock size={16} className='text-yellow-400' />
							</div>
						</div>
						<div className='flex items-end justify-between'>
							<span className='text-2xl font-bold text-gray-200'>
								{pendingOrders.length}
							</span>
							<span className='text-sm text-yellow-400'>
								{totalOrders > 0
									? ((pendingOrders.length / totalOrders) * 100).toFixed(0)
									: 0}
								%
							</span>
						</div>
						<div className='mt-4 w-full bg-gray-600 rounded-full h-1.5'>
							<div
								className='bg-gradient-to-r from-yellow-500 to-yellow-300 h-1.5 rounded-full'
								style={{
									width:
										totalOrders > 0
											? `${(pendingOrders.length / totalOrders) * 100}%`
											: "0%",
								}}
							></div>
						</div>
					</div>

					{/* Shipped Orders */}
					<div className='bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600'>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='text-gray-300 font-medium'>Shipped</h3>
							<div className='bg-blue-900 bg-opacity-30 p-2 rounded-md'>
								<TruckIcon size={16} className='text-blue-400' />
							</div>
						</div>
						<div className='flex items-end justify-between'>
							<span className='text-2xl font-bold text-gray-200'>
								{shippedOrders.length}
							</span>
							<span className='text-sm text-blue-400'>
								{totalOrders > 0
									? ((shippedOrders.length / totalOrders) * 100).toFixed(0)
									: 0}
								%
							</span>
						</div>
						<div className='mt-4 w-full bg-gray-600 rounded-full h-1.5'>
							<div
								className='bg-gradient-to-r from-blue-500 to-blue-300 h-1.5 rounded-full'
								style={{
									width:
										totalOrders > 0
											? `${(shippedOrders.length / totalOrders) * 100}%`
											: "0%",
								}}
							></div>
						</div>
					</div>

					{/* Delivered Orders */}
					<div className='bg-gray-700 bg-opacity-50 rounded-lg p-4 border border-gray-600'>
						<div className='flex items-center justify-between mb-3'>
							<h3 className='text-gray-300 font-medium'>Delivered</h3>
							<div className='bg-green-900 bg-opacity-30 p-2 rounded-md'>
								<CheckCircle size={16} className='text-green-400' />
							</div>
						</div>
						<div className='flex items-end justify-between'>
							<span className='text-2xl font-bold text-gray-200'>
								{deliveredOrders.length}
							</span>
							<span className='text-sm text-green-400'>
								{totalOrders > 0
									? ((deliveredOrders.length / totalOrders) * 100).toFixed(0)
									: 0}
								%
							</span>
						</div>
						<div className='mt-4 w-full bg-gray-600 rounded-full h-1.5'>
							<div
								className='bg-gradient-to-r from-green-500 to-green-300 h-1.5 rounded-full'
								style={{
									width:
										totalOrders > 0
											? `${(deliveredOrders.length / totalOrders) * 100}%`
											: "0%",
								}}
							></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Stats;
