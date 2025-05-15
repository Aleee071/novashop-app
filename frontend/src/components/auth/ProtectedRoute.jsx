import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute() {
	const { user } = useSelector((state) => state.auth);

	if (!user) {
		return <Navigate to='/login' />;
	}
}

export default ProtectedRoute;
