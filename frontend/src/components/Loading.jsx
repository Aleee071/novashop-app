import React from "react";

const Loading = ({ message = "Loading..." }) => {
	return (
		<div className='flex flex-col h-screen justify-center items-center bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-center'>
			{/* Background decorative elements */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-5 blur-3xl'></div>
				<div className='absolute top-1/4 -right-20 w-96 h-96 bg-indigo-500 rounded-full opacity-5 blur-3xl'></div>
				<div className='absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-5 blur-3xl'></div>
			</div>

			<div className='relative'>
				{/* Outer ring */}
				<div className='w-20 h-20 border-4 border-indigo-300/20 dark:border-indigo-700/30 rounded-full absolute'></div>

				{/* Spinning loader */}
				<div
					className='w-20 h-20 border-4 border-transparent border-t-4 border-t-indigo-500 dark:border-t-indigo-400 border-l-4 border-l-purple-500 dark:border-l-purple-400 rounded-full animate-spin'
					style={{ animationDuration: "1.2s" }}
					role='status'
				></div>

				{/* Inner pulse */}
				<div className='absolute inset-0 flex items-center justify-center'>
					<div className='w-6 h-6 bg-indigo-600 rounded-full animate-pulse opacity-75'></div>
				</div>
			</div>

			{/* Message with gradient text */}
			<p
				className='mt-8 text-base sm:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500 animate-pulse'
				style={{ animationDuration: "2s" }}
			>
				{message}
			</p>

			{/* Small loading dots */}
			<div className='flex space-x-2 mt-3'>
				<div
					className='w-2 h-2 bg-indigo-400 rounded-full animate-bounce'
					style={{ animationDelay: "0ms" }}
				></div>
				<div
					className='w-2 h-2 bg-indigo-500 rounded-full animate-bounce'
					style={{ animationDelay: "150ms" }}
				></div>
				<div
					className='w-2 h-2 bg-purple-500 rounded-full animate-bounce'
					style={{ animationDelay: "300ms" }}
				></div>
			</div>
		</div>
	);
};

export default Loading;
