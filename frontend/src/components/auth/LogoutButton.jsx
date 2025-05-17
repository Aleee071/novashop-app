import { useDispatch } from "react-redux";
import { logoutUser } from "../../api/auth";
import { logoutOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import handleToastPromise from "../../utils/handleToastPromise";

function LogoutButton({ className, onClick }) {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const role = localStorage.getItem("role");

	const handleLogout = async () => {
		try {
			if (role === "user") {
				await handleToastPromise(
					dispatch(logoutUser()).unwrap(),
					"Logged out successfully",
					"Failed to logout"
				);
				navigate("/login");
			} else {
				await handleToastPromise(
					dispatch(logoutOwner()).unwrap(),
					"Owner logged out successfully",
					"Failed to logout owner"
				);
				navigate("/owner/login");
			}
			// Clear cookies + role after successful logout
			document.cookie =
				"accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
			document.cookie =
				"refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=None; Secure";
			localStorage.removeItem("role");
			if (onClick) onClick();
		} catch (err) {
			// handleToastPromise already shows error toast
		}
	};

	return (
		<button onClick={handleLogout} className={`... ${className}`}>
			<LogOut size={18} className='mr-2 ...' />
			<span>Logout</span>
		</button>
	);
}

export default LogoutButton;
