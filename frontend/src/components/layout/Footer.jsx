import React from "react";

const Footer = () => {
	return (
		<footer className='bg-gradient-to-b from-gray-900 via-indigo-900/60 to-gray-950 text-gray-100'>
			<div className='max-w-7xl mx-auto px-6 py-12'>
				{/* Footer Main Content */}
				<div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
					{/* Company Info */}
					<div>
						<a href='/' className='text-2xl font-bold inline-block mb-4'>
							<span className='text-indigo-500 drop-shadow-lg'>Nova</span>
							<span className='text-white'>UI</span>
						</a>
						<p className='text-gray-400 mb-6 leading-relaxed'>
							Modern UI components for your next React project. Elegant,
							responsive, and accessible.
						</p>
						<div className='flex space-x-4'>
							{["facebook", "twitter", "github"].map((platform, i) => (
								<a
									key={i}
									href='#'
									className='text-gray-400 hover:text-blue-400 transition hover:scale-110 duration-200'
								>
									<i className={`fab fa-${platform} text-xl`}></i>
								</a>
							))}
						</div>
					</div>

					{/* Products */}
					<div>
						<h3 className='text-indigo-400 text-sm font-semibold uppercase mb-4'>
							Products
						</h3>
						<ul className='space-y-3 text-gray-300'>
							{["Components", "Templates", "Plugins", "Themes"].map(
								(item, i) => (
									<li key={i}>
										<a
											href='#'
											className='hover:text-blue-400 hover:underline transition'
										>
											{item}
										</a>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Resources */}
					<div>
						<h3 className='text-indigo-400 text-sm font-semibold uppercase mb-4'>
							Resources
						</h3>
						<ul className='space-y-3 text-gray-300'>
							{["Documentation", "Tutorials", "Blog", "Support"].map(
								(item, i) => (
									<li key={i}>
										<a
											href='#'
											className='hover:text-blue-400 hover:underline transition'
										>
											{item}
										</a>
									</li>
								)
							)}
						</ul>
					</div>

					{/* Newsletter */}
					<div>
						<h3 className='text-indigo-400 text-sm font-semibold uppercase mb-4'>
							Subscribe
						</h3>
						<p className='text-gray-400 mb-4'>
							Get the latest updates and articles.
						</p>
						<form className='flex flex-col sm:flex-row gap-3'>
							<input
								type='email'
								placeholder='Your email'
								className='w-full px-4 py-2 bg-gray-800 text-gray-100 placeholder-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
							/>
							<button
								type='submit'
								className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium shadow hover:shadow-lg transition'
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				{/* Footer Bottom */}
				<div className='border-t border-gray-800 mt-10 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center'>
					<p>&copy; {new Date().getFullYear()} NovaUI. All rights reserved.</p>
					<div className='flex gap-6 mt-4 md:mt-0'>
						{["Privacy Policy", "Terms", "Sitemap"].map((link, i) => (
							<a
								key={i}
								href='#'
								className='hover:text-blue-400 transition hover:underline'
							>
								{link}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
