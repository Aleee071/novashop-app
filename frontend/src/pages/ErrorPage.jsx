import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
	const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/");
		}, 5000); // Redirect after 5 seconds
		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4'>
			<div className='animate-bounce text-7xl mb-4'>🚫</div>
			<h1 className='text-4xl font-bold text-gray-800 dark:text-white mb-2'>
				Ooops! Page not found.
			</h1>
			<p className='text-gray-600 dark:text-gray-400 mb-6'>
				The page you’re looking for doesn’t exist. <br />
				Redirecting to home in{" "}
				<span className='font-semibold'>5 seconds...</span>
			</p>
			<div className='animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500'></div>
		</div>
	);
}
