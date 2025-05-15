import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../api/product";
import toast from "react-hot-toast";
import { Plus, Loader2, Upload, X } from "lucide-react";
import handleToastPromise from "../../utils/handleToastPromise";

const CreateProductTab = ({ owner }) => {
	const dispatch = useDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [formData, setFormData] = useState({
		name: "",
		price: "",
		stock: 1,
		description: "",
		discount: 0,
		image: null,
	});

	const [imagePreview, setImagePreview] = useState(null);
	const [dragActive, setDragActive] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData({ ...formData, image: file });
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
			setFormData({ ...formData, image: file });
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const removeImage = () => {
		setFormData({ ...formData, image: null });
		setImagePreview(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.image) {
			toast.error("Image is required");
			return;
		}

		const productData = new FormData();
		productData.append("name", formData.name);
		productData.append("price", formData.price);
		productData.append("stock", formData.stock);
		productData.append("description", formData.description);
		productData.append("discount", formData.discount);
		productData.append("image", formData.image);
		productData.append("owner", owner?._id);

		try {
			setIsSubmitting(true);

			await handleToastPromise(
				dispatch(createProduct(productData))
					.unwrap()
					.then(() => {
						setFormData({
							name: "",
							price: "",
							stock: 1,
							description: "",
							discount: 0,
							image: null,
						}),
							setImagePreview(null);
					}),
				"Product created successfully!",
				"Failed to create product"
			);
		} catch (err) {
			toast.error("Failed to create product");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-900 px-4 py-10 rounded-4xl'>
			<div className='w-full max-w-3xl p-8 rounded-3xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/20'>
				<div className='flex items-center justify-center mb-8'>
					<div className='bg-gradient-to-r from-indigo-400 to-purple-500 p-3 rounded-2xl shadow-lg'>
						<div className='bg-white/10 backdrop-blur-sm p-2 rounded-xl'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-8 w-8 text-white'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
								/>
							</svg>
						</div>
					</div>
					<h2 className='text-4xl font-bold text-white ml-4 tracking-tight'>
						Add New Product
					</h2>
				</div>

				<form
					onSubmit={handleSubmit}
					encType='multipart/form-data'
					className='space-y-8'
				>
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div>
							<label
								htmlFor='name'
								className='text-sm font-medium text-white/90 mb-1.5 block'
							>
								Product Name
							</label>
							<input
								type='text'
								name='name'
								placeholder='Enter product name'
								value={formData.name}
								onChange={handleChange}
								className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='price'
								className='text-sm font-medium text-white/90 mb-1.5 block'
							>
								Price (PKR)
							</label>
							<input
								type='number'
								name='price'
								placeholder='0.00'
								value={formData.price}
								onChange={handleChange}
								className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='stock'
								className='text-sm font-medium text-white/90 mb-1.5 block'
							>
								Stock Quantity
							</label>
							<input
								type='number'
								name='stock'
								placeholder='Quantity available'
								value={formData.stock}
								onChange={handleChange}
								className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all'
								min='0'
								required
							/>
						</div>

						<div>
							<label
								htmlFor='discount'
								className='text-sm font-medium text-white/90 mb-1.5 block'
							>
								Discount (%)
							</label>
							<input
								type='number'
								name='discount'
								placeholder='0'
								value={formData.discount}
								onChange={handleChange}
								className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all'
								min='0'
								max='100'
							/>
						</div>
					</div>

					<div>
						<label
							htmlFor='description'
							className='text-sm font-medium text-white/90 mb-1.5 block'
						>
							Product Description
						</label>
						<textarea
							name='description'
							placeholder='Describe your product...'
							value={formData.description}
							onChange={handleChange}
							rows={4}
							className='w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all resize-none'
						/>
					</div>

					<div>
						<label htmlFor='image' className='text-sm font-medium text-white/90 mb-2 block'>
							Product Image
						</label>
						<div
							className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
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
									<Upload className='h-12 w-12 mx-auto text-white/60 mb-3' />
									<p className='text-sm text-white/70 mb-2'>
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
										src={imagePreview}
										alt='Preview'
										className='h-64 w-full object-contain rounded-lg'
									/>
									<button
										type='button'
										onClick={removeImage}
										className='absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full transition-all'
									>
										<X className='h-4 w-4' />
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

					<button
						type='submit'
						disabled={isSubmitting}
						className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='h-5 w-5 animate-spin' />
								<span>Creating...</span>
							</>
						) : (
							<>
								<Plus className='h-5 w-5' />
								<span>Create Product</span>
							</>
						)}
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreateProductTab;
