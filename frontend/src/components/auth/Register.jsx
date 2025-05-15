import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Info, HelpCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createOwner } from "../../api/owner.js";
import { useRegisterUser } from "../../hooks/user";
import { useRegisterOwner } from "../../hooks/owner";

const Register = ({ role = "user" }) => {
	// Hooks
	const { register: registerUser } = useRegisterUser();
	const { register: registerOwner } = useRegisterOwner();

	const [formData, setFormData] = useState({
		fullname: "",
		username: "",
		email: "",
		password: "",
		contact: "",
	});

	const { isLoading, error } = useSelector((state) => state.auth);

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (!formData.email.includes("@")) {
				toast.error("Please enter a valid email");
				return;
			}

			role === "user"
				? await registerUser(formData)
				: await registerOwner(formData);
		} catch (err) {
			console.log("Registration failed: ", err);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6'>
			<div className='bg-gray-900 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700 transition-transform transform duration-300'>
				{role === "user" ? (
					<div className='text-sm text-gray-400 text-center mt-0 mb-3'>
						Not a regular user?{" "}
						<Link
							to='/register/owner'
							className='text-blue-500 hover:underline font-medium'
						>
							Are you an owner?
						</Link>
					</div>
				) : (
					<div className='text-sm text-gray-400 text-center mt-0 mb-3'>
						Are you a regular user?{" "}
						<Link
							to='/register'
							className='text-blue-500 hover:underline font-medium'
						>
							Register here
						</Link>
					</div>
				)}
				<div className='text-center mb-6'>
					<h2 className='text-3xl font-bold text-center text-white mb-3'>
						Register
					</h2>
					<span className='text-gray-300 text-sm'>
						{role === "user" ? "( User )" : "( Owner )"}
					</span>
				</div>

				<form onSubmit={handleSubmit} className='space-y-4'>
					{error && (
						<div className='p-4 flex items-center gap-x-3 rounded-md bg-red-800/60 border border-red-700 text-white shadow-sm'>
							<span className='text-red-300 flex-shrink-0'>
								<Info className='w-5 h-5' />
							</span>
							<p className='text-base p-2 font-medium leading-tight'>{error}</p>
						</div>
					)}
					<div>
						<label className='block text-gray-300 mb-1'>Fullname</label>
						<input
							type='text'
							name='fullname'
							value={formData.fullname}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
						/>
					</div>
					<div>
						<label className='block text-gray-300 mb-1'>Username</label>
						<input
							type='text'
							name='username'
							value={formData.username}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
						/>
					</div>
					<div>
						<label className='block text-gray-300 mb-1'>Email</label>
						<input
							type='email'
							name='email'
							value={formData.email}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
						/>
					</div>
					<div>
						<label className='block text-gray-300 mb-1'>Password</label>
						<input
							type='password'
							name='password'
							value={formData.password}
							onChange={handleChange}
							className='w-full mt-1 p-3 border border-gray-600 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition duration-300'
							required
						/>
					</div>
					<div>
						<label className='block text-gray-300 mb-1'>Phone</label>
						<input
							type='tel'
							name='contact'
							value={formData.contact}
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
							<span className='font-medium'>Register</span>
						)}
					</button>
				</form>
				<div className='flex items-center justify-center mt-5 text-sm '>
					<p className='text-gray-400'>Already have an account?</p>
					<Link
						to='/login'
						className='text-blue-500 ml-2 hover:underline hover:text-blue-600 font-medium'
					>
						Login here
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
