import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	ShoppingCart,
	User,
	Menu,
	X,
	Headphones,
	Bell,
	LayoutDashboard,
	Home,
} from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	const { user, isLoading: userLoading } = useSelector((state) => state.auth);
	const { cart } = useSelector((state) => state.cart);
	const { owner, isLoading: ownerLoading } = useSelector(
		(state) => state.owner
	);

	// Handle navbar background change on scroll
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 10) {
				setIsScrolled(true);
			} else {
				setIsScrolled(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [user]);

	useEffect(() => {
		if (isOpen) {
			// Disable scrolling on body when menu is open
			document.body.classList.add("overflow-hidden");
		} else {
			// Re-enable scrolling when menu is closed
			document.body.classList.remove("overflow-hidden");
		}

		// Cleanup function to ensure scrolling is re-enabled when component unmounts
		return () => {
			document.body.classList.remove("overflow-hidden");
		};
	}, [isOpen, user]);

	return (
		<nav
			className={`sticky top-0 z-50 w-full ${
				isScrolled ? "bg-gray-900 shadow-lg" : "bg-gray-900/95 backdrop-blur-sm"
			} transition-colors duration-350`}
		>
			{/* Top Bar - Announcements/Offers */}
			<div className='bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-sm py-2'>
				<div className='max-w-7xl mx-auto px-4 flex justify-center items-center'>
					<Bell size={14} className='mr-2' />
					<p>Free shipping on all orders over $50 | Use code: NOVA25</p>
				</div>
			</div>

			<div className='max-w-7xl mx-auto px-4'>
				{/* Upper Navbar Section */}
				<div className='flex justify-between items-center py-4'>
					{/* Logo */}
					<div className='flex-shrink-0'>
						<Link
							to='/'
							className='text-xl sm:text-2xl font-bold flex items-center'
						>
							<span className='bg-gradient-to-r from-indigo-400 to-indigo-500 bg-clip-text text-transparent'>
								Nova
							</span>
							<span className='text-white'>Shop</span>
						</Link>
					</div>

					{/* Action Icons - Desktop */}
					<div className='hidden md:flex items-center space-x-3'>
						{/* Profile Link */}
						{user && (
							<NavLink
								to={user ? "/profile" : "/login"}
								className={({ isActive }) => {
									const baseClasses =
										"flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ease-in-out transform shadow-md bg-gradient-to-br";
									const activeClasses =
										"border-indigo-700 from-indigo-800 to-indigo-700 text-white scale-105 shadow-indigo-800/50";
									const inactiveClasses =
										"border-indigo-700 from-gray-900 to-gray-800 text-gray-200 hover:from-indigo-700 hover:to-purple-700 hover:text-white hover:scale-105 hover:shadow-indigo-800/40";

									return `${baseClasses} ${
										isActive ? activeClasses : inactiveClasses
									}`;
								}}
							>
								<User
									size={18}
									className={`${
										user ? "text-indigo-300" : "text-indigo-400"
									} transition duration-200`}
								/>
								<span className='max-w-[100px] truncate'>
									{user?.fullname || "Profile"}
								</span>
							</NavLink>
						)}

						{owner && (
							<div className='flex items-center gap-0 px-4 py-2 text-base text-indigo-100 font-semibold rounded-lg border border-indigo-700 bg-gradient-to-br from-indigo-800 to-emerald-800 shadow-violet-600/40 shadow-lg'>
								<User size={18} />
								<span className='truncate max-w-[70px] text-ellipsis md:max-w-[160px] lg:max-w-[200px] ml-2 inline text-sm'>
									{owner?.fullname}
								</span>
							</div>
						)}

						{/* Dashboard Link */}
						{owner && (
							<NavLink
								to='/owner/dashboard'
								className={({ isActive }) =>
									`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ease-in-out transform shadow-md ${
										isActive
											? "border-yellow-600 from-yellow-800 to-yellow-700 text-white scale-105 shadow-yellow-800/60 bg-gradient-to-br"
											: "border-yellow-700 from-gray-800 to-slate-900 text-gray-200 hover:from-gray-700 hover:to-slate-900 hover:text-white hover:scale-105 hover:shadow-yellow-800/50 bg-gradient-to-br"
									}`
								}
							>
								<LayoutDashboard size={18} />
								<span>Dashboard</span>
							</NavLink>
						)}

						{/* Cart Link */}
						{user && (
							<NavLink
								to='/cart/getCart'
								className={({ isActive }) =>
									`relative flex items-center justify-center px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out border focus:outline-none focus:ring-2 ${
										isActive
											? "text-indigo-400 border-indigo-600 ring-indigo-500 scale-110"
											: "text-gray-300 border-gray-700 hover:text-indigo-400 hover:border-indigo-500 hover:scale-110"
									}`
								}
							>
								<ShoppingCart size={20} className='drop-shadow-md' />
								{cart?.products?.length > 0 && (
									<span className='absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-lg ring-2 ring-indigo-400/60'>
										{cart.products.length}
									</span>
								)}
							</NavLink>
						)}
						{/* Auth Buttons */}
						{!user && !owner ? (
							<NavLink
								to={owner ? "/owner/login" : "/login"}
								className='ml-2 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition duration-200 text-white font-medium shadow'
							>
								{userLoading || ownerLoading ? "Loading..." : "Sign In"}
							</NavLink>
						) : (
							<LogoutButton className='ml-2 px-4 py-2 rounded-md  text-white transition duration-200 shadow-md' />
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className='flex items-center md:hidden space-x-4'>
						{user && (
							<NavLink
								to='/profile'
								className={({ isActive }) => {
									const baseClasses =
										"flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ease-in-out transform shadow-md bg-gradient-to-br";
									const activeClasses =
										"border-indigo-700 from-indigo-800 to-indigo-700 text-white scale-105 shadow-indigo-800/50";
									const inactiveClasses =
										"border-indigo-700 from-gray-900 to-gray-800 text-gray-200 hover:from-indigo-700 hover:to-purple-700 hover:text-white hover:scale-105 hover:shadow-indigo-800/40";

									return `${baseClasses} ${
										isActive ? activeClasses : inactiveClasses
									}`;
								}}
							>
								<User size={20} className='text-indigo-200' />
								<span className='truncate max-w-[80px] hidden sm:inline'>
									{user?.fullname || "Profile"}
								</span>
							</NavLink>
						)}

						{owner && (
							<div className='flex items-center justify-between space-x-0 sm:space-x-3 md:space-x-6 md:space-y-0'>
								{/* Dashboard Link */}
								<NavLink
									to='/owner/dashboard'
									className={({ isActive }) =>
										`flex items-center gap-2 max-sm:px-3 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ease-in-out transform shadow-md ${
											isActive
												? "border-yellow-600 from-yellow-800 to-yellow-700 text-white scale-105 shadow-yellow-800/60 sm:bg-gradient-to-br"
												: "border-yellow-700 from-gray-800 to-slate-900 text-gray-200 hover:from-gray-700 hover:to-slate-900 hover:text-white hover:scale-105 hover:shadow-yellow-800/50 bg-gradient-to-br"
										}`
									}
								>
									<LayoutDashboard size={18} />
									<span className='hidden sm:inline'>Dashboard</span>
								</NavLink>

								{/* Owner Name (Only visible on larger screens) */}
								<div className='hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-indigo-100 font-semibold rounded-lg border border-indigo-700 bg-gradient-to-br from-indigo-800 to-emerald-800 shadow-violet-600/40 shadow-md'>
									<User size={18} />
									<span className='truncate max-w-[20px] inline text-ellipsis sm:max-w-[120px] md:max-w-[160px] lg:max-w-[200px] ml-0 sm:ml-1 text-xs sm:text-sm'>
										{owner?.fullname}
									</span>
								</div>
							</div>
						)}

						{/* Cart Link */}
						{user && (
							<NavLink
								to='/cart/getCart'
								className='text-gray-300 hover:text-indigo-400 transition duration-200 relative'
							>
								<ShoppingCart size={22} />
								{cart?.products?.length > 0 && (
									<span className='absolute -top-2 -right-2 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center'>
										{cart?.products?.length}
									</span>
								)}
							</NavLink>
						)}

						<button
							onClick={() => setIsOpen(!isOpen)}
							className='text-gray-300 hover:text-indigo-400 transition duration-200'
						>
							{isOpen ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`md:hidden transition-all duration-300 overflow-hidden ${
					isOpen ? "min-h-screen" : "max-h-0"
				}`}
			>
				<div className='bg-gradient-to-b min-h-screen from-gray-800 to-gray-900 px-4 py-2'>
					<div className='space-y-1 pb-3 border-b border-gray-700'>
						<NavLink
							to='/'
							className={({ isActive }) =>
								`block px-3 py-2 rounded-md ${
									isActive ? "text-indigo-400 font-medium" : "text-gray-300"
								} hover:bg-gray-800/70 transition flex items-center duration-200`
							}
							onClick={() => setIsOpen(false)}
						>
							<Home size={18} className='mr-2' />
							Home
						</NavLink>

						<NavLink
							to='/support'
							className={({ isActive }) =>
								`block px-3 py-2 rounded-md ${
									isActive ? "text-indigo-400 font-medium" : "text-gray-300"
								} hover:bg-gray-800/70 transition duration-200 flex items-center`
							}
							onClick={() => setIsOpen(false)}
						>
							<Headphones size={18} className='mr-2' />
							Support
						</NavLink>
						<NavLink
							to='/owner/dashboard'
							className={({ isActive }) =>
								`block px-3 py-2 rounded-md ${
									isActive ? "text-indigo-400 font-medium" : "text-gray-300"
								} hover:bg-gray-800/70 transition duration-200 flex items-center`
							}
							onClick={() => setIsOpen(false)}
						>
							<LayoutDashboard size={18} className='mr-2' />
							Dashboard
						</NavLink>
					</div>

					<div className='pt-4 pb-3 border-t border-gray-700'>
						<div className='flex items-center px-3'>
							<div className='flex-shrink-0'>
								<div className='h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center'>
									<User size={20} className='text-gray-300' />
								</div>
							</div>
							<div className='ml-3'>
								<div className='text-base font-medium text-white'>Account</div>
								<span className='text-sm text-gray-400'>
									{owner
										? owner?.email
										: user
										? user?.email
										: "Login to your account"}
								</span>
							</div>
						</div>

						<div className='mt-3 space-y-1'>
							{user && (
								<NavLink
									to='/orders/my-orders'
									className='block px-3 py-2 rounded-md text-gray-300 hover:bg-gray-800/70 hover:text-white transition duration-200'
									onClick={() => setIsOpen(false)}
								>
									Your Orders
								</NavLink>
							)}

							<div className='pt-2'>
								{user || owner ? (
									<LogoutButton
										classname={"w-full"}
										onClick={() => setIsOpen(false)}
									/>
								) : (
									<NavLink
										to='/login'
										className='block w-full px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 transition duration-200 text-white font-medium shadow-md text-center'
										onClick={() => setIsOpen(false)}
									>
										Login
									</NavLink>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
