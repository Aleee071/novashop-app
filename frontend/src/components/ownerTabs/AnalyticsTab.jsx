import { BarChart3 } from "lucide-react";

const AnalyticsTab = ({
	orders,
	PendingOrders,
	ShippedOrders,
	DeliveredOrders,
	deliveredOrdersInPercentage,
}) => {
	const colorMap = {
		green: "bg-green-500",
		yellow: "bg-yellow-500",
		cyan: "bg-cyan-500",
	};

	return (
		<div className='bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden'>
			<div className='px-6 py-4 border-b border-gray-800'>
				<h3 className='text-lg font-semibold'>Analytics Overview</h3>
			</div>

			<div className='p-6'>
				<div className='bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6'>
					<h4 className='font-medium mb-4'>Sales Performance</h4>
					<div className='h-64 flex items-center justify-center bg-gray-750 rounded'>
						<div className='text-center text-gray-400'>
							<BarChart3 size={40} className='mx-auto mb-3' />
							<p>Sales performance chart would display here</p>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-1 gap-6'>
					<div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
						<h4 className='font-medium mb-4'>Order Status</h4>
						<div className='space-y-4'>
							{[
								{
									status: "Completed",
									count: DeliveredOrders?.length || 0,
									color: "green",
								},
								{
									status: "Pending",
									count: PendingOrders?.length || 0,
									color: "yellow",
								},
								{
									status: "Shipped",
									count: ShippedOrders?.length || 0,
									color: "cyan",
								},
							].map((item) => (
								<div
									key={item.status}
									className='flex items-center justify-between'
								>
									<div className='flex items-center'>
										<div
											className={`h-3 w-3 rounded-full ${
												colorMap[item.color]
											} mr-2`}
										></div>
										<span>{item.status}</span>
									</div>
									<div>
										<span className='font-medium'>{item.count}</span>
										<span className='text-gray-400 text-sm ml-1'>orders</span>
									</div>
								</div>
							))}

							<div className='mt-4 pt-4 border-t border-gray-700'>
								<div className='flex justify-between items-center mb-1'>
									<span className='text-sm font-medium text-gray-300'>
										Delivered Orders
									</span>
									<span className='text-sm font-medium text-green-400'>
										{DeliveredOrders?.length > 0 ? deliveredOrdersInPercentage : 0}%
									</span>
								</div>

								<div className='w-full bg-gray-700 rounded-full h-2.5'>
									<div
										className='bg-gradient-to-r from-green-400 via-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500 ease-in-out'
										style={{
											width: `${deliveredOrdersInPercentage || 0}%`,
										}}
									></div>
								</div>

								<div className='flex justify-between text-xs text-gray-400 mt-2'>
									<span>Total: {orders?.data?.length || 0} orders</span>
									<span>Updated: Today</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AnalyticsTab;
