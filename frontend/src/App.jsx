import useAuthRefresh from "./hooks/useAuthRefresh";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";
import useInitialFetch from "./hooks/useInitialFetch";

function App() {
	useAuthRefresh();
	useInitialFetch();

	return (
		<>
			<Toaster
				position='top-center'
				toastOptions={{
					duration: 2000,
					style: {
						background: "#1f2937", // bg-gray-800
						color: "#d1d5db", // text-gray-300
						border: "1px solid #374151", // border-gray-700
						padding: "12px 16px",
						fontSize: "0.875rem",
						borderRadius: "0.5rem", // rounded-md
					},
					success: {
						iconTheme: {
							primary: "#4f46e5", // indigo-600
							secondary: "#d1d5db", // text-gray-300
						},
					},
					error: {
						iconTheme: {
							primary: "#ef4444", // red-500
							secondary: "#d1d5db",
						},
					},
				}}
				className='z-50'
			/>

			<Navbar />
			<Outlet />
			<Footer />
		</>
	);
}

export default App;
