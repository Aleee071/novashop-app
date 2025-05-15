import { Pencil } from "lucide-react";
import React from "react";

function OrderCard({ order, handleUpdateOrderStatus }) {
	if (!order) return null;

	const role = localStorage.getItem("role");
	const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});

	const getStatusColor = (status) => {
		switch (status?.toLowerCase()) {
			case "delivered":
				return "bg-green-900 bg-opacity-40 text-green-300 border-green-700";
			case "shipped":
				return "bg-yellow-700 bg-opacity-40 text-yellow-200 border-yellow-600";
			default:
				return "bg-indigo-900 bg-opacity-40 text-indigo-300 border-indigo-700";
		}
	};

	return (
		<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700 hover:border-indigo-700 transition-all duration-300'>
			{/* Header */}
			<div className='bg-gradient-to-r from-indigo-900 to-purple-900 bg-opacity-70 p-4 border-b border-gray-700'>
				<div className='flex flex-wrap items-center justify-between gap-2'>
					<div>
						<p className='text-xs text-gray-400'>Order ID</p>
						<h2 className='text-sm font-medium text-gray-200 font-mono'>
							{order?._id}
						</h2>
					</div>
					<div>
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
								order?.status
							)}`}
						>
							{order?.status || "Pending"}
						</span>
					</div>
				</div>
			</div>

			{/* Body */}
			<div className='p-4'>
				<div className='flex flex-wrap gap-4 mb-4'>
					<div className='flex-1 min-w-[120px]'>
						<p className='text-xs text-gray-400 mb-1'>Date</p>
						<p className='text-sm text-gray-300'>{formattedDate}</p>
					</div>

					{order.shippingAddress && (
						<div className='flex-2 min-w-[180px]'>
							<p className='text-xs text-gray-400 mb-1'>Ships to</p>
							<p className='text-sm text-gray-300 truncate max-w-xs'>
								{order.shippingAddress}
							</p>
						</div>
					)}
				</div>

				{/* Products */}
				<div className='space-y-3 mb-0'>
					<p className='text-xs text-gray-400 uppercase tracking-wider font-medium mb-0'>
						Products
					</p>
					{order?.products?.map((item, index) => (
						<div
							key={index}
							className='flex justify-between items-center py-3 border-b border-gray-700 last:border-0'
						>
							<div className='flex-1 pr-4'>
								<p className='text-sm font-medium text-gray-200 mb-1'>
									{item?.product?.name}
								</p>
								<p className='text-xs text-gray-400'>
									Sold by: {item?.owner?.fullname}
								</p>
							</div>
							<div className='flex items-center gap-6'>
								<div className='text-center'>
									<p className='text-xs text-gray-400'>Qty</p>
									<p className='text-sm font-medium text-gray-200'>
										{item?.quantity}
									</p>
								</div>
								<div className='text-right min-w-[60px]'>
									<p className='text-xs text-gray-400'>Price</p>
									<p className='text-sm font-medium text-gray-200'>
										${item?.product?.price}
									</p>
									{item?.product?.discount > 0 && (
										<p className='text-xs text-green-400 mt-1'>
											Discount: {item?.product?.discount}%
										</p>
									)}
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Total */}
				<div className='mt-6 pt-4 border-t border-gray-700'>
					<div className='flex flex-wrap items-center justify-between gap-4'>
						{/* Buttons - wrap on small screens */}
						{role === "owner" && (
							<div className='flex flex-wrap gap-2'>
								<button
									className='w-36 sm:w-32 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition'
									onClick={() => handleUpdateOrderStatus(order?._id)}
								>
									<Pencil size={16} />
									<span className='uppercase'>Update</span>
								</button>
							</div>
						)}

						{/* Total Amount */}
						<div className='text-right'>
							<p className='text-xs text-gray-400 mb-1'>Total Amount</p>
							<p className='text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
								${order.totalPrice?.toFixed(2)}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderCard;
