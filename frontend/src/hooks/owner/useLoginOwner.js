import { useDispatch } from "react-redux";
import handleToastPromise from "../../utils/handleToastPromise";
import { getOwner, loginOwner } from "../../api/owner";
import { useNavigate } from "react-router-dom";

function useLoginOwner() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const login = async (credentials) => {
		const result = await handleToastPromise(
			dispatch(loginOwner(credentials)).unwrap(),
			"Login successful!",
			"Login failed"
		);

		if (result.owner) {
			await handleToastPromise(
				dispatch(getOwner()).unwrap(),
				"Owner data fetched!",
				"Failed to fetch owner data"
			);
			navigate("/owner/dashboard");
		}
	};

	return { login };
}

export default useLoginOwner;
