import { useState, lazy, Suspense, useEffect, useMemo } from "react";
import { Package, Search, Bell } from "lucide-react";
import handleToastPromise from "../utils/handleToastPromise";
import { useSelector, useDispatch } from "react-redux";
import { getOwner } from "../api/owner";
import { TabsBar } from "../components/ownerTabs/TabsBar";
import LogoutButton from "../components/auth/LogoutButton";
import Loading from "../components/Loading";
import useFetchOrdersByOwner from "../hooks/order/useFetchOrdersByOwner";
import { useFetchProductsByOwner } from "../hooks/product";

// Lazy loaded components
const ProductsTab = lazy(() => import("../components/ownerTabs/ProductsTab"));
const AnalyticsTab = lazy(() => import("../components/ownerTabs/AnalyticsTab"));
const SettingsTab = lazy(() => import("../components/ownerTabs/SettingsTab"));
const ProfileTab = lazy(() => import("../components/ownerTabs/ProfileTab"));
const CreateProductTab = lazy(() =>
	import("../components/ownerTabs/CreateProductTab")
);

const OwnerDashboard = () => {
	// Hooks
	const { fetch: fetchOrdersByOwner } = useFetchOrdersByOwner();
	const { fetch: fetchProductsByOwner } = useFetchProductsByOwner();

	const [activeTab, setActiveTab] = useState("products");
	const [searchTerm, setSearchTerm] = useState("");
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const { ordersByOwner, isLoading: ordersLoading } = useSelector(
		(state) => state.order
	);
	const { owner, isLoading } = useSelector((state) => state.owner);
	const { productsByOwner, isLoading: productsLoading } = useSelector(
		(state) => state.product
	);
	const dispatch = useDispatch();
	const ownerId = owner?._id;

	// Mock notifications
	const notifications = [
		{
			id: 1,
			message: "New order received",
			time: "10 minutes ago",
			read: false,
		},
		{
			id: 2,
			message: "Order #1234 has been delivered",
			time: "1 hour ago",
			read: false,
		},
		{
			id: 3,
			message: "Payment confirmed for order #5678",
			time: "3 hours ago",
			read: true,
		},
	];

	useEffect(() => {
		async function fetchOwner() {
			if (!ownerId) {
				await handleToastPromise(
					dispatch(getOwner()).unwrap(),
					"Owner fetched successfully",
					"Failed to fetch owner"
				);
			}
		}

		fetchOwner();
	}, [dispatch, ownerId]);

	useEffect(() => {
		async function load() {
			if (ownerId && productsByOwner?.[0]?.owner !== ownerId) {
				await fetchOrdersByOwner();
			}
		}

		load();
	}, [ownerId, ordersByOwner.length]);

	useEffect(() => {
		async function fetchProducts() {
			if (ownerId && productsByOwner?.[0]?.owner !== ownerId) {
				await fetchProductsByOwner();
			}
		}

		fetchProducts();
	}, [dispatch, ownerId, productsByOwner.length]);

	// Filter orders based on search term
	const filteredOrders = useMemo(() => {
		return ordersByOwner?.filter(
			(order) =>
				order?._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				order?.shippingAddress
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				order.status?.toLowerCase().includes(searchTerm.toLowerCase())
		);
	}, [searchTerm, ordersByOwner.length]);

	// Filter pending orders
	const PendingOrders = ordersByOwner?.filter(
		(order) => order.status === "Pending"
	);
	// Filter shipped orders
	const ShippedOrders = ordersByOwner?.filter(
		(order) => order.status === "Shipped"
	);
	// Filter delivered orders
	const DeliveredOrders = ordersByOwner?.filter(
		(order) => order.status === "Delivered"
	);

	// Calculate delivered orders in percentage
	let deliveredOrdersInPercentage = (
		(DeliveredOrders?.length / ordersByOwner?.length) *
		100
	).toFixed(0);

	deliveredOrdersInPercentage = Number(deliveredOrdersInPercentage);

	return (
		<div className='min-h-screen bg-gray-950 text-white'>
			{isLoading || productsLoading || ordersLoading ? <Loading /> : ""}

			{/* Top navbar */}
			<header className='bg-gradient-to-r sticky top-[calc(124px)] max-sm:top-[calc(104px)] sm:top-[calc(106px)] z-50  from-indigo-900 to-purple-900 bg-opacity-95 backdrop-blur-md py-4 border-b border-gray-800 '>
				<div className='container mx-auto px-4'>
					<div className='flex items-center justify-between h-16'>
						{/* Logo and user info */}
						<div className='flex items-center space-x-4'>
							<div className='h-9 w-9 rounded-full bg-gradient-to-r from-slate-900 to-gray-700 flex items-center justify-center'>
								<Package size={18} className='text-white' />
							</div>
							<div>
								<h2 className='font-bold text-lg'>{owner?.fullname}</h2>
								<p className='text-xs text-gray-400'>{owner?.email}</p>
							</div>
						</div>

						{/* Search, notifications and actions */}
						<div className='flex items-center space-x-4'>
							<div className='relative max-w-xs hidden md:block'>
								<input
									type='text'
									placeholder='Search orders...'
									className='bg-gray-800 border border-gray-700 text-gray-300 rounded-lg pl-9 pr-4 py-1.5 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
								/>
								<Search
									size={16}
									className='absolute left-3 top-2 text-gray-400'
								/>
							</div>

							<div className='relative'>
								<button
									className='p-2 rounded-full bg-gray-800 hover:bg-gray-700 relative'
									onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
								>
									<Bell size={18} className='text-gray-300' />
									{notifications.filter((n) => !n.read)?.length > 0 && (
										<span className='absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full'></span>
									)}
								</button>

								{/* Notifications dropdown */}
								{isNotificationsOpen && (
									<div className='absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden z-80'>
										<div className='flex items-center justify-between px-4 py-2 border-b border-gray-700'>
											<h3 className='font-medium'>Notifications</h3>
											<button className='text-xs text-indigo-400 hover:text-indigo-300'>
												Mark all as read
											</button>
										</div>
										<div className='max-h-80 overflow-y-auto'>
											{notifications.map((notification) => (
												<div
													key={notification.id}
													className={`px-4 py-3 border-b border-gray-700 hover:bg-gray-700 ${
														!notification.read ? "bg-gray-750" : ""
													}`}
												>
													<div className='flex items-center'>
														<div
															className={`h-2 w-2 rounded-full ${
																!notification.read
																	? "bg-indigo-500"
																	: "bg-gray-600"
															} mr-2`}
														></div>
														<p className='text-sm'>{notification.message}</p>
													</div>
													<p className='text-xs text-gray-400 mt-1'>
														{notification.time}
													</p>
												</div>
											))}
										</div>
										<div className='px-4 py-2 text-center border-t border-gray-700'>
											<button className='text-sm text-indigo-400 hover:text-indigo-300'>
												View all notifications
											</button>
										</div>
									</div>
								)}
							</div>

							<LogoutButton classname='bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-md text-sm font-medium transition' />
						</div>
					</div>
				</div>
			</header>

			{/* Tabs */}
			<TabsBar activeTab={activeTab} onChange={setActiveTab} />

			{/* Mobile search (visible only on mobile) */}
			<div className='md:hidden sticky z-50 top-[calc(104px+97px)] p-4 bg-gray-900/50 backdrop-blur-md border-t border-gray-800 shadow-xl shadow-indigo-800/20'>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search orders...'
						className='bg-gray-800/60 border border-gray-700 text-gray-100 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 backdrop-blur-sm'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
					<Search
						size={18}
						className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
					/>
				</div>
			</div>

			{/* Main content */}
			<Suspense fallback={<Loading />}>
				<main className='container mx-auto px-4 py-6 bg-gradient-to-b from-black to-slate-950/80'>
					{activeTab === "products" && (
						<ProductsTab
							orders={ordersByOwner}
							products={productsByOwner}
							searchTerm={searchTerm}
							PendingOrders={PendingOrders}
							ShippedOrders={ShippedOrders}
							DeliveredOrders={DeliveredOrders}
							filteredOrders={filteredOrders}
						/>
					)}

					{activeTab === "profile" && (
						<ProfileTab owner={owner} isLoading={isLoading} />
					)}

					{activeTab === "analytics" && (
						<AnalyticsTab
							orders={ordersByOwner}
							PendingOrders={PendingOrders}
							ShippedOrders={ShippedOrders}
							DeliveredOrders={DeliveredOrders}
							deliveredOrdersInPercentage={deliveredOrdersInPercentage}
						/>
					)}

					{activeTab === "settings" && <SettingsTab />}
					{activeTab === "create-product" && <CreateProductTab owner={owner} />}
				</main>
			</Suspense>
		</div>
	);
};

export default OwnerDashboard;
