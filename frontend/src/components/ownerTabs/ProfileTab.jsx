import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteOwner, updateOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";
import { User, Mail, Phone } from "lucide-react";
import handleToastPromise from "../../utils/handleToastPromise";

const ProfileTab = ({ owner, isLoading }) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [updatedOwner, setUpdatedOwner] = useState({
		fullname: owner?.fullname,
		username: owner?.username,
		contact: owner?.contact,
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleModalOpen = () => {
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	const handleDeleteAccount = async () => {
		const res = await handleToastPromise(
			dispatch(deleteOwner()).unwrap(),
			"Account deleted successfully",
			"Failed to delete account"
		);

		res && navigate("/owner/login");
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setUpdatedOwner({
			...updatedOwner,
			[name]: value,
		});
	};

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		await handleToastPromise(
			dispatch(updateOwner(updatedOwner))
				.unwrap()
				.then(() => setIsEditing(false)),
			"Profile updated successfully",
			"Failed to update profile"
		);
	};

	return (
		<div className='bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden'>
			<div className='px-6 py-4 border-b border-gray-800'>
				<h3 className='text-lg font-semibold'>Profile Information</h3>
			</div>

			<div className='p-6'>
				<ConfirmationModal
					isOpen={modalOpen}
					onClose={handleModalClose}
					onConfirm={handleDeleteAccount}
					title='Delete Account'
					message='Are you sure you want to delete your account? This action cannot be undone.'
				/>

				{isEditing && (
					<div className='glassmorphic rounded-2xl p-8 w-full fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<div className='relative bg-white/10 border border-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-2xl'>
							<h2 className='text-3xl font-semibold text-white text-center mb-8 tracking-wide'>
								Update Profile
							</h2>
							<form onSubmit={handleUpdateProfile}>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{["fullname", "username", "contact"].map((field) => (
										<div className='flex flex-col'>
											<label
												htmlFor='field'
												className='text-sm font-medium text-gray-200 mb-1 capitalize'
											>
												{field.replace("contact", "phone number")}
											</label>
											<input
												type={field === "contact" ? "tel" : "text"}
												id={field}
												name={field}
												value={updatedOwner[field]}
												onChange={handleInputChange}
												className='w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder:text-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
												placeholder={`Enter your ${field.replace(
													"contact",
													"phone number"
												)}`}
												autoFocus
												required
											/>
										</div>
									))}
								</div>

								<div className='mt-10 flex justify-center gap-4'>
									<button
										type='submit'
										className='bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition'
									>
										Save Changes
									</button>

									<button
										type='button'
										onClick={() => setIsEditing(false)}
										className='border border-white/30 text-white py-2 px-6 rounded-lg hover:bg-white/10 transition'
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

				<div className='flex flex-col md:flex-row md:space-x-6'>
					<div className='md:w-1/3 mb-6 md:mb-0'>
						<div className='bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col items-center'>
							<div className='h-24 w-24 rounded-full bg-gray-700 border-4 border-gray-800 flex items-center justify-center mb-4'>
								{owner?.avatar ? (
									<img
										src={owner?.avatar}
										alt={owner?.fullname}
										className='h-full w-full object-cover rounded-full'
									/>
								) : (
									<User size={40} className='text-indigo-500' />
								)}
							</div>
							<h3 className='text-lg font-semibold'>{owner?.fullname}</h3>
							<p className='text-gray-400 text-sm'>Store Owner</p>

							<div className='w-full mt-6 space-y-3'>
								<div className='flex items-center text-sm'>
									<Mail size={14} className='text-indigo-400 mr-2' />
									<span className='text-gray-300'>{owner?.email}</span>
								</div>
								<div className='flex items-center text-sm'>
									<Phone size={14} className='text-indigo-400 mr-2' />
									<span className='text-gray-300'>{owner?.contact}</span>
								</div>
							</div>

							<button
								className='mt-6 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium w-full transition-colors'
								onClick={() => setIsEditing(true)}
							>
								Update Profile
							</button>
						</div>
					</div>

					<div className='md:w-2/3'>
						<div className='bg-gray-800 p-6 rounded-lg border border-gray-700 mb-6'>
							<h4 className='font-medium mb-4'>Personal Information</h4>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-gray-400 text-sm mb-1'>
										Full Name
									</label>
									<input
										type='text'
										defaultValue={owner?.fullname}
										className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
									/>
								</div>
								<div>
									<label className='block text-gray-400 text-sm mb-1'>
										Email Address
									</label>
									<input
										type='email'
										defaultValue={owner?.email}
										className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
									/>
								</div>
								<div>
									<label className='block text-gray-400 text-sm mb-1'>
										Phone Number
									</label>
									<input
										type='tel'
										defaultValue={owner?.contact}
										className='w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
									/>
								</div>
							</div>
							<div>
								<button
									className='p-3 w-full mt-6 rounded transition-colors duration-150  hover:bg-transparent border-red-600 border bg-red-700 font-semibold text-sm'
									onClick={handleModalOpen}
									disabled={isLoading}
								>
									Delete account
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProfileTab;
