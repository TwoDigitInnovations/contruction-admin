import React, { useContext, useRef, useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { IoAddSharp, IoCloseCircleOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import { userContext } from "./_app";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { Api, ApiFormData } from "@/services/service";
import { useRouter } from "next/router";
import { produce } from "immer";
import isAuth from "@/components/isAuth";

const size = [
  {
    label: "XXS",
    value: "XXS",
    total: 0,
    sell: 0,
  },
  {
    label: "XS",
    value: "XS",
    total: 0,
    sell: 0,
  },
  {
    label: "S",
    value: "S",
    total: 0,
    sell: 0,
  },
  {
    label: "M",
    value: "M",
    total: 0,
    sell: 0,
  },
  {
    label: "L",
    value: "L",
    total: 0,
    sell: 0,
  },
  {
    label: "XL",
    value: "XL",
    total: 0,
    sell: 0,
  },
  {
    label: "XXL",
    value: "XXL",
    total: 0,
    sell: 0,
  },
  {
    label: "3xl",
    value: "3xl",
    total: 0,
    sell: 0,
  },
  {
    label: "4xl",
    value: "4xl",
    total: 0,
    sell: 0,
  },
  {
    label: "5xl",
    value: "5xl",
    total: 0,
    sell: 0,
  },
  {
    label: "For adult",
    value: "For adult",
    total: 0,
    sell: 0,
  },
];

function AddProduct(props) {
  const router = useRouter();
  console.log(router);
  console.log(router?.query?.id);

  const f = useRef(null);
  const [addProductsData, setAddProductsData] = useState({
    name: "",
    categoryname: "",
    price: "",
    weightVarints: "",
    piece:""
  });


  const [categoryData, setCategoryData] = useState([]);
  const [user, setUser] = useContext(userContext);

  const [varients, setvarients] = useState([
    {
      color: "",
      image: [],
      selected: [],
    },
  ]);
  const [openPopup, setOpenPopup] = useState(false);
  const [color, setColor] = useColor("#000000");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleImg, setSingleImg] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleClose = () => {
    setOpenPopup(false);
  };

  // useEffect(() => {
     
  // }, []);

  useEffect(() => {
    if (router?.query?.id) {
      getProductById();
    }
    getCategory();
  }, [router?.query?.id]);


  const getProductById = async () => {
    props.loader(true);
    await Api("get", `getProductById/${router?.query?.id}`, "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res?.status) {
          setAddProductsData({
            name: res?.data?.name,
            category: res?.data?.category._id,
            categoryname: res?.data?.category,
            price: res?.data?.price,
            piece: res?.data?.piece,
            weightVarints:res?.data?.weightVarints
          });
          // setvarients(res?.data?.varients);
        }
        console.log(res?.data?.category?.name);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  
  console.log("Add Products Data ::", addProductsData);

  const getCategory = async () => {
    props.loader(true);
    Api("get", "getCategory", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        res.data.forEach((element, i) => {
          element.value = element._id;
          element.label = element.name;

          if (res.data.length === i + 1) {
            setCategoryData(res?.data);
          }
        });
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const data = {
      ...addProductsData,
      posted_by: user?._id,
      //  category: addProductsData.category._id,
       categoryName: categoryData.find((f) => f._id === addProductsData.categoryname)
        ,
      // varients,
    };
    console.log(data);
    console.log(addProductsData);

    props.loader(true);
    Api("post", "createProduct", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================> category ", res);
        if (res.status) {
          setAddProductsData({
            name: "",
            categoryname:"",
            price: "",
            weightVarints: "",
            piece:""
          });
          // setvarients([
          //   {
          //     color: "",
          //     image: [],
          //     selected: [],
          //   },
          // ]);
          router.push("/products");
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

   
  // console.log("add product data ::", addProductsData);
  

  const updateProduct = async (e) => {
    e.preventDefault();

    const data = {
      ...addProductsData,
      posted_by: user?._id,
      // categoryName: categoryData.find((f) => f._id === addProductsData.categoryname),
      // varients,
      id: router?.query?.id,
    };

    console.log(data);
    console.log(addProductsData);

    props.loader(true);
    Api("post", "updateProduct", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          setAddProductsData({
            name: "",
            price: "",
            piece: "",
            weightVarints: "",
            categoryname:""
             
          });
          // setvarients([
          //   {
          //     color: "",
          //     image: [],
          //     selected: [],
          //   },
          // ]);
          router.push("/products");
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

  const handleImageChange = (event, i) => {
    const file = event.target.files[0];
    const data = new FormData();
    data.append("file", file);
    props.loader(true);
    ApiFormData("post", "user/fileupload", data, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        if (res.status) {
          setvarients(
            produce((draft) => {
              draft[i].image.push(res.data.file);
            })
          );
          // setvarients(res.data.file)
          props.toaster({ type: "success", message: res.data.message });
        }
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
    const reader = new FileReader();
  };

  const closeIcon = (item, i) => {
    const d = varients[i].image.filter((f) => f !== item);
    setvarients(
      produce((draft) => {
        draft[i].image = d;
      })
    );
  };

  const colorCloseIcon = (item, i) => {
    console.log(item, i);
    let data = varients;
    if (i > -1) {
      data.splice(i, 1);
    }
    console.log(data);
    setvarients([...varients]);
  };

  const priceSlotsCloseIcon = (item, i) => {
    console.log(item, i);
    let data = addProductsData.price_slot;
    if (i > -1) {
      data.splice(i, 1);
    }
    console.log(data);
    setAddProductsData({ ...addProductsData, price_slot: data });
  };


  return (
    <section className="w-full h-full  bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <div className="md:pt-[0px] pt-[0px] h-full overflow-scroll no-scrollbar">
        <p className="text-custom-black mt-3 font-bold md:text-[32px] text-2xl md:pb-0 pb-3">
          Add Product
        </p>

        <form
          className="pb-14"
          onSubmit={router?.query?.id ? updateProduct : createProduct}
        >
          <div className="pt-5 md:pb-10 bg-transparent h-full w-full md:mt-9">
            <div className="md:px-10 px-5 pb-5 bg-white h-full w-full boxShadow">
              <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Product Name
                </p>
                <div className="relative">
                  <input
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-12 pr-5 border border-custom-lightRedColor rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    type="text"
                    placeholder="2"
                    value={addProductsData.name}
                    onChange={(e) => {
                      setAddProductsData({
                        ...addProductsData,
                        name: e.target.value,
                      });
                    }}
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div>

              <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Category
                </p>

                {/* <MultiSelect className='w-full'
                                    hasSelectAll={false}
                                    options={categoryData}
                                    value={addProductsData?.category}
                                    onChange={((e) => {
                                        console.log('category=================>', e)
                                        setAddProductsData({ ...addProductsData, category: e })
                                    })}
                                    // required
                                    labelledBy="Select Staff"
                                    ClearSelectedIcon
                                /> */}

                <div className="relative px-3 w-full bg-transparent border border-custom-newGray rounded-[10px]">
                  <select
                    value={addProductsData.categoryname._id}
                    onChange={(newValue) => {
                      console.log(newValue);

                      const cat = categoryData.find(
                        (f) => f._id === newValue.target.value
                      );
                      console.log(cat);
                      
                      setAddProductsData({
                        ...addProductsData,
                        category: newValue.target.value,
                        categoryname: cat.name,
                        // attributes: cat.attributes,
                      });
                    }}
                    required
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-8 pr-5  outline-none text-custom-darkGrayColor text-base font-light"
                    placeholder="Category"
                  >
                    <option value={''} className="p-5">
                      Category
                    </option>
                    {categoryData?.map((item, i) => (
                      <option key={i} value={item._id} className="p-5">
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div>

              <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Price Per unit
                </p>
                <div className="relative">
                  <input
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-12 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    type="text"
                    placeholder="Price per unit"
                    value={addProductsData.price}
                    onChange={(e) => {
                      setAddProductsData({
                        ...addProductsData,
                        price: e.target.value,
                      });
                    }}
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div>

              <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Piece
                </p>
                <div className="relative">
                  <input
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-12 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    type="text"
                    placeholder="Price per unit"
                    value={addProductsData.piece}
                    onChange={(e) => {
                      setAddProductsData({
                        ...addProductsData,
                        piece: e.target.value,
                      });
                    }}
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div>

              <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Weight Varient
                </p>
                <div className="relative">
                  <input
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-12 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    type="text"
                    placeholder="weight varient"
                    value={addProductsData.weightVarints}
                    onChange={(e) => {
                      setAddProductsData({
                        ...addProductsData,
                         weightVarints: e.target.value,
                      });
                    }}
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div>

              {/* <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Short Description
                </p>
                <div className="relative">
                  <input
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-12 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    type="text"
                    placeholder="Short Description"
                    value={addProductsData.short_description}
                    onChange={(e) => {
                      setAddProductsData({
                        ...addProductsData,
                        short_description: e.target.value,
                      });
                    }}
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div> */}

              {/* <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Gender
                </p>
                <div className="relative px-3 w-full bg-transparent border border-custom-newGray rounded-[10px]">
                  <select
                    value={addProductsData.gender}
                    onChange={(newValue) => {
                      setAddProductsData({
                        ...addProductsData,
                        gender: newValue.target.value,
                      });
                    }}
                    required
                    className="bg-transparent w-full md:h-[46px] h-[40px] pl-8 pr-5  outline-none text-custom-darkGrayColor text-base font-light"
                    placeholder="Select Gender"
                  >
                    <option value="" className="p-5">
                      Select Gender
                    </option>
                    <option value="Male" className="p-5">
                      Male
                    </option>
                    <option value="Female" className="p-5">
                      Female
                    </option>
                    <option value="Unisex" className="p-5">
                      Unisex
                    </option>
                  </select>
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div> */}

              {/* <div className="pt-5">
                <p className="text-custom-darkGray text-base font-normal pb-1">
                  Long Description
                </p>
                <div className="relative">
                  <textarea
                    className="bg-transparent w-full pl-12 pr-5 py-2 border border-custom-newGrayColor rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                    rows={4}
                    placeholder="Long Description"
                    value={addProductsData.long_description}
                    onChange={(e) =>
                      setAddProductsData({
                        ...addProductsData,
                        long_description: e.target.value,
                      })
                    }
                    required
                  />
                  <img
                    className="w-[18px] h-[18px] absolute md:top-[13px] top-[10px] left-5"
                    src="/box-add.png"
                  />
                </div>
              </div> */}

              {/* **************************** Attribute code start */}
              {/* <div className="w-full">
                <p className="text-2xl font-medium text-custom-gray pt-5 pb-4">
                  Attributes
                </p>
                <div className="border-custom-newGrayColor border px-4 py-5 rounded-md ">
                  {addProductsData?.attributes?.map((attr, inx) => (
                    <div className="w-full" key={inx}>
                      <p className="text-custom-darkGray text-base font-normal pb-1">
                        {attr?.name}
                      </p>
                      <input
                        className="bg-transparent mb-5 w-full md:h-[46px] h-[40px] pl-6 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                        type="text"
                        placeholder="Value"
                        value={attr?.value}
                        onChange={(e) => {
                          attr.value = e.target.value;
                          setAddProductsData({ ...addProductsData });
                        }}

                      />
                    </div>
                  ))}
                </div>
              </div> */}
              {/* ************************* attribute code end */}

              {/* Varient color input code start */}
              <div className="w-full">
                {/* <p className="text-2xl font-medium text-custom-gray pt-5">
                  Varients
                </p> */}
                {varients.map((item, i) => (
                  <div
                    key={i}
                    className="w-full bg-transparent border border-custom-newGrayColor mt-5 p-5 rounded-[10px] relative"
                  >
                    <IoCloseCircleOutline
                      className="text-red-700 cursor-pointer h-5 w-5 absolute top-[20px] right-[20px]"
                      onClick={() => {
                        colorCloseIcon(item, i);
                      }}
                    />

                    {Array.isArray(addProductsData?.attributes) &&
                      addProductsData.attributes.some(
                        (attribute) => attribute.name === "color"
                      ) && (
                        <div className="flex md:flex-row flex-col justify-between items-center">
                          <div className="md:w-[85%] w-full">
                            <p className="text-custom-darkGray text-base font-normal pb-1">
                              Color
                            </p>
                            <div className="relative">
                              <input
                                type="text"
                                className="bg-transparent w-full md:h-[46px] h-[40px] pl-5 pr-5 border border-custom-newGray rounded-[10px] outline-none text-custom-darkGrayColor text-base font-light"
                                value={item.color}
                                onChange={(e) => {
                                  setvarients(
                                    produce((draft) => {
                                      draft[i].color = e.target.value;
                                    })
                                  );
                                }}
                                required
                              />
                              <p
                                className="md:w-5 w-3 md:h-5 h-3 rounded-full absolute top-[13px] right-[10px] cursor-pointer border border-black"
                                style={{ backgroundColor: item.color }}
                                onClick={() => {
                                  setOpenPopup(true);
                                  setCurrentIndex(i);
                                }}
                              ></p>

                              <Dialog
                                open={openPopup}
                                onClose={handleClose}
                                aria-labelledby="draggable-dialog-title"
                              >
                                <div className="md:w-[400px] w-[330px]">
                                  <DialogTitle
                                    style={{ cursor: "move" }}
                                    id="draggable-dialog-title"
                                  >
                                    <p className="text-black font-bold text-xl text-center">
                                      Color Picker
                                    </p>
                                  </DialogTitle>
                                  <DialogContent>
                                    <ColorPicker
                                      color={color}
                                      onChange={setColor}
                                    />
                                  </DialogContent>
                                  <DialogActions className="!p-0 !flex !justify-center !items-center">
                                    <div className="!flex !justify-center !items-center px-[24px] pb-[24px] w-full gap-3">
                                      <button
                                        className="bg-custom-gray h-[45px] w-full rounded-[12px] NunitoSans text-white font-normal text-base"
                                        onClick={() => {
                                          setvarients(
                                            produce((draft) => {
                                              draft[i].color = color.hex;
                                            })
                                          );
                                          setOpenPopup(false);
                                        }}
                                      >
                                        Ok
                                      </button>
                                      <button
                                        className="bg-custom-gray h-[45px] w-full rounded-[12px] NunitoSans text-white font-normal text-base"
                                        onClick={handleClose}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </DialogActions>
                                </div>
                              </Dialog>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Upload image code start  */}
                    <div className="flex md:justify-start justify-start items-start md:items-center md:w-auto w-full pt-[25px]">
                      <div className="relative">
                        <div className="border-2 border-dashed border-custom-newGray md:h-[38px] w-[38px] rounded-[5px] flex flex-col justify-center items-center bg-white">
                          <input
                            className="outline-none bg-custom-light md:w-[90%] w-[85%]"
                            type="text"
                            value={singleImg}
                            onChange={(text) => {
                              setSingleImg(text.target.value);
                            }}
                          />
                        </div>

                        <div className="absolute top-[10px] md:left-[9px] cursor-pointer ">
                          <IoAddSharp
                            className="text-black w-[20px] h-[20px]"
                            onClick={() => {
                              f.current.click();
                            }}
                          />
                          <input
                            type="file"
                            ref={f}
                            className="hidden"
                            onChange={(event) => {
                              handleImageChange(event, i);
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-custom-darkGrayColor text-base font-normal ml-5">
                        Upload Photo
                      </p>
                    </div>

                    <div className="flex md:flex-row flex-wrap md:gap-5 gap-4 mt-5">
                      {item?.image?.map((ig, i) => (
                        <div className="relative" key={i}>
                          <img
                            className="md:w-20 w-[85px] h-20 object-contain"
                            src={ig}
                          />
                          <IoCloseCircleOutline
                            className="text-red-700 cursor-pointer h-5 w-5 absolute left-[5px] top-[10px]"
                            onClick={() => {
                              closeIcon(ig, i);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Size input code start******** */}
                    {Array.isArray(addProductsData?.attributes) &&
                      addProductsData.attributes.map((attribute, id) => (
                        <div key={id}>
                          {attribute.name === "size" && (
                            <div className="pt-2">
                              <p className="text-custom-darkGray  text-base font-normal pb-1">
                                Size
                              </p>
                              <MultiSelect
                                className="w-[85%] "
                                options={size}
                                value={item.selected}
                                onChange={(selected) => {
                                  setvarients(
                                    produce((draft) => {
                                      draft[i].selected = selected;
                                    })
                                  );
                                }}
                                required
                                labelledBy="Select Sizes"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ))}

                {/* Size input code********** end here */}

                {/* Add more Button code start */}
                <div className="flex md:flex-row flex-col justify-start items-center w-full pt-5 md:gap-0 gap-5">
                  <div
                    className="relative flex justify-center items-center md:w-auto w-full"
                    onClick={() => {
                      setvarients([
                        ...varients,
                        {
                          color: "",
                          image: [],
                          selected: [],
                        },
                      ]);
                    }}
                  >
                    <p className="bg-custom-gray cursor-pointer md:pr-8 md:h-[50px] h-[40px] md:w-[188px] w-full flex justify-center items-center rounded-[5px] md:text-xl text-base text-white font-normal">
                      Add more
                    </p>
                    <img
                      className="md:w-[8px] w-[7px] md:h-[17px] h-[15px] absolute md:top-[18px] top-[13px] md:right-8 right-4 object-contain"
                      src="/nextImg.png"
                    />
                  </div>
                </div>
              </div>

              {/* <div className="pt-5">
                <p className="text-2xl font-medium text-custom-gray">Pricing</p>
                <div className="w-full bg-transparent border border-custom-newGrayColor mt-5 p-5 rounded-[10px]">
                  <div className="grid md:grid-cols-5 grid-cols-1 w-full gap-5">
                    {addProductsData?.price_slot?.map((slot, d) => (
                      <div
                        key={d}
                        className="border border-custom-newGrayColors rounded p-5 w-full"
                      >
                        <div className="flex justify-between items-center w-full">
                          <p className="text-xl font-medium text-custom-gray">
                            Slot {d + 1}
                          </p>
                          <IoIosClose
                            className="w-[30px] h-[30px] text-custom-darkGrayColors"
                            onClick={() => {
                              priceSlotsCloseIcon(slot, d);
                            }}
                          />
                        </div>

                        <div className="pt-5">
                          <p className="text-custom-gray text-base font-normal pb-1">
                            Qty
                          </p>
                          <input
                            className="bg-custom-offWhiteColors w-full h-[33px] px-2 outline-none text-custom-darkGrayColor text-base font-light"
                            type="number"
                            value={slot.value}
                            onChange={(e) => {
                              slot.value = e.target.value;
                              setAddProductsData({ ...addProductsData });
                            }}
                            required
                          />
                        </div>

                        <div className="pt-5">
                          <p className="text-custom-gray text-base font-normal pb-1">
                            Price
                          </p>
                          <input
                            className="bg-custom-offWhiteColors w-full h-[33px] px-2 outline-none text-custom-darkGrayColor text-base font-light"
                            type="number"
                            value={slot.price}
                            onChange={(e) => {
                              slot.price = e.target.value;
                              setAddProductsData({ ...addProductsData });
                            }}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex md:flex-row flex-col justify-end items-end w-full pt-5 md:gap-0 gap-5">
                    <div
                      className="relative flex justify-center items-center md:w-auto w-full"
                      onClick={() => {
                        setAddProductsData({
                          ...addProductsData,
                          price_slot: [
                            ...addProductsData.price_slot,
                            {
                              value: 0,
                              price: 0,
                            },
                          ],
                        });
                      }}
                    >
                      <button
                        type="button"
                        className="bg-custom-gray md:pr-8 md:h-[50px] h-[40px] md:w-[188px] w-full rounded-[5px] md:text-xl text-base text-white font-normal"
                      >
                        Add more
                      </button>
                      <img
                        className="md:w-[8px] w-[7px] md:h-[17px] h-[15px] absolute md:top-[18px] top-[13px] md:right-8 right-4 object-contain"
                        src="/nextImg.png"
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="flex md:flex-row flex-col justify-between items-center w-full pt-20 md:gap-0 gap-5">
                <div className="relative flex justify-center items-center md:w-auto w-full">
                  {/* <button className='bg-transparent md:pl-8 md:h-[50px] h-[40px] md:w-[168px] w-full rounded-[5px] border border-custom-gray md:text-xl text-base text-custom-gray font-normal'>Cancel</button>
                                    <img className='md:w-[24px] w-[20px] md:h-[24px] h-[20px] absolute md:top-[12px] top-[9px] md:left-7 left-5' src='/deleteImg.png' /> */}
                </div>
                <div className="relative flex justify-center items-center md:w-auto w-full">
                  <button
                    className="bg-yellow-600 md:pr-8 md:h-[50px] h-[40px] md:w-[188px] w-full rounded-[5px] md:text-xl text-base text-white font-normal"
                    type="submit"
                  >
                    {router?.query?.id ? "Update" : "Submit"}
                  </button>
                  <img
                    className="md:w-[8px] w-[7px] md:h-[17px] h-[15px] absolute md:top-[18px] top-[13px] md:right-8 right-4 object-contain"
                    src="/nextImg.png"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

export default isAuth(AddProduct);
