import handleToastPromise from "../../utils/handleToastPromise";
import { useDispatch } from "react-redux";
import { createOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";

function useRegisterOwner() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const register = async (formData) => {
		const res = await handleToastPromise(
			dispatch(createOwner(formData)).unwrap(),
			"Registration successful!",
			"Registration failed"
		);

		res.owner && navigate("/owner/login");
	};
	return { register };
}

export default useRegisterOwner;
