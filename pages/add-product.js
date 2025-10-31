import React, { useRef, useState, useEffect } from "react";
import { IoAddSharp, IoCloseCircleOutline } from "react-icons/io5";
import "react-color-palette/css";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
import isAuth from "@/components/isAuth";
import { MdProductionQuantityLimits } from "react-icons/md";

function AddProduct(props) {
  const router = useRouter();
  const [addProductsData, setAddProductsData] = useState({
    name: "",
    category: "",
    categoryname: "",
  });

  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [attributesData, setAttributesData] = useState([]);
  const [singleProductData, setSingleProductData] = useState({
    price: "",
    value: "",
    unit: "",
    image: null,
    imagePreview: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRefs = useRef([]);

  // First load categories
  useEffect(() => {
    getCategory();
  }, []);

  // Then load product data if editing
  useEffect(() => {
    if (categoryData.length > 0 && router?.query?.id) {
      setIsEditMode(true);
      getProductById(router.query.id);
    }
  }, [categoryData, router?.query?.id]);

  const getCategory = async () => {
    props.loader(true);
    try {
      const res = await Api("get", "getCategory", "", router);
      props.loader(false);

      const formattedData = res.data.map((element) => ({
        ...element,
        value: element._id,
        label: element.name,
      }));

      setCategoryData(formattedData);
    } catch (err) {
      props.loader(false);
      console.log(err);
      props.toaster({ type: "error", message: err?.message });
    }
  };

  const getProductById = async (id) => {
    props.loader(true);
    try {
      const res = await Api("get", `getProductById/${id}`, "", router);
      props.loader(false);

      const product = res?.data;
      console.log("Fetched Product for Edit:", product);

      // Set basic product data
      setAddProductsData({
        name: product?.name || "",
        category: product?.category?._id || product?.category || "",
        categoryname: product?.categoryname || product?.category?.name || "",
      });

      // Find and set selected category
      const selectedCat = categoryData.find(
        (cat) => cat._id === (product?.category?._id || product?.category)
      );

      if (selectedCat) {
        setSelectedCategory(selectedCat);

        // Handle attributes if they exist
        if (product?.attributes && product.attributes.length > 0) {
          const formattedAttrs = product.attributes.map((attr) => ({
            name: attr.name || "",
            _id: attr._id || "",
            value: attr.value || "",
            price: attr.price || "",
            unit: attr.unit || "",
            image: attr.image || null,
            imagePreview: attr.image || null, // Use existing image URL as preview
          }));
          setAttributesData(formattedAttrs);
          setSingleProductData({
            price: "",
            value: "",
            unit: "",
            image: null,
            imagePreview: null,
          });
        } else {
         
          setAttributesData([]);
          setSingleProductData({
            price: product?.price || "",
            value: product?.value || "",
            unit: product?.unit || "",
            image: product?.image || null,
            imagePreview: product?.image || null, // Use existing image URL as preview
          });
        }
      }
    } catch (err) {
      props.loader(false);
      console.log("Get product error:", err);
      props.toaster({ type: "error", message: err?.message || "Error loading product" });
    }
  };

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    const cat = categoryData.find((f) => f._id === categoryId);

    setAddProductsData({
      ...addProductsData,
      category: categoryId,
      categoryname: cat?.name || "",
    });

    setSelectedCategory(cat);

    
    if (!isEditMode || addProductsData.category !== categoryId) {
      if (cat?.attributes && cat.attributes.length > 0) {
        const initialAttributes = cat.attributes.map((attr) => ({
          name: attr.name,
          _id: attr._id,
          value: "",
          price: "",
          unit: "",
          image: null,
          imagePreview: null,
        }));
        setAttributesData(initialAttributes);
        setSingleProductData({
          price: "",
          value: "",
          unit: "",
          image: null,
          imagePreview: null
        });
      } else {
        setAttributesData([]);
        setSingleProductData({
          price: "",
          value: "",
          unit: "",
          image: null,
          imagePreview: null
        });
      }
    }
  };

  const handleAttributeChange = (index, field, value) => {
    const updatedAttributes = [...attributesData];
    updatedAttributes[index][field] = value;
    setAttributesData(updatedAttributes);
  };

  const handleAttributeImageChange = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const updatedAttributes = [...attributesData];
      updatedAttributes[index].image = file;
      updatedAttributes[index].imagePreview = URL.createObjectURL(file);
      setAttributesData(updatedAttributes);
    }
  };

  const removeAttributeImage = (index) => {
    const updatedAttributes = [...attributesData];
    updatedAttributes[index].image = null;
    updatedAttributes[index].imagePreview = null;
    setAttributesData(updatedAttributes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!addProductsData.name || !addProductsData.category) {
      props.toaster({
        type: "error",
        message: "Please fill in Product Name and Category"
      });
      return;
    }

 
    if (attributesData.length > 0) {
      const hasEmptyFields = attributesData.some(
        (attr) => !attr.value || !attr.price || !attr.image || !attr.unit
      );
      if (hasEmptyFields) {
        props.toaster({
          type: "error",
          message: "Please fill all attribute fields: Value, Price, Unit, and Image"
        });
        return;
      }
    } else {
      if (!singleProductData.price) {
        props.toaster({
          type: "error",
          message: "Please fill Price"
        });
        return;
      }
    }

    const formData = new FormData();
    formData.append("name", addProductsData.name);
    formData.append("category", addProductsData.category);
    formData.append("categoryname", addProductsData.categoryname);

    if (isEditMode) {
      formData.append("id", router.query.id);
    }

    if (attributesData.length > 0) {
      attributesData.forEach((attr, index) => {
        formData.append(`attributes[${index}][name]`, attr.name || "");
        formData.append(`attributes[${index}][_id]`, attr._id || "");
        formData.append(`attributes[${index}][value]`, attr.value || "");
        formData.append(`attributes[${index}][price]`, attr.price || "");
        formData.append(`attributes[${index}][unit]`, attr.unit || "");

        if (attr.image instanceof File) {
          formData.append(`attributes[${index}][image]`, attr.image);
        } else if (typeof attr.image === "string" && attr.image.startsWith("http")) {
          formData.append(`attributes[${index}][image]`, attr.image);
        }
      });
    } else {
      formData.append("price", singleProductData.price);
      if (singleProductData.image instanceof File) {
        formData.append("image", singleProductData.image);
      } else if (typeof singleProductData.image === "string" && singleProductData.image.startsWith("http")) {
        formData.append("image", singleProductData.image);
      }
    }

    // Debug check
    console.log("FormData Contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    try {
      props.loader(true);
      const url = isEditMode ? "updateProduct" : "createProduct";
      const res = await ApiFormData("post", url, formData, router);
      props.loader(false);

      console.log("Response:", res);
      props.toaster({
        type: "success",
        message: isEditMode ? "Product updated successfully!" : "Product created successfully!"
      });

      router.push("/products");
    } catch (err) {
      props.loader(false);
      console.error("Submit Error:", err);
      props.toaster({
        type: "error",
        message: err?.message || "Failed to submit form"
      });
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-3 md:px-6">
      <div className="max-w-7xl mx-auto overflow-y-scroll h-screen scrollbar-hide pb-36">
        {/* Header */}
        <div className="flex justify-start items-center gap-4 mb-8 p-6 bg-white shadow-lg rounded-xl ">
          <div className="bg-yellow-100 p-3 rounded-lg">
            <MdProductionQuantityLimits className="text-yellow-600 text-4xl" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {isEditMode ? "Edit Product" : "Add Product"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode ? "Update product details" : "Create a new product entry"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl md:p-6 p-3 ">
          {/* Product Details Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              
              <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
            </div>

            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={addProductsData.category}
                    onChange={handleCategoryChange}
                    required
                    className="w-full h-14 pl-12 pr-10 border-2 border-gray-300 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all text-gray-700 bg-white appearance-none font-medium"
                  >
                    <option value="">Select Category</option>
                    {categoryData?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <span className="absolute left-4 top-4 text-yellow-600 text-2xl">🏷️</span>
                  <span className="absolute right-4 top-5 pointer-events-none text-yellow-600 font-bold">▼</span>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-gray-700 text-base font-semibold mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    className="w-full h-14 pl-12 pr-4 border-2 border-gray-300 rounded-xl outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all text-gray-700 font-medium"
                    type="text"
                    placeholder="Enter product name"
                    value={addProductsData.name}
                    onChange={(e) =>
                      setAddProductsData({
                        ...addProductsData,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <span className="absolute left-4 top-4 text-yellow-600 text-2xl">📦</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attributes or Single Product Section */}
          {selectedCategory && (
            <div className="mt-8">
              {attributesData.length > 0 ? (
                /* Category has attributes */
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-1 w-12 bg-yellow-500 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800">Product Attributes</h2>
                  </div>

                  {attributesData.map((attr, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-yellow-300 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-md">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-bold text-gray-800">{attr.name}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Available Stock */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Available Stock <span className="text-red-500">*</span>
                          </label>
                          <input
                            className="w-full h-12 px-4 border-2 border-yellow-300 rounded-lg outline-none text-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-medium bg-white"
                            type="text"
                            placeholder="Enter stock amount"
                            value={attr.value}
                            onChange={(e) =>
                              handleAttributeChange(index, "value", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Price <span className="text-red-500">*</span>
                          </label>
                          <input
                            className="w-full h-12 px-4 border-2 border-yellow-300 rounded-lg outline-none text-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-medium bg-white"
                            type="text"
                            placeholder="Enter price"
                            value={attr.price}
                            onChange={(e) =>
                              handleAttributeChange(index, "price", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Unit */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Unit <span className="text-red-500">*</span>
                          </label>
                          <select
                            className="w-full h-12 px-4 border-2 border-yellow-300 rounded-lg outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all bg-white text-gray-700 font-medium appearance-none"
                            value={attr.unit}
                            onChange={(e) =>
                              handleAttributeChange(index, "unit", e.target.value)
                            }
                            required
                          >
                            <option value="">Select Unit</option>
                            <option value="kg">Kilogram (kg)</option>
                            <option value="ton">Ton</option>
                            <option value="piece">Piece</option>
                          </select>
                        </div>
                      </div>

                      {/* Image Upload */}
                      <div className="mt-4 p-4 bg-white rounded-lg border-2 border-dashed border-yellow-300">
                        <label className="block text-gray-700 text-sm font-semibold mb-3">
                          Product Image <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-4 flex-wrap">
                          <button
                            type="button"
                            onClick={() => fileInputRefs.current[index]?.click()}
                            className="bg-yellow-600 text-white px-6 py-3 rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
                          >
                            <IoAddSharp className="w-5 h-5" />
                            Choose Image
                          </button>
                          <input
                            type="file"
                            ref={(el) => (fileInputRefs.current[index] = el)}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleAttributeImageChange(index, e)}
                          />
                          {attr.imagePreview && (
                            <div className="relative group">
                              <img
                                src={attr.imagePreview}
                                alt="Preview"
                                className="w-24 h-24 object-cover rounded-lg border-2 border-yellow-400 shadow-md"
                              />
                              <button
                                type="button"
                                onClick={() => removeAttributeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <IoCloseCircleOutline className="text-white w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Category has no attributes - Single product fields */
                <div className="space-y-6">
                
                  <div className="mb-4">
                    {/* Price */}
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Price <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full h-12 px-4 border-2 border-yellow-300 rounded-lg outline-none text-gray-800 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all font-medium bg-white"
                        type="text"
                        placeholder="Enter price"
                        value={singleProductData.price}
                        onChange={(e) =>
                          setSingleProductData({
                            ...singleProductData,
                            price: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {selectedCategory && (
            <div className="mt-10 flex justify-end gap-4 pb-4">
              <button
                type="button"
                onClick={() => router.push("/products")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl shadow-md transition-all transform hover:scale-105 flex items-center gap-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-yellow-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
              >
                {isEditMode ? "Update Product" : "Create Product"}
                <span className="text-xl">→</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default isAuth(AddProduct);