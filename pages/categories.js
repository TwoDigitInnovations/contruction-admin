import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FiEdit, FiSearch } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";

function Categories(props) {
  const router = useRouter();
  const [category, setCategory] = useState({ name: "" });
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllCategories();
  }, []);

  // 🔹 Fetch all categories
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

  // 🔹 Create new category
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { name: category.name };

    Api("post", "createCategory", data, router)
      .then(() => {
        setCategory({ name: "" });
        getAllCategories();
        props.toaster({ type: "success", message: "Category added successfully" });
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Delete category
  const deleteCategory = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this category?",
      showCancelButton: true,
      confirmButtonColor: "#CA8A04", // yellow-600
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Api("delete", `deleteCategory/${_id}`, "", router)
          .then(() => {
            getAllCategories();
            props.toaster({ type: "success", message: "Category deleted" });
          })
          .catch((err) => {
            props.loader(false);
            props.toaster({ type: "error", message: err?.message });
          });
      }
    });
  };

  // 🔹 Get category by ID for editing
  const getCategoryById = (id) => {
    props.loader(true);
    Api("get", `getCategoryById/${id}`, "", router)
      .then((res) => {
        props.loader(false);
        setCategory({ name: res?.data?.name, _id: res?.data?._id });
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Update category
  const updateCategory = (e) => {
    e.preventDefault();
    const data = { name: category.name, id: category._id };

    Api("post", "updateCategory", data, router)
      .then((res) => {
        if (res.status) {
          setCategory({ name: "" });
          getAllCategories();
          props.toaster({ type: "success", message: res?.data?.message || "Category Updated" });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      })
      .catch((err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      });
  };

  // 🔹 Filtered categories based on search
  const filteredCategories = categories.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="w-full h-full bg-transparent py-6 px-6">
      <p className="font-bold text-black md:text-[28px] text-2xl rounded-xl shadow-md p-6 mb-6">
        Manage Categories
      </p>

      <div className="overflow-y-scroll h-screen scrollbar-hide pb-10">
        {/* Category Form */}
        <form
          onSubmit={category?._id ? updateCategory : handleSubmit}
          className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-10"
        >
          <div className="flex flex-col items-center">
            <label className="text-gray-600 text-md font-semibold pb-2 w-full md:w-[500px]">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              value={category.name}
              onChange={(e) => setCategory({ ...category, name: e.target.value })}
              required
              className="bg-gray-50 border border-gray-300 outline-none h-[45px] md:w-[500px] w-full rounded-lg px-4 text-sm font-medium text-black focus:ring-2 focus:ring-yellow-600"
            />

            <button
              type="submit"
              className="mt-6 h-[45px] md:w-[250px] w-full bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold shadow-md shadow-yellow-400/40 transition-all"
            >
              {category?._id ? "Update Category" : "Add Category"}
            </button>
          </div>
        </form>

        {/* 🔍 Search Bar */}
        <div className="relative mb-6 md:w-[600px] w-full ">
          <FiSearch className="absolute left-3 top-3 text-gray-500 text-xl" />
          <input
            type="text"
            placeholder="Search category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-yellow-600 outline-none"
          />
        </div>

       <div className="overflow-y-scroll h-screen scrollbar-hide pb-4"> 
        {filteredCategories.length > 0 ? (
          filteredCategories.map((item) => (
            <div
              key={item._id}
              className="bg-white border border-gray-200 rounded-xl p-5 mb-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-base text-black font-semibold">{item?.name}</p>
              <div className="flex gap-3">
                <FiEdit
                  className="h-6 w-6 text-gray-600 hover:text-yellow-600 cursor-pointer drop-shadow-md"
                  onClick={() => getCategoryById(item._id)}
                />
                <IoCloseCircleOutline
                  className="h-6 w-6 text-gray-600 hover:text-red-500 cursor-pointer drop-shadow-md"
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
