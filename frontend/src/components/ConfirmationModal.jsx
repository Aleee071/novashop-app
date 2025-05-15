import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}) {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setIsVisible(true);
		} else {
			const timer = setTimeout(() => {
				setIsVisible(false);
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isOpen]);

	if (!isOpen && !isVisible) return null;

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
				isOpen ? "opacity-100" : "opacity-0"
			} transition-opacity duration-300`}
		>
			{/* Modal backdrop with cosmic background */}
			<div
				className='absolute inset-0 bg-gray-900/80 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Modal content */}
			<div
				className={`relative bg-gradient-to-br from-gray-800 via-indigo-950 to-gray-800 border border-indigo-700 rounded-xl shadow-2xl w-full max-w-md p-6 transform ${
					isOpen ? "scale-100" : "scale-95"
				} transition-all duration-300`}
			>
				{/* Decorative elements */}
				<div className='absolute -top-10 -left-10 w-40 h-40 bg-purple-500 rounded-full opacity-10 blur-3xl'></div>
				<div className='absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full opacity-10 blur-3xl'></div>

				{/* Close button */}
				<button
					onClick={onClose}
					className='absolute top-3 right-3 text-gray-400 hover:text-white p-1.5 rounded-full hover:bg-gray-700/50 transition-colors'
				>
					<X size={18} />
				</button>

				{/* Content */}
				<div className='flex flex-col items-center text-center'>
					<div className='h-14 w-14 bg-red-900/30 rounded-full flex items-center justify-center mb-4 border border-red-700'>
						<AlertTriangle size={28} className='text-red-400' />
					</div>

					<h3 className='text-xl font-bold text-white mb-2'>
						{title || "Confirm Action"}
					</h3>

					<p className='text-gray-300 mb-6'>
						{message || "Are you sure you want to proceed with this action?"}
					</p>

					<div className='flex gap-4 w-full'>
						<button
							onClick={onClose}
							className='flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors'
						>
							Cancel
						</button>

						<button
							onClick={() => {
								onConfirm();
								onClose();
							}}
							className='flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-medium shadow-lg shadow-red-900/30 transition-colors cursor-pointer'
						>
							Confirm
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
