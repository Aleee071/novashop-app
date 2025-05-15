import handleToastPromise from "../../utils/handleToastPromise";
import { useDispatch } from "react-redux";
import { createOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";

function useRegisterOwner() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const register = async (formData) =>
		await handleToastPromise(
			dispatch(createOwner(formData))
				.unwrap()
				.then(() => navigate("/owner/login")),
			"Registration successful!",
			"Registration failed"
		);

	return { register };
}

export default useRegisterOwner;
