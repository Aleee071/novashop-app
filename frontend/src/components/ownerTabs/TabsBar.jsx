import { Package, User, BarChart3, Settings, PackagePlus } from "lucide-react";

const TABS = [
	{ label: "My Products", icon: Package, key: "products" },
	{ label: "Profile", icon: User, key: "profile" },
	{ label: "Analytics", icon: BarChart3, key: "analytics" },
	{ label: "Settings", icon: Settings, key: "settings" },
	{ label: "Create Product", icon: PackagePlus, key: "create-product" },
];

const TabsBar = ({ activeTab, onChange }) => {
	return (
		<nav className='bg-gray-900 border-b border-gray-800'>
			<div className='max-w-6xl mx-auto px-0'>
				<ul className='flex overflow-x-auto md:overflow-x-visible custom-scrollbar sm:justify-center gap-2 sm:gap-4 sm:px-2'>
					{TABS.map(({ label, icon: Icon, key }) => (
						<li key={key} className='list-none' role='presentation'>
							<button
								onClick={() => onChange(key)}
								role='tab'
								aria-selected={activeTab === key}
								className={`flex items-center gap-2 px-4 py-4 whitespace-nowrap transition ${
									activeTab === key
										? "text-indigo-400 font-semibold bg-gray-800/40 border-t-2 md:border-t-0 md:border-b-2 border-indigo-500"
										: "text-gray-400 hover:text-white hover:bg-gray-800/50"
								}`}
							>
								<Icon size={18} />
								<span>{label}</span>
							</button>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
};

export { TabsBar };
