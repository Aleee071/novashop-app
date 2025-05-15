import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Info, HelpCircle } from "lucide-react";
import { useLoginOwner } from "../../hooks/owner";
import { useLoginUser } from "../../hooks/user";

function Login({ role = "user" }) {
	// Hooks
	const { login: userLogin } = useLoginUser();
	const { login: ownerLogin } = useLoginOwner();

	const [credentials, setCredentials] = useState({
		username: "",
		password: "",
	});

	const { isLoading, error } = useSelector((state) => state.auth);

	const handleChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			localStorage.setItem("role", role);

			if (role === "user") {
				await userLogin(credentials);
			} else if (role === "owner") {
				await ownerLogin(credentials);
			}
		} catch (err) {
			console.log("Login failed: ", err);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6'>
			<div className='bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700 transition-transform transform duration-300'>
				{role === "user" ? (
					<div className='text-sm text-gray-400 text-center mt-0 mb-4'>
						Not a regular user?{" "}
						<Link
							to='/owner/login'
							className='text-blue-500 hover:underline font-medium'
						>
							Are you an owner?
						</Link>
					</div>
				) : (
					<div className='text-sm text-gray-400 text-center mt-0 mb-4'>
						Are you a regular user?{" "}
						<Link
							to='/login'
							className='text-blue-500 hover:underline font-medium'
						>
							Login here
						</Link>
					</div>
				)}
				<h2 className='text-3xl font-bold text-center text-white mb-3'>
					Login
				</h2>
				<p className='text-gray-300 text-center mb-5 text-sm'>
					{role === "user" ? "( User )" : "( Owner )"}
				</p>
				<form onSubmit={handleSubmit} className='space-y-4'>
					{error && (
						<div className='p-4 flex items-center gap-x-3 rounded-md bg-red-800/60 border border-red-700 text-white shadow-sm'>
							<span className='text-red-300 flex-shrink-0'>
								<Info className='w-5 h-5' />
							</span>
							<p className='text-sm font-medium leading-tight'>{error}</p>
						</div>
					)}
					<div>
						<label className='block text-gray-300 mb-1'>Username</label>
						<input
							type='text'
							name='username'
							value={credentials.username}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
							autoFocus
						/>
					</div>
					<div>
						<label className='block text-gray-300 mb-1'>Password</label>
						<input
							type='password'
							name='password'
							value={credentials.password}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
						/>
					</div>
					<div className='inline-flex items-center gap-2 text-sm text-gray-300 transition'>
						<HelpCircle className='w-4 h-4 align-text-bottom' />
						<span className='font-medium tracking-wide'>
							Enter your <span className='text-blue-500'>credentials</span>
						</span>
					</div>

					<button
						type='submit'
						disabled={isLoading}
						className='w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white py-3 rounded-md transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed'
					>
						{isLoading ? (
							<>
								<svg className='w-5 h-5 animate-spin' viewBox='0 0 24 24'>
									<defs>
										<linearGradient
											id='loaderGradient'
											x1='0%'
											y1='0%'
											x2='100%'
											y2='100%'
										>
											<stop offset='0%' stopColor='#f0f9ff' />
											<stop offset='100%' stopColor='#60a5fa' />
										</linearGradient>
									</defs>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
										fill='none'
									/>
									<path
										className='opacity-90'
										fill='none'
										strokeLinecap='round'
										stroke='url(#loaderGradient)'
										strokeWidth='4'
										d='M12 2C6.477 2 2 6.477 2 12'
									/>
								</svg>
								<span>Processing...</span>
							</>
						) : (
							<span className='font-medium'>Submit</span>
						)}
					</button>
				</form>
				<div className='text-sm text-gray-400 text-center mt-6'>
					Don't have an account?{" "}
					<Link
						to={role === "user" ? "/register" : "/register/owner"}
						className='text-blue-500 hover:underline font-medium'
					>
						Register here
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Login;
