import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../api/auth";
import { logoutOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import handleToastPromise from "../../utils/handleToastPromise";

function LogoutButton({ className, onClick }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { user } = useSelector((state) => state.auth);

	const handleLogout = async () => {
		if (user) {
			await handleToastPromise(
				dispatch(logoutUser())
					.unwrap()
					.then(() => {
						localStorage.removeItem("role");
						navigate("/login");
					}),
				"Logged out successfully",
				"Failed to logout"
			);
		} else {
			await handleToastPromise(
				dispatch(logoutOwner())
					.unwrap()
					.then(() => {
						localStorage.removeItem("role");
						navigate("/owner/login");
					}),
				"Owner logged out successfully",
				"Failed to logout owner"
			);
		}

		if (onClick) onClick();
	};

	return (
		<button
			onClick={handleLogout}
			className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white ml-2 py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-indigo-900/30 group ${className}`}
		>
			<LogOut
				size={18}
				className='mr-2 transition-transform duration-300 group-hover:translate-x-1'
			/>
			<span>Logout</span>
		</button>
	);
}

export default LogoutButton;
