import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function UpdateOrderStatusModal({ isOpen, onClose, onConfirm, order }) {
	const [isVisible, setIsVisible] = useState(false);
	const [status, setStatus] = useState(order?.status);		

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 300); // Wait for fade-out animation
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	useEffect(() => {
		if (order) {
			setStatus(order.status);
		}
	}, [order?.status]);

	const handleStatusChange = (e) => {
		setStatus(e.target.value);
	};	

	if (!isOpen && !isVisible) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
				isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
			} bg-black/50 backdrop-blur-sm`}
		>
			<div
				className={`relative w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-6 text-white shadow-xl transform transition-all duration-300 ${
					isOpen ? "scale-100" : "scale-95"
				}`}
			>
				{/* Close Button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 text-white/70 hover:text-white transition'
				>
					<X className='w-5 h-5' />
				</button>

				<h2 className='text-xl font-semibold mb-4 text-center'>
					Update Order Status
				</h2>

				<p className='text-sm text-gray-200 text-center mb-6'>
					Select the current status for order -{" "}
					<span className='font-semibold text-white'>
						#{order?._id?.slice(-5)}
					</span>{" "}
				</p>
				<div className='flex justify-center my-4'>
					<select
						id='status'
						name='status'
						value={status}
						onChange={handleStatusChange}
						className=' px-3 py-2 rounded-md bg-gradient-to-b from-violet-700 to-indigo-600 outline-0'
					>
						{["Pending", "Shipped", "Delivered"].map((status) => (
							<option
								key={status}
								className=' bg-black/90 border-0 outline-0'
								value={status}
							>
								{status}
							</option>
						))}
					</select>
				</div>

				<div className='flex justify-center gap-3'>
					<button
						onClick={onClose}
						className='px-4 py-1.5 rounded-md border border-white/30 hover:bg-white/10 transition'
					>
						Cancel
					</button>
					<button
						onClick={() => {
							onConfirm({ orderId: order?._id, status });
							onClose();
						}}
						className='px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition'
					>
						Confirm
					</button>
				</div>
			</div>
		</div>
	);
}

export default UpdateOrderStatusModal;
