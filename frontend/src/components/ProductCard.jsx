import React from "react";
import { ShoppingBag, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, variant = "vertical" }) => {
	const navigate = useNavigate();
	const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
	const isHorizontal = variant === "horizontal";

	// Calculate discounted price
	const discountedPrice =
		product.price - (product.price * product.discount) / 100;

	return (
		<div
			className={`group relative overflow-hidden border border-slate-600/60 rounded-2xl bg-gradient-to-br from-gray-800/90 to-gray-900/95  transition-all duration-300 ${
				isHorizontal
					? "flex flex-row h-48 w-full max-w-md shadow-indigo-600/20 shadow-md hover:shadow-lg"
					: "flex flex-col shadow-lg hover:shadow-xl"
			}`}
		>
			{/* Discount Badge */}
			{product.discount > 0 && (
				<div className='absolute top-4 left-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-md z-10'>
					{product.discount}% OFF
				</div>
			)}

			{/* Image Area */}
			<div
				className={`relative overflow-hidden ${
					isHorizontal ? "w-48 h-full flex-shrink-0" : "w-full h-56"
				}`}
			>
				<img
					src={`${baseUrl}/images/${product.image}`}
					alt={product.name}
					loading='lazy'
					className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
				/>

				{/* Stock Indicator */}
				{product.stock <= 5 && (
					<div className='absolute bottom-4 left-4 bg-gray-900/75 text-amber-400 text-xs px-2 py-1 rounded-md'>
						Only {product.stock} left
					</div>
				)}
			</div>

			{/* Content Area */}
			<div
				className={`p-4 flex flex-col w-full ${
					isHorizontal ? "justify-around" : "justify-between"
				}`}
			>
				{/* Top */}
				<div>
					{/* Category & Rating */}
					<div className='flex justify-between items-center mb-1 text-xs'>
						<span className='text-indigo-400 font-medium'>
							{product.category || "General"}
						</span>
						<div className='flex items-center text-amber-400'>
							<Star size={14} fill='currentColor' className='mr-1' />
							<span>{product.rating || "4.5"}</span>
						</div>
					</div>

					{/* Product Name */}
					<h3 className='text-md font-bold text-indigo-300 capitalize truncate'>
						{product.name}
					</h3>

					{/* Description */}
					<div className='mt-1 text-gray-300 text-sm line-clamp-2'>
						{product.description
							? product.description
							: "No description available for this product"}
					</div>
				</div>

				{/* Bottom */}
				<div
					className={`flex justify-between items-end ${
						isHorizontal ? "mt-0" : "mt-4"
					}`}
				>
					<div>
						<div className='flex items-center gap-2'>
							<span className='text-emerald-400 font-bold text-base'>
								RS {discountedPrice.toFixed(0)}
							</span>
							{product.discount > 0 && (
								<span className='text-gray-400 text-sm line-through'>
									RS {product.price}
								</span>
							)}
						</div>
						{variant === "vertical" && (
							<div className='text-sm text-gray-400 mt-1'>
								Sold by: {product?.owner?.fullname}
							</div>
						)}
					</div>

					<button
						className='px-3 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-md text-xs md:text-sm font-medium flex items-center transition-colors duration-200 shadow-md'
						onClick={() => navigate(`/products/product/${product._id}`)}
					>
						<ShoppingBag size={14} className='mr-2' />
						View
					</button>
				</div>
			</div>
		</div>
	);
};

export default React.memo(ProductCard);
