import { Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useUpdateQuantity, useRemoveItem, useFetchCart } from "../hooks/cart";

export default function CartItem({ item, baseUrl }) {
	const { update: updateQuantityInCart } = useUpdateQuantity();
	const { remove: removeProductFromCart } = useRemoveItem();
	const { refetch: refetchCart } = useFetchCart();

	if (!item) return null;

	const discountedPrice =
		item.product.price - item.product.price * (item.product.discount / 100);

	const [quantity, setQuantity] = useState(item.quantity);

	const handleQuantityChange = async (newQuantity) => {
		if (newQuantity < 0) return;
		if (item.product.stock === 0 && newQuantity > quantity) return;
		setQuantity(newQuantity);

		await updateQuantityInCart(item.product._id, newQuantity);
	};

	const handleRemoveItem = async (productId) => {
		try {
			await removeProductFromCart(productId);
			await refetchCart();
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<div className='relative flex flex-col sm:flex-row items-center p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-gray-700 hover:border-gray-600 transition duration-200'>
			{/* Product Image */}
			<div className='sm:w-24 sm:h-24 w-full h-40 bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg overflow-hidden p-1'>
				<img
					src={`${baseUrl}/images/${item.product.image}`}
					alt={item.product.name}
					className='w-full h-full object-cover rounded-md'
				/>
			</div>

			{/* Product Info */}
			<div className='sm:ml-5 flex-grow mt-4 sm:mt-0 text-center sm:text-left'>
				<h3 className='font-semibold text-lg'>{item.product?.name}</h3>

				<p className='text-sm bg-gray-700 font-medium max-w-fit px-2 py-0.5 rounded text-yellow-400/90 mt-1'>
					Stock: {item.product?.stock}
				</p>

				<div className='flex items-center justify-center sm:justify-start mt-2'>
					{item.product.discount > 0 ? (
						<>
							<span className='text-green-400 font-bold'>
								PKR {discountedPrice?.toFixed(0)}
							</span>
							<span className='ml-2 text-sm text-gray-500 line-through'>
								PKR {item.product?.price.toFixed(0)}
							</span>
							<span className='ml-2 text-xs px-2 py-0.5 bg-purple-900 text-purple-300 rounded-full'>
								{item.product?.discount}% OFF
							</span>
						</>
					) : (
						<span className='text-indigo-300 font-bold'>
							PKR {item.product?.price.toFixed(0)}
						</span>
					)}
				</div>
			</div>

			{/* Quantity Controls */}
			<div className='flex items-center mt-4 sm:mt-0'>
				<div className='flex items-center bg-gray-800 rounded-lg border border-gray-700'>
					<button
						onClick={() => handleQuantityChange(quantity - 1)}
						className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors'
					>
						<Minus size={14} />
					</button>

					<span className='mx-3 w-6 text-center font-medium'>{quantity}</span>

					<button
						disabled={item.product.stock === 0}
						onClick={() => handleQuantityChange(quantity + 1)}
						className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
					>
						<Plus size={14} />
					</button>
				</div>

				{/* Remove Single Item */}
				<button
					onClick={() => handleRemoveItem(item?.product?._id)}
					className='ml-4 px-3 py-2 text-gray-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors bg-gray-300/10 border border-transparent	 flex items-center text-sm cursor-pointer'
				>
					<Trash2 size={14} className='mr-1' /> Remove
				</button>
			</div>

			{/* Item Total */}
			<div className='mt-4 sm:mt-0 sm:ml-6 text-right min-w-[80px]'>
				<div className='font-bold text-white'>
					PKR {(discountedPrice * item.quantity).toFixed(0)}
				</div>
			</div>
		</div>
	);
}
