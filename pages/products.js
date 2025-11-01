import React, { useMemo, useState, useEffect, useContext } from "react";
import Table from "@/components/table";
import { FiEdit, FiPackage } from "react-icons/fi";
import { RiDeleteBinLine } from "react-icons/ri";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { userContext } from "./_app";
import isAuth from "@/components/isAuth";
import { MdInventory2 } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { Avatar, Dialog } from "@mui/material";
import { IoCloseCircleOutline } from "react-icons/io5";
import moment from "moment";
import PaginationComponent from "@/components/PaginationComponen";
import { Eye, EyeClosedIcon } from "lucide-react";

function products(props) {
  const router = useRouter();
  //   const [productsList, setProductsList] = useState([]);
  const [productData, setProductData] = useState([]);
  const [user, setUser] = useContext(userContext);
  const [selectedNewSeller, setSelectedNewSeller] = useState([]);
  const [popupData, setPopupData] = useState({});
  const [viewPopup, setviewPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);


  useEffect(() => {
    getProductData();
  }, [currentPage]);

  // useEffect(() => {
  //   if (currentPage !== 1) {
  //     setCurrentPage(1);
  //   } else {
  //     getProductData();
  //   }
  // }, []);



  const getProductData = () => {
    props.loader(true)
    const params = new URLSearchParams({
      page: currentPage || 1,
      limit: itemsPerPage || 10,
    });
    Api("get", `getProductByVendor?${params.toString()}`, "", router).then(
      (res) => {
        props.loader(false)
        const data = res?.data
        if (data) {
          const AllProducts = data?.product || [];
          const total = data?.total;
          const page = data?.page;
          const pages = data?.totalPages

          setCurrentPage(page);
          setTotalPages(pages);
          setTotalItems(total);
          setProductData(AllProducts)

        }
      },
      (err) => {
        props.loader(false)
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    )
  }

  const deleteProduct = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to proceed with the deletion?",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-2xl p-6 w-[430px]",
        title: "text-lg font-semibold text-gray-800",
        confirmButton:
          "bg-yellow-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-yellow-700 transition",
        cancelButton:
          "bg-gray-300 text-gray-800 font-medium py-2.5 px-6 rounded-lg hover:bg-gray-400 transition",
        actions: "flex justify-center gap-4 mt-4",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        props.loader(true);
        Api("delete", `deleteProduct/${_id}`, router).then(
          (res) => {
            props.loader(false);
            getProductData();
            props.toaster({ type: "success", message: res?.data?.message });
          },
          (error) => {
            props.loader(false);
            props.toaster({ type: "error", message: error?.data?.message });
          }
        );
      }
    });
  };


  const image = ({ row }) => {
    console.log(row.original);
    return (
      <div className="p-4 flex items-center justify-center">
        {row.original &&
          row.original.varients &&
          row.original.varients.length > 0 && (
            <img
              className="h-[76px] w-[76px] rounded-[10px]"
              src={row.original.varients[0].image[0]}
            />
          )}
      </div>
    );
  };

  const name = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const categoryname = ({ row, value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };

  const price = ({ value }) => {
    return (
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="text-black text-base font-normal">{value}</p>
      </div>
    );
  };


  const Attribute = ({ row }) => {
    const value = row.original.attributes?.length || 0;

    return (
      <div className="p-4 flex flex-col items-center justify-center">
        {value > 0 ? (
          <p className="text-custom-black text-sm font-normal">
            {value} {value === 1 ? "Attribute" : "Attributes"}
          </p>
        ) : (
          <p className="text-gray-500 text-sm font-normal">No Attributes</p>
        )}
      </div>
    );
  };


  const actionHandler = ({ value, row }) => {
    return (
      <div className="bg-custom-offWhiteColor flex items-center  justify-evenly  border border-custom-offWhite rounded-[10px] md:mr-[10px] ">
        <div
          className="py-[10px] w-[50%] items-center flex justify-center cursor-pointer md:px-0 px-3"
          onClick={() => {
            router.push(`add-product?id=${row.original._id}`);
          }}
        >
          <FiEdit className="text-[22px]" />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center md:px-0 px-3">
          <RiDeleteBinLine
            className="text-[red] text-[24px] cursor-pointer"
            onClick={() => deleteProduct(row.original._id)}
          />
        </div>
        <div className="py-[10px] border-l-[1px] border-custom-offWhite w-[50%] items-center flex justify-center md:px-0 px-3">
          <Eye
            className="text-[black] text-[24px] cursor-pointer"
            onClick={() => {
              setviewPopup(true);
              setPopupData(row.original)
            }
            }
          />
        </div>
      </div>
    );
  };



  const columns = useMemo(
    () => [
      // {
      //   Header: "Image",
      //   accessor: "username",
      //   Cell: image,
      // },
      {
        Header: "Product Name",
        accessor: "name",
        Cell: name,
      },
      {
        Header: "Category",
        accessor: "categoryname",
        Cell: categoryname,
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: price,
      },
      {
        Header: "Attributes",
        Cell: Attribute,
      },

      {
        Header: "ACTION",
        Cell: actionHandler,
      },
    ],
    [selectedNewSeller]
  );

  return (
    <div className=" w-full h-full bg-transparent md:pt-8 pt-5 pb-5 md:px-6 px-2">
      <div className="overflow-y-scroll h-screen scrollbar-hide pb-36">


        <div className="flex justify-between items-center mb-2">
          <div>
            <h1 className="text-gray-800 font-bold text-3xl flex items-center gap-2">
              <FiPackage className="text-yellow-600" /> All Products
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage your listed products here
            </p>
          </div>

          <button
            onClick={() => router.push("/add-product")}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition"
          >
            + Add Product
          </button>
        </div>

        <div className="">
          {productData.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[500px]  text-gray-500">
              <MdInventory2 className="text-6xl mb-4 opacity-70" />
              <p className="text-lg font-medium">No products found</p>
              <button
                onClick={() => router.push("/add-product")}
                className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg transition"
              >
                Add Your First Product
              </button>
            </div>
          ) : (
            <Table
              columns={columns}
              data={productData}
              disablePagination={true}
              showPagination={false}
            />
          ) 
          
          }


          <div className="mt-4 mb-4">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>


        {viewPopup && (
          <Dialog
            open={viewPopup}
            onClose={() => setviewPopup(false)}
            maxWidth="xl"
            PaperProps={{
              style: {
                borderRadius: 14,
                overflow: "visible",
                backdropFilter: "blur(6px)",
                boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
              },
            }}
          >
            <div className="p-8 bg-white relative md:w-[60vw] w-[95vw] rounded-2xl">
              {/* Close Button */}
              <button
                onClick={() => setviewPopup(false)}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <IoCloseCircleOutline className="h-7 w-7" />
              </button>

              {/* Product Header Section */}
              <div className="md:flex justify-between items-start gap-6 border-b border-gray-100 pb-5">
                <div className="flex items-start gap-6">

                  <div className="flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-800">{popupData?.name || "Unnamed Product"}</h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {popupData?._id}</p>
                    {popupData?.price && (
                      <p className="text-lg font-semibold text-yellow-700 mt-2">
                        Price: {popupData?.price || "0.00"}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Category: {popupData?.categoryname || "N/A"}</p>
                  </div>
                </div>

                {/* Status Tags */}
                <div className="flex flex-col items-end gap-3 mt-3 md:mt-0">
                  <span
                    className={`px-4 py-1 rounded-full text-sm font-medium inline-block
              ${popupData?.status === "ACTIVE" ? "bg-green-100 text-green-700" : ""}
              ${popupData?.status === "INACTIVE" ? "bg-red-100 text-red-700" : ""}
              ${popupData?.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
            `}
                  >
                    {popupData?.status || "PENDING"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                {popupData?.attributes?.length > 0 ? (
                  popupData.attributes.map((attribute, i) => (
                    <div
                      key={i}
                      className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex flex-col sm:flex-row items-center gap-4"
                    >
                      {/* Image */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {attribute.image ? (
                          <img
                            src={attribute.image}
                            alt={attribute.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="text-gray-400 text-sm">No Image</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
                        <h4 className="text-gray-800 font-semibold text-base capitalize">
                          {attribute.name || "Unnamed Attribute"}
                        </h4>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-600">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-md">
                            {attribute.unit || "N/A"}
                          </span>
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md">
                            Value: {attribute.value || "-"}
                          </span>
                          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-md">
                            Price: {attribute.price || 0}
                          </span>
                          {attribute.quantity && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md">
                              Qty: {attribute.quantity}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center col-span-full py-6">
                    No attributes available.
                  </p>
                )}
              </div>


              {/* Additional Info */}
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Created At:</span>
                  <span className="text-gray-800 text-sm">
                    {moment(popupData?.createdAt).format("MMMM DD, YYYY")}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                  <span className="text-gray-500 text-sm">Updated At:</span>
                  <span className="text-gray-800 text-sm">
                    {moment(popupData?.updatedAt).format("MMMM DD, YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </Dialog>
        )}

      </div>
    </div >
  );
}

export default isAuth(products);
