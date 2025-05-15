import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { lazy, Suspense } from "react";
import store from "./app/store.js";
import Loading from "./components/Loading.jsx";
import "./index.css";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
const ErrorPage = lazy(() => import("./pages/ErrorPage.jsx"));
const App = lazy(() => import("./App.jsx"));
const Register = lazy(() => import("./components/auth/Register.jsx"));
const Login = lazy(() => import("./components/auth/Login.jsx"));
const Home = lazy(() => import("./pages/Home.jsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const DashboardPage = lazy(() => import("./pages/OwnerDashboard.jsx"));
const OrdersPage = lazy(() => import("./pages/Orders.jsx"));

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path='/' element={<App />} errorElement={<ErrorPage />}>
			<Route path='*' element={<ErrorPage />} />
			<Route path='/' element={<Home />} />
			<Route path='/register' element={<Register />} />
			<Route path='/register/owner' element={<Register role='owner' />} />
			<Route path='/login' element={<Login />} />
			<Route path='/owner/login' element={<Login role='owner' />} />
			<Route path='/products/product/:productId' element={<ProductDetails />} />
			<Route path='/profile' element={<ProfilePage />} />
			<Route path='/cart/getCart' element={<Cart />} />
			<Route path='/owner/dashboard' element={<DashboardPage />} />
			<Route path='/orders/my-orders' element={<OrdersPage />} />
		</Route>
	)
);

createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router} />
		</Suspense>
	</Provider>
);
