import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { refreshToken } from "../api/auth";
import { refreshToken as ownerRefreshToken } from "../api/owner";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

function useAuthRefresh() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, tokenExpiry } = useSelector((state) => state.auth);
	const { owner, tokenExpiry: ownerTokenExpiry } = useSelector(
		(state) => state.owner
	);
	const [refreshing, setRefreshing] = useState(false);
	const role = localStorage.getItem("role");

	useEffect(() => {
		if (role === "user") {
			if (!user || !tokenExpiry) return;
			var expiryTime = new Date(tokenExpiry).getTime();
		} else if (role === "owner") {
			if (!owner || !ownerTokenExpiry) return;
			var expiryTime = new Date(ownerTokenExpiry).getTime();
		}

		const currentTime = new Date().getTime();
		const timeUntilExpiry = expiryTime - currentTime;

		const refreshTime = timeUntilExpiry - 300000; // 5 minutes before expiry
		const minRefreshTime = 60000; // 1 minute minimum

		const timeout = setTimeout(() => {
			handleTokenRefresh();
		}, Math.max(refreshTime, minRefreshTime));

		return () => clearTimeout(timeout);
	}, [dispatch, user?._id, owner?._id, tokenExpiry, ownerTokenExpiry]);

	const handleTokenRefresh = async () => {
		let result = null;
		try {
			setRefreshing(true);
			if (role === "user") {
				result = await dispatch(refreshToken()).unwrap();
			} else if (role === "owner") {
				result = await dispatch(ownerRefreshToken()).unwrap();
			}

			if (result && result.tokenExpiry) {
				console.log("Token refreshed successfully");
			}
		} catch (error) {
			console.error("Token refresh failed:", error);
			toast.error("⚠️ Session expired. Please login again.");
			navigate("/login");
		} finally {
			setRefreshing(false);
		}
	};

	return { refreshing };
}

export default useAuthRefresh;
