import handleToastPromise from "../../utils/handleToastPromise";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../api/owner";
import { useState } from "react";

const SettingsTab = () => {
	const dispatch = useDispatch();
	const { isLoading } = useSelector((state) => state.owner);
	const [password, setPassword] = useState({
		oldPassword: "",
		newPassword: "",
	});

	const handlePasswordChange = async (password) => {
		const res = await handleToastPromise(
			dispatch(changePassword(password)).unwrap(),
			"Password changed successfully",
			"Failed to change password"
		);

		if (res) {
			setPassword({ oldPassword: "", newPassword: "" });
		}
	};
	return (
		<div className='bg-gray-900 rounded-lg border border-gray-800 shadow-lg overflow-hidden'>
			<div className='px-6 py-4 border-b border-gray-800'>
				<h3 className='text-lg font-semibold text-white'>Account Settings</h3>
			</div>

			<div className='p-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Account Preferences */}
					<div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
						<h4 className='font-medium text-white mb-4'>Account Preferences</h4>

						<div className='space-y-4'>
							{/* Email Notifications */}
							<div className='flex items-center justify-between'>
								<div>
									<h5 className='font-medium text-white'>
										Email Notifications
									</h5>
									<p className='text-xs text-gray-400'>
										Receive emails about your account activity
									</p>
								</div>
								<div className='h-6 w-12 bg-indigo-600 rounded-full relative cursor-pointer'>
									<div className='h-5 w-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm'></div>
								</div>
							</div>

							{/* SMS Notifications */}
							<div className='flex items-center justify-between'>
								<div>
									<h5 className='font-medium text-white'>SMS Notifications</h5>
									<p className='text-xs text-gray-400'>
										Receive text messages for important updates
									</p>
								</div>
								<div className='h-6 w-12 bg-gray-700 rounded-full relative cursor-pointer'>
									<div className='h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm'></div>
								</div>
							</div>

							{/* Two-Factor Authentication */}
							<div className='flex items-center justify-between'>
								<div>
									<h5 className='font-medium text-white'>
										Two-Factor Authentication
									</h5>
									<p className='text-xs text-gray-400'>
										Add an extra layer of security to your account
									</p>
								</div>
								<div className='h-6 w-12 bg-gray-700 rounded-full relative cursor-pointer'>
									<div className='h-5 w-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm'></div>
								</div>
							</div>
						</div>
					</div>

					{/* Password & Security */}
					<div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
						<h4 className='font-medium text-white mb-4'>Password & Security</h4>

						<form className='space-y-4'>
							<div>
								<label className='block text-gray-400 text-sm mb-1'>
									Current Password
								</label>
								<input
									type='password'
									placeholder='Enter current password'
									className='w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={password.oldPassword}
									onChange={(e) =>
										setPassword({
											...password,
											oldPassword: e.target.value,
										})
									}
								/>
							</div>

							<div>
								<label className='block text-gray-400 text-sm mb-1'>
									New Password
								</label>
								<input
									type='password'
									placeholder='Enter new password'
									className='w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
									value={password.newPassword}
									onChange={(e) =>
										setPassword({
											...password,
											newPassword: e.target.value,
										})
									}
								/>
							</div>

							<div className='pt-2'>
								<button
									type='submit'
									disabled={isLoading}
									className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer'
									onClick={() => handlePasswordChange(password)}
								>
									Save Changes
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SettingsTab;
