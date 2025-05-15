import { useDispatch } from "react-redux";
import handleToastPromise from "../../utils/handleToastPromise";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

function useLoginUser() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const login = async (credentials) =>
		await handleToastPromise(
			dispatch(loginUser(credentials))
				.unwrap()
				.then(() => navigate("/")),
			"Login successful!",
			"Login failed"
		);

	return { login };
}

export default useLoginUser;
