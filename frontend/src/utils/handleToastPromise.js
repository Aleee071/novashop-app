import toast from "react-hot-toast";

function handleToastPromise(promise, successMessage, fallbackErrorMessage) {
	toast.loading("Please wait...");
	return promise
		.then((res) => {
			toast.dismiss();
			toast.success(successMessage);
			return res;
		})
		.catch((error) => {
			toast.dismiss();

			// Extract actual error message from thunk
			const actualErrorMessage =
				typeof error === "string"
					? error
					: error?.message ||
					  error?.response?.data?.message ||
					  fallbackErrorMessage;

			toast.error(actualErrorMessage);
			console.log("Error:", actualErrorMessage);
			throw error;
		});
}

export default handleToastPromise;
