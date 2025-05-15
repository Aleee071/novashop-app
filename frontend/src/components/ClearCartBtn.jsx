import { useState } from "react";
import { Trash2, Stars } from "lucide-react";
import ConfirmationModal from "./ConfirmationModal";

export default function ClearCartButton({ onClearCart }) {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<button
				onClick={() => setShowModal(true)}
				className='group relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-br from-indigo-900 to-purple-900 border border-indigo-700 hover:from-indigo-800 hover:to-purple-800 transition-all duration-300 shadow-lg'
			>
				{/* Animated stars background */}
				<div className='absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300'>
					<div className='absolute top-1/4 left-1/4 animate-pulse'>
						<Stars size={12} className='text-white' />
					</div>
					<div className='absolute top-2/3 left-1/2 animate-pulse delay-75'>
						<Stars size={14} className='text-white' />
					</div>
					<div className='absolute top-1/3 left-3/4 animate-pulse delay-150'>
						<Stars size={10} className='text-white' />
					</div>
				</div>

				{/* Button content */}
				<div className='flex items-center space-x-2'>
					<Trash2
						size={16}
						className='text-red-300 group-hover:animate-bounce'
					/>
					<span className='text-sm font-medium text-white group-hover:text-red-200 transition-colors'>
						Clear Cart
					</span>
				</div>

				{/* Glow effect on hover */}
				<div className='absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/0 via-indigo-500/20 to-purple-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300'></div>
			</button>

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={onClearCart}
				title='Clear Your Cart?'
				message='Are you sure you want to remove all items from your cart? This action cannot be undone.'
			/>
		</>
	);
}
