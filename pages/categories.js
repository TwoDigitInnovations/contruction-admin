import { Api, ApiFormData } from "@/services/service";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from "sweetalert2";
import { MdOutlineFileUpload } from "react-icons/md";
import isAuth from "@/components/isAuth";

function Categories(props) {
  const router = useRouter();
  const [category, setCategory] = useState({
    name: "",
    // image: "",
  });
  const [loadTypeData, setloadTypeData] = useState([]);
  const [productPopup, setProductPopup] = useState(false);
  const [deleteid, setdeleteid] = useState(null);
  const [editid, seteditid] = useState("");
  const f = useRef(null);

  // Add attribute
  const [addAttribute, setAddAttribute] = useState([]);
  const [attribute, setAttribute] = useState("");
  const [editAttributeId, setEditAttributeId] = useState("");

  // const handleInput = (e) => {
  //   setAttribute(e.target.value);
  // };

  // const inputAttribute = (e) => {
  //   e.preventDefault();
  //   if (attribute.trim() === "") return;

  //   if (editAttributeId) {
  //     setAddAttribute((prev) =>
  //       prev.map((item) =>
  //         item.id === editAttributeId ? { ...item, name: attribute } : item
  //       )
  //     );
  //     setEditAttributeId("");
  //   } else {
  //     setAddAttribute((prev) => [...prev, { name: attribute, id: Date.now() }]);
  //   }
  //   setAttribute("");
  // };

  // const editAttribute = (id) => {
  //   const attributeToEdit = addAttribute.find((item) => item.id === id);
  //   if (attributeToEdit) {
  //     setAttribute(attributeToEdit.name);
  //     setEditAttributeId(id);
  //   }
  // };





  // const deleteAttribute = (id) => {
  //   setAddAttribute((prev) => prev.filter((item) => item.id !== id));
  // };

  useEffect(() => {
    getalltrucktype();
  }, []);

  const getalltrucktype = async () => {
    //**************** */
    props.loader(true);
    Api("get", "getCategory", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================> form data :: ", res);
        setloadTypeData(res.data);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const submit = (e) => {
    e.preventDefault();
    // return

    // let method = "post";
    // const data = {
    //     name: addCategory?.categoryName,
    //     image: addCategory?.img,
    //     parameter_type: value
    // }
    // let url = "createCategory";
    // data.attributes = addAttribute;
    // if (editid) {
    //   data.id = data._id;
    //   url = `updateCategory`;
    //   method = "post";
    // }

    const data = {
      name:  category?.name,
    };

    Api("post", "createCategory", data, router).then(
      (res) => {
        console.log("Post truck type", res);
         setCategory({
           name: "",
        });
        getalltrucktype();
        seteditid("");
      },
      (err) => {
        console.log(err);
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const deleteCategory = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    }).then(function (result) {
      console.log(result);
      if (result.isConfirmed) {
        const data = {
          _id,
        };

        props.loader(true);
        Api("delete", `deleteCategory/${_id}`, data, router).then(
          (res) => {
            console.log("res================>", res.data?.meaasge);
            props.loader(false);

            getalltrucktype();
            setProductPopup(false);
            setdeleteid(null);
          },
          (err) => {
            props.loader(false);
            console.log(err);
            props.toaster({ type: "error", message: err?.data?.meaasge });
            props.toaster({ type: "error", message: err?.meaasge });
          }
        );
      } else if (result.isDenied) {
        
      }
    });
  };

  const getCategoryById = async (id) => {
    props.loader(true);
    Api("get", `getCategoryById/${id}`, "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
         setCategory({
           name: res?.data?.name,
          _id: res?.data?._id,
        });
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };



  const updateCategory = async (e) => {
    e.preventDefault();
    const data = {
      name: category?.name,
      id: category?._id,
    };
    console.log(data);
    props.loader(true);
    Api("post", "updateCategory", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
           setCategory({
             name: "",
            
          });
           getalltrucktype()
          props.toaster({ type: "success", message: res.data?.message });
        } else {
          props.toaster({ type: "error", message: res?.data?.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };








  // const handleImageChange = (event) => {
  //   const file = event.target.files[0];
  //   const datas = new FormData();
  //   datas.append("file", file);
  //   props.loader(true);
  //   ApiFormData("post", "/user/fileupload", datas, router).then(
  //     (res) => {
  //       props.loader(false);
  //       console.log("res================>", res);
  //       if (res.status) {
  //         setData({ ...data, image: res.data.file });
  //         props.toaster({ type: "success", message: res.data.message });
  //       }
  //     },
  //     (err) => {
  //       props.loader(false);
  //       console.log(err);
  //       props.toaster({ type: "error", message: err?.message });
  //     }
  //   );
  //   const reader = new FileReader();
  //   // let key = event.target.name;
  //   // reader.onloadend = () => {
  //   //   const base64 = reader.result;
  //   //   console.log(base64);
  //   //   // setData({ ...data, img: base64, profile: file });
  //   // };

  //   // if (file) {
  //   //   reader.readAsDataURL(file);
  //   // }
  // };

  return (
    <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <p className=" font-bold  text-black md:text-[25px] text-2xl md:pb-0 pb-3">
        Add Categories
      </p>

      <section className="h-full w-full overflow-scroll no-scrollbar md:mt-9 mt-5 md:pb-40 pb-32">
        <form
          className="bg-white border mb-10 border-custom-lightsGrayColor rounded-[10px] p-5 "
          onSubmit={category?._id ? updateCategory : submit}
        >
          <div className="flex justify-center items-center">
            <img className="h-[112px] w-[112px]" src="/truckImg.png" />
          </div>

          <div className="md:flex flex-col justify-center items-center pt-10">
            <div className="flex flex-col justify-start items-start md:w-auto w-full">
              <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">
                Add Categories
              </p>
              <input
                className="bg-custom-lightGrayInputBg border border-custom-offWhite outline-none md:h-[50px] h-[40px] md:w-[500px] w-full rounded-[5px] px-5 text-sm font-normal text-black"
                type="text"
                placeholder="Name of Category"
                value={category?.name}
                onChange={(e)=>{setCategory({...category, name:e.target.value})}}
                required
              />
            </div>
            {/* <div className="mt-5 relative"> */}
            {/* <div className="flex flex-col justify-start items-start">
                <p className="text-custom-lightGrayInputName text-sm font-semibold pb-2">
                  Upload image
                </p>
                <div className="bg-custom-lightGrayInputBg  border border-custom-offWhite md:h-[50px] h-[40px] md:w-[500px] w-full rounded-[5px] px-5 text-sm font-normal text-black flex justify-start items-center">
                  <input
                    type="text"
                    className="bg-custom-lightGrayInputBg outline-none md:w-[90%] w-[85%]"
                    value={data?.image}
                    onChange={(e) => {
                      setData({ ...data, image: e.target.value });
                    }}
                    required
                  />
                </div>
              </div> */}

            {/* Add attribute code start */}
            {/* <div className="mt-4"> */}
            {/* <p className="text-custom-lightGrayInputName font-semibold text-sm pb-1 ">
                  Attribute
                </p>
                 <div className="flex gap-3 ">
                  <input
                    className="border rounded-md text-black  bg-custom-lightGrayInputBg border-custom-offWhite px-4 outline-none md:w-full w-full"
                    type="text"
                    value={attribute}
                    onChange={handleInput}
                  />
                  <button
                    className="bg-yellow-600 px-5 font-semibold rounded-md py-3"
                    onClick={inputAttribute}
                  >
                    {editAttributeId ? "Update" : "Add"}
                  </button>
                </div>  */}

            <div className="mt-5">
              <ul>
                {addAttribute?.map((item, id) => (
                  <div className="flex border w-full justify-between rounded-md bg-custom-lightGrayInputBg my-4 py-1 items-center px-2">
                    <li key={id} className="text-black font-bold">
                      {item?.name}
                    </li>
                    {/* <div className="flex text-2xl gap-2 pt-1">
                      <FiEdit
                        className="text-gray-500 mt-[0.5px]  cursor-pointer"
                        onClick={() => editAttribute(item.id)}
                      />
                      <IoCloseCircleOutline
                        className="text-custom-darkGray text-3xl cursor-pointer"
                        onClick={() => deleteAttribute(item.id)}
                      />
                    </div> */}
                  </div>
                ))}
              </ul>
            </div>
            {/* </div> */}
            {/* Add attribute code end */}

            {/* <div className="absolute top-[36px] md:right-[10px]  right-[10px]">
                <MdOutlineFileUpload
                  className="text-black h-8 w-8 cursor-pointer"
                  onClick={() => {
                    f.current.click();
                  }}
                />
                <input
                  type="file"
                  ref={f}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div> */}
            {/* </div> */}
          </div>

          <div className="flex justify-center items-center pt-5 pb-3">
            <button
              className="md:h-[40px] h-[40px] md:w-[274px] w-full bg-yellow-600 rounded-[10px] md:text-lg text-base text-white "
              type="submit"
            >
               {category?._id ? "Update" : "Add now"}
            </button>
          </div>
        </form>

        {/* Form code end here */}

        <div className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 ">
          <input
            className="bg-custom-lightGrayInputBg text-custom-black border border-custom-lightGrayColor outline-none h-[40px] md:w-[435px] w-full px-5 rounded-[10px] text-custom-darkBlack font-semibold	text-base"
            type="text"
            placeholder="Search Truck"
          />
        </div>

        {loadTypeData.map((item, i) => (
          <div
            key={i}
            className="bg-white border border-custom-lightsGrayColor rounded-[10px] p-5 mt-5"
          >
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-start items-center">
                 
                <p className={`text-base text-black font-semibold pl-5`}>
                  {item?.name}
                </p>
              </div>
              <div className="flex justify-center items-center">
                <FiEdit
                  className={`md:h-[30px] h-[20px] md:w-[30px] w-[20px] text-custom-darkGray mr-[20px] cursor-pointer`}
                  onClick={() => {
                    getCategoryById(item?._id)
                    // seteditid(item._id),  setCategory(item);
                    // setAddAttribute(item.attributes);
                  }}
                />
                <IoCloseCircleOutline
                  className={`md:h-[30px] h-[20px] md:w-[30px] w-[20px] text-custom-darkGray cursor-pointer`}
                  onClick={() => {
                    deleteCategory(item?._id);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    </section>
  );
}

export default isAuth(Categories);
