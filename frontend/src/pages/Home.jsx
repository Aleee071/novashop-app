import Loading from "../components/Loading";
import { useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";

function Home() {
	const { isLoading, products } = useSelector((state) => state.product);

	return (
		<div>
			{isLoading && <Loading />}
			<div className='bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 p-8 min-h-screen'>
				<div className='max-w-7xl mx-auto'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{products?.length > 0 ? (
							products?.map((product) => (
								<ProductCard key={product._id} product={product} />
							))
						) : (
							<p className='col-span-full text-center text-gray-300'>
								{!isLoading && <span>No products found</span>}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Home;
