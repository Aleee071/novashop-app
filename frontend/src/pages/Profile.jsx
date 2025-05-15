import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { getUser } from "../api/auth";
import {
	User,
	Mail,
	Phone,
	Package,
	Edit2,
	ChevronRight,
	Shield,
	Heart,
	ArrowRight,
} from "lucide-react";
import OrderCard from "../components/OrderCard";
import Stats from "../components/Stats";
import LogoutButton from "../components/auth/LogoutButton";
import Loading from "../components/Loading";
import handleToastPromise from "../utils/handleToastPromise";

export default function ProfilePage() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	let { user, isLoading } = useSelector((state) => state.auth);

	useEffect(() => {
		async function fetchUser() {
			await handleToastPromise(
				dispatch(getUser()).unwrap(),
				"User fetched successfully",
				"Failed to fetch user"
			);
		}

		fetchUser();
	}, [dispatch]);

	if (isLoading) return <Loading />;

	if (!user) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100 flex items-center justify-center px-4'>
				<div className='backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-10 max-w-lg w-full text-center shadow-2xl space-y-6 animate-fadeIn'>
					<div className='flex justify-center'>
						<div className='bg-indigo-600/20 p-4 rounded-full'>
							<svg
								className='w-10 h-10 text-indigo-400'
								fill='none'
								stroke='currentColor'
								strokeWidth='1.5'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M16 12A4 4 0 1 0 8 12a4 4 0 0 0 8 0zM12 14v5m0 0h3m-3 0H9'
								/>
							</svg>
						</div>
					</div>

					<h1 className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500'>
						You're not logged in
					</h1>

					<p className='text-gray-300'>
						To view your orders and personalized features, please log in to your
						account.
					</p>

					<a
						href='/login'
						className='inline-block w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition duration-300 text-white font-semibold shadow-lg'
					>
						Go to Login
					</a>
				</div>
			</div>
		);
	} else {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-gray-100'>
				{isLoading && <Loading />}
				{/* Background decorative elements */}
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
								My Profile
							</h1>
							<p className='text-gray-400 mt-2'>
								Welcome back, manage your account and review your orders
							</p>
						</div>
						<div className='mt-4 md:mt-0'>
							<LogoutButton classname={"md:ml-4"} />
						</div>
					</div>

					<div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
						{/* Left sidebar - Profile info */}
						<div className='lg:col-span-4'>
							<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl border border-gray-700'>
								<div className='bg-gradient-to-r from-indigo-600 to-purple-700 p-8'>
									<div className='flex justify-center'>
										<div className='h-32 w-32 rounded-full bg-gray-200 border-4 border-gray-800 flex items-center justify-center shadow-xl'>
											<User size={64} className='text-gray-700' />
										</div>
									</div>
								</div>

								<div className='p-6'>
									<h2 className='text-2xl font-bold text-center mb-6'>
										{user?.fullname}
									</h2>

									<div className='space-y-5'>
										<div className='flex items-center text-gray-300'>
											<Mail size={18} className='mr-3 text-indigo-400' />
											<span>{user?.email}</span>
										</div>

										<div className='flex items-center text-gray-300'>
											<Phone size={18} className='mr-3 text-indigo-400' />
											<span>{user?.contact}</span>
										</div>
									</div>

									<div className='mt-8'>
										<button className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg flex items-center justify-center transition duration-200 shadow-lg'>
											<Edit2 size={16} className='mr-2' />
											Edit Profile
										</button>
									</div>
								</div>
							</div>

							{/* Account Navigation */}
							<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 shadow-xl mt-6 border border-gray-700'>
								<h3 className='text-lg font-semibold mb-4 text-gray-300'>
									Account
								</h3>

								<div className='space-y-2'>
									<button className='w-full text-left hover:bg-gray-700 p-3 rounded-lg flex items-center justify-between transition duration-200 group'>
										<span className='flex items-center'>
											<div className='bg-purple-900 p-2 rounded-md mr-3 group-hover:bg-purple-800 transition-colors'>
												<User size={16} className='text-purple-300' />
											</div>
											<span>Personal Information</span>
										</span>
										<ChevronRight size={16} className='text-gray-400' />
									</button>

									<button className='w-full text-left hover:bg-gray-700 p-3 rounded-lg flex items-center justify-between transition duration-200 group'>
										<span className='flex items-center'>
											<div className='bg-indigo-900 p-2 rounded-md mr-3 group-hover:bg-indigo-800 transition-colors'>
												<Shield size={16} className='text-indigo-300' />
											</div>
											<span>Security Settings</span>
										</span>
										<ChevronRight size={16} className='text-gray-400' />
									</button>

									<button
										className='w-full text-left hover:bg-gray-700 p-3 rounded-lg flex items-center justify-between transition duration-200 group'
										onClick={() => navigate("/cart/getCart")}
									>
										<span className='flex items-center'>
											<div className='bg-pink-900 p-2 rounded-md mr-3 group-hover:bg-pink-800 transition-colors'>
												<Heart size={16} className='text-pink-300' />
											</div>
											<span>Cart</span>
										</span>
										<ChevronRight size={16} className='text-gray-400' />
									</button>
								</div>
							</div>
						</div>

						{/* Right content area */}
						<div className='lg:col-span-8'>
							{/* Orders Summary Card */}
							<div className='bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-gray-700'>
								<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8'>
									<h2 className='text-2xl font-bold flex items-center'>
										<Package size={24} className='mr-3 text-indigo-400' />
										Order History
									</h2>
									<Link to='/orders/my-orders'>
										<button className='cursor-pointer'>
											<ArrowRight size={18} className='text-gray-400' />
										</button>
									</Link>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									{user?.orders?.length > 0 ? (
										user?.orders?.map((order) => (
											<OrderCard key={order?._id} order={order} />
										))
									) : (
										<p className='text-gray-400'>No orders found</p>
									)}
								</div>
							</div>

							{/* Stats Cards */}
							<div>
								<Stats orders={user?.orders} />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
