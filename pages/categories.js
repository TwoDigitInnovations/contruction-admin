import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiEdit, FiSearch } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";

function Categories(props) {
  const router = useRouter();
  const [category, setCategory] = useState({ name: "", attributes: [] });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attribute, setAttribute] = useState("");

  useEffect(() => {
    getAllCategories();
  }, []);

  // 🔹 Get All Categories
  const getAllCategories = async () => {
    props.loader(true);
    Api("get", "getCategory", "", router)
      .then((res) => {
        props.loader(false);
        setCategories(res?.data || []);
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Add Category
  const handleSubmit = (e) => {
    e.preventDefault();
    if (category.attributes.length === 0) {
      return props.toaster({
        type: "error",
        message: "Please add at least one attribute.",
      });
    }

    const data = {
      name: category.name,
      attributes: category.attributes.map((a) => ({ name: a.name })),
    };

    Api("post", "createCategory", data, router)
      .then(() => {
        setCategory({ name: "", attributes: [] });
        getAllCategories();
        props.toaster({
          type: "success",
          message: "Category added successfully",
        });
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Delete Category
  const deleteCategory = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      showCancelButton: true,
      confirmButtonColor: "#CA8A04",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Api("delete", `deleteCategory/${_id}`, "", router)
          .then(() => {
            getAllCategories();
            props.toaster({
              type: "success",
              message: "Category deleted",
            });
          })
          .catch((err) => {
            props.loader(false);
            props.toaster({ type: "error", message: err?.message });
          });
      }
    });
  };

  // 🔹 Fetch Category by ID for Edit
  const getCategoryById = (id) => {
    props.loader(true);
    Api("get", `getCategoryById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        setCategory({
          _id: res?.data?._id,
          name: res?.data?.name || "",
          attributes: res?.data?.attributes || [],
        });
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Update Category
  const updateCategory = (e) => {
    e.preventDefault();
    const data = {
      id: category._id,
      name: category.name,
      attributes: category.attributes.map((a) => ({
        _id: a._id || undefined, // keep existing _id if present
        name: a.name,
      })),
    };

    Api("post", "updateCategory", data, router)
      .then((res) => {
        if (res.status) {
          setCategory({ name: "", attributes: [] });
          getAllCategories();
          props.toaster({
            type: "success",
            message: res?.data?.message || "Category updated successfully",
          });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  
  const inputAttribute = (e) => {
    e.preventDefault();
    if (attribute.trim() === "") return;

    const newAttribute = {
      _id: null, 
      name: attribute.trim(),
    };

    setCategory((prev) => ({
      ...prev,
      attributes: [...prev.attributes, newAttribute],
    }));
    setAttribute("");
  };

  console.log("category attributes:", category.attributes);

  const deleteAttribute = (attrIdOrName) => {
    setCategory((prev) => ({
      ...prev,
      attributes: prev.attributes.filter(
        (a) => a._id !== attrIdOrName && a.name !== attrIdOrName
      ),
    }));
  };

  // 🔹 Search Filter
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full min-h-screen bg-gray-50 py-6 px-6">
      <div className="overflow-y-scroll h-screen scrollbar-hide pb-56">
        <p className="font-bold text-black md:text-[28px] text-2xl rounded-xl shadow-md p-6 mb-6 bg-white">
          Manage Categories
        </p>

        {/* Category Form */}
        <form
          onSubmit={category?._id ? updateCategory : handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-10"
        >
          <label className="text-gray-600 text-md font-semibold pb-2 block">
            Category Name
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={category.name}
            onChange={(e) =>
              setCategory({ ...category, name: e.target.value })
            }
            required
            className="bg-gray-50 border border-gray-300 outline-none h-[45px] w-full rounded-lg px-4 text-sm font-medium text-black focus:ring-2 focus:ring-yellow-600"
          />

          <p className="text-gray-500 font-semibold text-sm mt-4 pb-1">
            Attributes
          </p>
          <div className="flex gap-3 mb-4">
            <input
              className="bg-gray-50 border border-gray-300 outline-none h-[45px] flex-1 rounded-lg px-4 text-sm font-medium text-black focus:ring-2 focus:ring-yellow-600"
              type="text"
              value={attribute}
              placeholder="Enter attribute"
              onChange={(e) => setAttribute(e.target.value)}
            />
            <button
              className="bg-yellow-600 hover:bg-yellow-700 px-5 font-semibold rounded-md md:py-3 py-2 text-white transition"
              onClick={inputAttribute}
            >
              Add
            </button>
          </div>

          {/* Attribute Chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            {category.attributes?.map((attr, i) => (
              <div
                key={attr._id || i}
                className="flex items-center gap-2 bg-yellow-100 text-yellow-800 font-medium px-3 py-1 rounded-full border border-yellow-300"
              >
                <span>{attr.name}</span>
                <IoCloseCircleOutline
                  className="text-gray-600 text-xl cursor-pointer hover:text-red-500"
                  onClick={() => deleteAttribute(attr._id || attr.name)}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="py-3 w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold shadow-md shadow-yellow-400/40 transition-all"
          >
            {category?._id ? "Update Category" : "Add Category"}
          </button>
        </form>

        {/* Search Bar */}
        <div className="relative mb-6 max-w-2xl">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yellow-600 outline-none"
          />
        </div>

        {/* Category List */}
        <div className="max-w-7xl mx-auto space-y-4">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="text-base text-black font-semibold">
                    {item?.name}
                  </p>
                  {item?.attributes?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.attributes.map((a, i) => (
                        <span
                          key={i}
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs"
                        >
                          {a?.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <FiEdit
                    className="h-6 w-6 text-gray-600 hover:text-yellow-600 cursor-pointer"
                    onClick={() => getCategoryById(item._id)}
                  />
                  <IoCloseCircleOutline
                    className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer"
                    onClick={() => deleteCategory(item._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-gray-500 min-h-[300px]">
              No categories found
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default isAuth(Categories);
