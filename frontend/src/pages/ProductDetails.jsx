import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
	ArrowLeft,
	ShoppingCart,
	Trash2,
	Pencil,
	Star,
	Upload,
	X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getProduct, updateProduct } from "../api/product";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { addProductToCart, getCart } from "../api/cart";
import handleToastPromise from "../utils/handleToastPromise";
import { useState } from "react";
import ConfirmationModal from "../components/ConfirmationModal";

const ProductDetails = () => {
	const { productId } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const baseUrl = import.meta.env.VITE_REACT_BASE_URL;
	const role = localStorage.getItem("role");

	const { owner } = useSelector((state) => state.owner);
	let { currentProduct, isLoading } = useSelector((state) => state.product);
	currentProduct = currentProduct?.data;

	const productOwner = currentProduct?.owner?._id;

	const [productToBeUpdated, setProductToBeUpdated] = useState({
		name: currentProduct?.name,
		description:
			currentProduct?.description || "No description given for this product",
		price: currentProduct?.price,
		image: currentProduct?.image,
		stock: currentProduct?.stock,
		discount: currentProduct?.discount,
	});

	const [isEditing, setIsEditing] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [imagePreview, setImagePreview] = useState(null);
	const [dragActive, setDragActive] = useState(false);

	useEffect(() => {
		toast.loading("Fetching product...");
		const fetchProduct = async () => {
			try {
				await handleToastPromise(
					dispatch(getProduct(productId)),
					"Product fetched successfully",
					"Failed to fetch product"
				);
			} catch (error) {
				toast.dismiss();
				console.error("Fetch error:", res.payload || error);
			}
		};

		fetchProduct();
	}, [productId, dispatch]);

	useEffect(() => {
		if (currentProduct) {
			setProductToBeUpdated({
				name: currentProduct?.name || "",
				description:
					currentProduct?.description ||
					"No description given for this product",
				price: currentProduct?.price,
				image: currentProduct?.image,
				stock: currentProduct?.stock,
				discount: currentProduct?.discount,
			});
		}
	}, [currentProduct]);

	if (!currentProduct && isLoading) {
		return (
			<div className='text-center text-white mt-10'>
				<Loading />
			</div>
		);
	}

	const discountedPrice =
		currentProduct?.price -
		(currentProduct?.price * currentProduct?.discount) / 100;

	const handleAddToCart = async () => {
		const res = await handleToastPromise(
			dispatch(
				addProductToCart({ productId: currentProduct?._id, quantity: 1 })
			).unwrap(),
			"Product added to cart successfully",
			"Failed to add product to cart"
		);

		if (res.status === 200) await dispatch(getCart());
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setProductToBeUpdated({
			...productToBeUpdated,
			[name]: value,
		});
	};

	const handleModalOpen = () => {
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
	};

	const handleDeleteProduct = async () => {
		await handleToastPromise(
			dispatch(deleteProduct(currentProduct?._id))
				.unwrap()
				.then(() => {
					navigate("/");
				}),
			"Product deleted successfully",
			"Failed to delete product"
		);
	};

	// handle image
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProductToBeUpdated({ ...productToBeUpdated, image: file });
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const handleDrag = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			const file = e.dataTransfer.files[0];
			setProductToBeUpdated({ ...productToBeUpdated, image: file });
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const removeImage = () => {
		setProductToBeUpdated({ ...productToBeUpdated, image: null });
		setImagePreview(null);
	};

	const handleUpdateProduct = async (e) => {
		e.preventDefault();

		if (!productToBeUpdated.image) {
			toast.error("Image is required");
			return;
		}

		const productData = new FormData();
		productData.append("name", productToBeUpdated.name);
		productData.append("price", productToBeUpdated.price);
		productData.append("stock", productToBeUpdated.stock);
		productData.append("description", productToBeUpdated.description);
		productData.append("discount", productToBeUpdated.discount);
		productData.append("image", productToBeUpdated.image);

		const res = await handleToastPromise(
			dispatch(
				updateProduct({ id: currentProduct._id, productData: productData })
			)
				.unwrap()
				.then(() => setIsEditing(false)),
			"Product updated successfully",
			"Failed to update product"
		);

		res &&
			(await handleToastPromise(
				dispatch(getProduct(productId)).unwrap(),
				"Product fetched successfully",
				"Failed to fetch product"
			));
	};

	return (
		<div className='mx-auto px-4 py-10 bg-gradient-to-r to-indigo-600/60 from-slate-900/60 text-white'>
			<ConfirmationModal
				isOpen={modalOpen}
				onClose={handleModalClose}
				onConfirm={handleDeleteProduct}
				title='Delete Product'
				message='Are you sure you want to delete this product?'
			/>
			<button
				className='mb-6 text-indigo-400 hover:text-indigo-300 flex items-center cursor-pointer'
				onClick={() => navigate(-1)}
			>
				<ArrowLeft className='mr-1' /> Back
			</button>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-10 bg-gray-900/80 p-6 rounded-2xl shadow-xl'>
				{isEditing && (
					<div className='fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm scrollbar-hide p-4 pt-8'>
						<div
							className='relative w-full max-w-3xl bg-white/10 border border-white/30 backdrop-blur-xl shadow-2xl rounded-2xl p-5 md:p-6 my-2 mx-auto'
							onClick={(e) => e.stopPropagation()}
						>
							<button
								type='button'
								onClick={() => setIsEditing(false)}
								className='absolute top-3 right-3 text-white/70 hover:text-white transition-colors'
								aria-label='Close'
							>
								<X className='h-5 w-5' />
							</button>

							<h2 className='text-xl md:text-2xl font-semibold text-white text-center mb-4 tracking-wide'>
								Update Profile
							</h2>

							<form
								onSubmit={handleUpdateProduct}
								className='max-h-[80vh] overflow-y-auto pr-2 scrollbar-hide'
							>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
									{/* Text/Number Fields */}
									<div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
										{["name", "price", "stock", "discount"].map((field) => (
											<div className='flex flex-col' key={field}>
												<label
													htmlFor={field}
													className='text-xs font-medium text-gray-200 mb-1 capitalize'
												>
													{field}
												</label>
												<input
													type={field === "name" ? "text" : "number"}
													id={field}
													name={field}
													value={productToBeUpdated[field] || ""}
													onChange={handleInputChange}
													className='w-full px-3 py-1.5 rounded-lg bg-white/20 text-white placeholder:text-gray-300 border border-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition'
													placeholder={`Enter ${field} here`}
													step={
														field === "price" || field === "discount"
															? "1"
															: null
													}
													min={
														field === "price" || field === "stock"
															? "0"
															: field === "discount"
															? "0"
															: null
													}
													max={field === "discount" ? "100" : null}
													required
												/>
											</div>
										))}
									</div>

									{/* Description Field - Full Width */}
									<div className='md:col-span-2'>
										<label
											htmlFor='description'
											className='text-xs font-medium text-gray-200 mb-1 capitalize'
										>
											Description
										</label>
										<textarea
											id='description'
											name='description'
											value={productToBeUpdated.description || ""}
											onChange={handleInputChange}
											className='w-full px-3 py-1.5 h-16 rounded-lg bg-white/20 text-white placeholder:text-gray-300 border border-white/30 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none'
											placeholder='Enter product description here'
											required
										/>
									</div>

									{/* Image Upload */}
									<div className='md:col-span-2'>
										<label className='text-xs font-medium text-white/90 mb-1 block'>
											Product Image
										</label>
										<div
											className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all ${
												dragActive
													? "border-purple-400 bg-purple-500/10"
													: "border-white/20 bg-white/5 hover:bg-white/10"
											} cursor-pointer`}
											onDragEnter={handleDrag}
											onDragLeave={handleDrag}
											onDragOver={handleDrag}
											onDrop={handleDrop}
										>
											{!imagePreview ? (
												<>
													<Upload className='h-8 w-8 mx-auto text-white/60 mb-2' />
													<p className='text-xs text-white/70 mb-1'>
														Drag and drop your image here, or{" "}
														<label className='text-purple-400 hover:text-purple-300 cursor-pointer'>
															browse
															<input
																type='file'
																accept='image/*'
																onChange={handleImageChange}
																className='hidden'
															/>
														</label>
													</p>
													<p className='text-xs text-white/50'>
														Supports: JPG, PNG, WebP (Max 5MB)
													</p>
												</>
											) : (
												<div className='relative'>
													<img
														src={
															imagePreview ||
															`${baseUrl}/images/${currentProduct?.image}`
														}
														alt='Product preview'
														className='h-40 w-full object-contain rounded-lg'
														onError={(e) => {
															e.target.onerror = null;
															e.target.src = "fallback-image-url.jpg";
														}}
													/>
													<button
														type='button'
														onClick={removeImage}
														className='absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition-all'
														aria-label='Remove image'
													>
														<X className='h-3 w-3' />
													</button>
												</div>
											)}

											<input
												type='file'
												accept='image/*'
												onChange={handleImageChange}
												className='hidden'
												id='product-image'
											/>
										</div>
									</div>
								</div>

								{/* Form Actions */}
								<div className='mt-5 flex justify-center gap-3'>
									<button
										type='submit'
										className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1.5 px-4 rounded-md shadow transition'
									>
										Save Changes
									</button>

									<button
										type='button'
										onClick={() => setIsEditing(false)}
										className='border border-white/30 text-white py-1.5 px-4 rounded-md hover:bg-white/10 transition'
									>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
				{/* Image Section */}
				<div className='rounded-xl overflow-hidden'>
					<img
						src={`${baseUrl}/images/${currentProduct?.image}`}
						alt={currentProduct?.name}
						className='w-full h-full object-cover rounded-lg'
					/>
				</div>

				{/* Info Section */}
				<div className='flex flex-col justify-between'>
					<div>
						<div className='flex items-center gap-2'>
							<h2 className='text-2xl font-bold text-indigo-400'>
								{currentProduct?.name}
							</h2>

							{currentProduct?.discount > 0 && (
								<span className='bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded-md'>
									{currentProduct?.discount}% OFF
								</span>
							)}
						</div>

						<p className='text-gray-300 mt-2 text-base'>
							{currentProduct?.description || "No description available"}
						</p>

						<div className='mt-4 flex items-center gap-4'>
							{currentProduct?.discount > 0 ? (
								<>
									<span className='text-lg font-bold text-emerald-400'>
										RS {discountedPrice.toFixed(0)}
									</span>
									<span className='text-gray-400 text-sm line-through'>
										RS {currentProduct?.price}
									</span>
								</>
							) : (
								<span className='text-lg font-bold text-white'>
									RS {currentProduct?.price}
								</span>
							)}
						</div>

						<div className='mt-2 text-sm'>
							<span className='text-gray-400'>Stock:</span>{" "}
							<span
								className={`font-semibold ${
									currentProduct?.stock === 0 ? "text-red-400" : "text-white"
								}`}
							>
								{currentProduct?.stock === 0
									? "Out of stock"
									: currentProduct?.stock}
							</span>
						</div>

						<div className='mt-1 text-sm'>
							<span className='text-gray-400'>Category:</span>{" "}
							{currentProduct?.category || "General"}
						</div>

						<div className='mt-1 text-sm flex items-center gap-1 text-amber-400'>
							<Star size={16} fill='currentColor' />
							<span>{currentProduct?.rating || "4.5"}</span>
						</div>

						<div className='mt-2 text-sm text-gray-400'>
							Sold by:{" "}
							<span className='text-indigo-300'>
								{currentProduct?.owner?.fullname || "Unknown"}
							</span>
						</div>
					</div>

					{role === "user" ? (
						<button
							disabled={currentProduct?.stock === 0}
							className={`mt-6 py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold transition ${
								currentProduct?.stock === 0
									? "bg-gray-600 cursor-not-allowed text-gray-300"
									: "bg-indigo-600 hover:bg-indigo-500 text-white"
							}`}
							onClick={handleAddToCart}
						>
							<ShoppingCart size={18} />{" "}
							{currentProduct?.stock === 0 ? "Out of Stock" : "Add to Cart"}
						</button>
					) : (
						<div className='flex gap-x-3 mt-4'>
							<button
								className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 transition-colors duration-200 shadow-lg text-white font-semibold text-sm ${
									currentProduct?.stock === 0 || productOwner !== owner?._id
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={() => setIsEditing(true)}
								disabled={
									currentProduct?.stock === 0 || productOwner !== owner?._id
								}
							>
								<Pencil size={16} />
								Edit
							</button>
							<button
								className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-md bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-colors duration-200 shadow-lg text-white font-semibold text-sm ${
									productOwner !== owner?._id
										? "opacity-50 cursor-not-allowed"
										: ""
								}`}
								onClick={handleModalOpen}
								disabled={productOwner !== owner?._id}
							>
								<Trash2 size={16} />
								Delete
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProductDetails;
