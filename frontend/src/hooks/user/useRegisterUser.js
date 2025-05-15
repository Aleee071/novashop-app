import handleToastPromise from "../../utils/handleToastPromise";
import { useDispatch } from "react-redux";
import { registerUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";

function useRegisterUser() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const register = async (formData) =>
		await handleToastPromise(
			dispatch(registerUser(formData))
				.unwrap()
				.then(() => navigate("/login")),
			"Registration successful!",
			"Registration failed"
		);

	return { register };
}

export default useRegisterUser;
