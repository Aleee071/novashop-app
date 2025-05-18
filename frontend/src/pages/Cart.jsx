import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, Package, ChevronLeft, CreditCard } from "lucide-react";
import { useState } from "react";
import CartItem from "../components/CartItem";
import ClearCartButton from "../components/ClearCartBtn";
import Loading from "../components/Loading";
import { useFetchCart, useClearCart } from "../hooks/cart";
import { useCreateOrder } from "../hooks/order";

export default function Cart() {
	// React & routing
	const navigate = useNavigate();
	const [address, setAddress] = useState("");

	// Redux state
	const { isLoading, cart } = useSelector((state) => state.cart);

	// Custom hooks
	const { refetch } = useFetchCart();
	const clearCart = useClearCart();
	const createOrder = useCreateOrder();

	// Environment
	const baseUrl = import.meta.env.VITE_REACT_BASE_URL;

	const handleClearCart = async () => {
		await clearCart();
		await refetch();
	};

	const handleCreateOrder = async () => {
		if (!address) return;
		await createOrder(address);
		setAddress("");
		await refetch();
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100'>
			{isLoading && <Loading />}

			{/* Background decorative elements - matching ProfilePage */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-5 blur-3xl'></div>
				<div className='absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl'></div>
				<div className='absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl'></div>
			</div>

			<div className='relative max-w-6xl mx-auto px-4 py-12'>
				{/* Header section */}
				<div className='flex flex-col md:flex-row md:items-center md:justify-between mb-12'>
					<div>
						<h1 className='text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500'>
							My Cart
						</h1>
						<p className='text-gray-400 mt-2'>
							Review your items and proceed to checkout
						</p>
					</div>
					<div className='mt-4 md:mt-0 flex gap-3'>
						<button
							onClick={() => navigate(-1)}
							className='px-4 py-2 flex items-center text-gray-300 border border-transparent hover:text-white hover:border-indigo-400 bg-gray-100/10 cursor-pointer rounded-md transition duration-200'
						>
							<ChevronLeft size={18} className='mr-1' />
							Continue Shopping
						</button>
					</div>
				</div>

				{cart?.products?.length === 0 ? (
					<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-12 shadow-xl border border-gray-700 flex flex-col items-center justify-center'>
						<div className='w-24 h-24 bg-indigo-900 rounded-full flex items-center justify-center mb-6'>
							<ShoppingCart size={40} className='text-indigo-300' />
						</div>
						<h2 className='text-2xl font-bold mb-3'>Your cart is empty</h2>
						<p className='text-gray-400 mb-8 text-center max-w-md'>
							Looks like you haven't added any cosmic treasures to your cart
							yet.
						</p>
						<button
							onClick={() => navigate("/")}
							className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-8 rounded-lg transition duration-200 shadow-lg'
						>
							Explore Products
						</button>
					</div>
				) : (
					<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
						{/* Left column - Items */}
						<div className='lg:col-span-8'>
							<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-700 mb-6'>
								<div className='flex items-center justify-between mb-6'>
									<div className='flex items-center'>
										<ShoppingCart size={22} className='text-indigo-400 mr-3' />
										<h2 className='text-xl font-bold'>
											Cart Items ({cart?.products?.length})
										</h2>
									</div>
									{/* Clear Cart Button placed here */}
									<ClearCartButton onClearCart={handleClearCart} />
								</div>

								<div className='space-y-4'>
									{cart?.products?.map((item) => {
										return (
											<CartItem key={item._id} item={item} baseUrl={baseUrl} />
										);
									})}
								</div>
							</div>
						</div>

						{/* Right column - Summary */}
						<div className='lg:col-span-4'>
							<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 sticky top-4'>
								<div className='p-6 border-b border-gray-700'>
									<h2 className='text-xl font-bold mb-4'>Order Summary</h2>

									<div className='space-y-3'>
										<div className='flex justify-between text-gray-300'>
											<span>Subtotal</span>
											<span>PKR {cart.totalPrice?.toFixed(2)}</span>
										</div>

										<div className='flex justify-between text-gray-300'>
											<span>Shipping</span>
											<span>Free</span>
										</div>

										<div className='flex justify-between text-gray-300'>
											<span>Tax</span>
											<span>PKR {(cart.totalPrice * 0.07).toFixed(2)}</span>
										</div>
									</div>

									<div className='mt-4 pt-4 border-t border-gray-700'>
										<div className='flex justify-between font-bold'>
											<span>Total</span>
											<span className='text-xl text-white'>
												PKR{" "}
												{(cart.totalPrice + cart.totalPrice * 0.07).toFixed(2)}
											</span>
										</div>
									</div>
								</div>

								<div className='mx-6 mt-4'>
									<input
										type='text'
										value={address}
										onChange={(e) => setAddress(e.target.value)}
										placeholder='Enter your address here'
										className='w-full bg-gradient-to-bl from-gray-800 to-slate-900 bg-opacity-60 backdrop-blur-sm rounded-xl shadow-xl border border-gray-700 p-4 focus:outline-none focus:border-indigo-600 justify-center'
									/>
								</div>
								<div className='p-6'>
									<button
										className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 shadow-lg mb-4'
										onClick={handleCreateOrder}
									>
										<CreditCard size={18} className='mr-2' />
										Create an order
									</button>

									<div className='mt-6 p-4 bg-gray-900 bg-opacity-70 rounded-lg'>
										<div className='flex items-start mb-3'>
											<div className='mr-3 p-1.5 bg-indigo-900 rounded-md'>
												<Package size={16} className='text-indigo-300' />
											</div>
											<div>
												<h4 className='font-medium text-sm mb-1'>
													Free Shipping
												</h4>
												<p className='text-xs text-gray-400'>
													For all orders over PKR 100
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
