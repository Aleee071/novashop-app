import { useEffect, useState } from "react";
import {
	Mail,
	Phone,
	User,
	Package,
	Settings,
	ChevronLeft,
	ChevronRight,
	BarChart3,
} from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

const Sidebar = ({ owner, activeTab, setActiveTab }) => {
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [isMobile, setIsMobile] = useState(
		typeof window !== "undefined" ? window.innerWidth < 1024 : false
	);

	useEffect(() => {
		const handleResize = () => {
			const mobile = window.innerWidth < 1024;
			setIsMobile(mobile);
			setSidebarOpen(!mobile);
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const toggleSidebar = () => setSidebarOpen((prev) => !prev);

	return (
		<aside
			className={`fixed lg:sticky top-0 z-100 h-screen bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-gray-800 transition-all duration-300 transform lg:transform-none overflow-y-auto
        ${
					sidebarOpen
						? "translate-x-0 shadow-2xl"
						: "-translate-x-full lg:translate-x-0"
				}
        ${isMobile ? "w-64" : sidebarOpen ? "w-64" : "w-20"} 
      `}
		>
			{/* Sidebar toggle for desktop */}
			{!isMobile && (
				<button
					onClick={toggleSidebar}
					className='fixed z-100 top-4 right-4 p-1 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors'
				>
					{sidebarOpen ? (
						<ChevronLeft size={18} className='text-gray-400' />
					) : (
						<ChevronRight size={18} className='text-gray-400' />
					)}
				</button>
			)}

			{/* User profile section */}
			<div className={`transition-all ${isMobile ? "mt-14" : ""}`}>
				<div className='bg-gradient-to-r from-indigo-600 to-purple-700 p-6'>
					<div className='flex justify-center'>
						<div className='h-20 w-20 rounded-full bg-gray-200 border-4 border-gray-800 flex items-center justify-center shadow-xl overflow-hidden'>
							{owner?.avatar ? (
								<img
									src={owner?.avatar}
									alt={owner?.fullname}
									className='h-full w-full object-cover'
								/>
							) : (
								<User size={36} className='text-gray-700' />
							)}
						</div>
					</div>
				</div>

				<div className='p-4'>
					{sidebarOpen && (
						<>
							<h2 className='text-lg font-bold text-center mb-3'>
								{owner.fullname}
							</h2>

							<div className='space-y-2'>
								<div className='flex items-center text-gray-300 text-sm'>
									<Mail
										size={14}
										className='mr-2 text-indigo-400 flex-shrink-0'
									/>
									<span className='truncate'>{owner.email}</span>
								</div>

								<div className='flex items-center text-gray-300 text-sm'>
									<Phone
										size={14}
										className='mr-2 text-indigo-400 flex-shrink-0'
									/>
									<span>{owner.contact}</span>
								</div>
							</div>
						</>
					)}
					{!sidebarOpen && !isMobile && (
						<div className='flex justify-center py-2'>
							<User size={24} className='text-indigo-400' />
						</div>
					)}
				</div>
			</div>

			{/* Navigation */}
			<div className='p-3'>
				<div className={`${sidebarOpen ? "mb-3 px-2" : "mb-6 text-center"}`}>
					<span className='text-xs uppercase font-semibold tracking-wider text-gray-500'>
						{sidebarOpen ? "Dashboard" : "Menu"}
					</span>
				</div>

				<div className='space-y-1'>
					{[
						{
							label: "My Products",
							icon: <Package size={16} className='text-indigo-200' />,
							key: "products",
							bg: "indigo",
						},
						{
							label: "Profile",
							icon: <User size={16} className='text-purple-200' />,
							key: "profile",
							bg: "purple",
						},
						{
							label: "Analytics",
							icon: <BarChart3 size={16} className='text-blue-200' />,
							key: "analytics",
							bg: "blue",
						},
						{
							label: "Settings",
							icon: <Settings size={16} className='text-pink-200' />,
							key: "settings",
							bg: "pink",
						},
					].map(({ label, icon, key, bg }) => (
						<button
							key={key}
							className={`w-full text-left rounded-lg flex items-center transition duration-200 group ${
								activeTab === key
									? "bg-gray-800 text-white"
									: "text-gray-400 hover:bg-gray-800 hover:text-white"
							} ${sidebarOpen ? "px-3 py-2.5" : "p-2.5 justify-center"}`}
							onClick={() => setActiveTab(key)}
						>
							<div
								className={`${
									activeTab === key
										? `bg-${bg}-600`
										: `bg-gray-700 group-hover:bg-${bg}-900`
								} p-2 rounded-md ${
									sidebarOpen ? "mr-3" : ""
								} transition-colors`}
							>
								{icon}
							</div>
							{sidebarOpen && <span>{label}</span>}
						</button>
					))}
				</div>
			</div>

			{/* Logout button */}
			<div className='absolute bottom-0 left-0 w-full p-4'>
				<LogoutButton
					classname={`w-full ${
						!sidebarOpen && !isMobile ? "justify-center" : ""
					}`}
				/>
			</div>
		</aside>
	);
};

export default Sidebar;
