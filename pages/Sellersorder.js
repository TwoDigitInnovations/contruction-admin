import React, { useMemo, useState, useEffect } from "react";
import Table, { indexID } from "@/components/table";
import { useRouter } from "next/router";
import moment from "moment";
import { IoCloseCircleOutline } from "react-icons/io5";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { Eye } from "lucide-react";
import { Drawer } from "@mui/material";
import PaginationComponent from "@/components/PaginationComponen";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";

function Sellerorder(props) {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [popupData, setPopupData] = useState({});
  const [viewPopup, setViewPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    getOrders();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
    else getOrders();
  }, [searchTerm, filterDate, filterStatus]);

  const getOrders = async () => {
    props.loader(true);
    const params = new URLSearchParams({
      page: currentPage || 1,
      limit: itemsPerPage || 10,
      search: searchTerm || "",
      date: filterDate || "",
      status: filterStatus || "",
    });

    await Api("get", `getAllOrders?${params.toString()}`, "", router).then(
      (res) => {
        props.loader(false);
        const list = res?.data?.data || [];
        const total = res?.data?.totalItems;
        const page = res?.data?.currentPage;
        const pages = Math.ceil(total / itemsPerPage) || 0;
        setOrders(list);
        setTotalItems(total);
        setTotalPages(pages);
        setCurrentPage(page);
      },
      (err) => {
        props.loader(false);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterStatus("");
    setCurrentPage(1);
  };

  const handleClose = () => setViewPopup(false);

  // === Table Columns ===
  const seller = ({ value }) => (
    <div className="flex items-center justify-center">
      <HiOutlineUserCircle className="text-gray-500 mr-2" size={20} />
      <p className="text-gray-800 text-base font-medium">{value}</p>
    </div>
  );

  const orderid = ({ value }) => (
    <p className="text-gray-700 text-center font-medium">{value}</p>
  );

  const user = ({ value }) => (
    <p className="text-gray-700 text-center font-medium">{value}</p>
  );

  const price = ({ value }) => (
    <p className="text-gray-800 text-center font-semibold">₹{value}</p>
  );

  const date = ({ value }) => (
    <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 py-1">
      <FiCalendar className="text-gray-500 mr-2" size={16} />
      <p className="text-gray-700 text-sm font-medium">
        {moment(value).format("DD MMM YYYY")}
      </p>
    </div>
  );

  const status = ({ value }) => (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium text-center ${
        value === "DELIVERED"
          ? "bg-green-100 text-green-700"
          : value === "CANCELLED"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {value}
    </span>
  );

  const info = ({ row }) => (
    <div className="flex items-center justify-center">
      <button
        onClick={() => {
          setPopupData(row.original);
          setViewPopup(true);
        }}
        className="h-[38px] w-[100px] bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 text-sm font-medium rounded-lg border border-yellow-300 hover:shadow-md transition-all flex items-center justify-center gap-2"
      >
        Details
        <Eye size={16} />
      </button>
    </div>
  );

  const columns = useMemo(
    () => [
      { Header: "ID", Cell: indexID },
      { Header: "SELLER", accessor: "sellerName", Cell: seller },
      { Header: "ORDER ID", accessor: "orderId", Cell: orderid },
      { Header: "USER", accessor: "userName", Cell: user },
      { Header: "PRICE", accessor: "totalPrice", Cell: price },
      { Header: "STATUS", accessor: "status", Cell: status },
      { Header: "DATE", accessor: "createdAt", Cell: date },
      { Header: "ACTIONS", Cell: info },
    ],
    []
  );

  return (
    <section className="w-full h-full bg-gray-50 md:pt-5 pt-2 pb-5 md:px-5 px-2">
      <div className="overflow-y-scroll h-screen scrollbar-hide pb-28">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <h1 className="text-gray-800 font-bold md:text-3xl text-2xl">
            Seller Order Management
          </h1>
          <div className="relative mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Search order..."
              className="pl-10 pr-4 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {/* Filter Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:mt-6 mt-4">
          <div className="bg-gradient-to-r from-yellow-50 to-white border-b border-gray-200 p-4">
            <div className="md:flex justify-between items-center">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <FiFilter className="text-yellow-600" size={20} />
                </div>
                <h2 className="ml-3 text-gray-800 font-semibold">
                  Filter Options
                </h2>
              </div>
              <div className="md:ml-8 mt-4 md:mt-0 flex items-center flex-wrap gap-3">
                <div className="flex items-center">
                  <label className="text-gray-700 font-medium mr-3">
                    Date:
                  </label>
                  <input
                    className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center ml-0 md:ml-4">
                  <label className="text-gray-700 font-medium mr-3">
                    Status:
                  </label>
                  <select
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg ml-0 md:ml-4 transition-all duration-300"
                  onClick={clearFilters}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-4 mb-6">
            {orders.length > 0 ? (
              <Table
                columns={columns}
                data={orders}
                disablePagination={true}
                showPagination={false}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[450px]">
                <div className="text-center py-10">
                  <HiOutlineUserCircle className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    No Orders found
                  </h3>
                  <p className="mt-1 text-md text-gray-500">
                    {filterDate
                      ? "Try adjusting your filters"
                      : "No orders available"}
                  </p>
                </div>
              </div>
            )}

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
        </section>

        {/* Drawer - Order Details */}
        {viewPopup && (
          <Drawer
            open={viewPopup}
            onClose={handleClose}
            anchor={"right"}
            PaperProps={{
              style: {
                borderRadius: "16px 0 0 16px",
                width: "450px",
                maxWidth: "90vw",
                boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
              },
            }}
          >
            <div className="p-6 bg-white relative">
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
                onClick={handleClose}
              >
                <IoCloseCircleOutline className="h-8 w-8" />
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Order Details
              </h2>

              <div className="space-y-4">
                <p className="text-gray-700">
                  <span className="font-semibold">Order ID:</span>{" "}
                  {popupData?.orderId}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Seller:</span>{" "}
                  {popupData?.sellerName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">User:</span>{" "}
                  {popupData?.userName}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Total Price:</span> ₹
                  {popupData?.totalPrice}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      popupData?.status === "DELIVERED"
                        ? "bg-green-100 text-green-700"
                        : popupData?.status === "CANCELLED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {popupData?.status}
                  </span>
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Date:</span>{" "}
                  {moment(popupData?.createdAt).format("DD MMM YYYY")}
                </p>
              </div>

              <div className="mt-6 border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Ordered Items
                </h3>
                {popupData?.items?.length > 0 ? (
                  popupData.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between py-2 border-b border-gray-100"
                    >
                      <p className="text-gray-700">
                        {item.productName} × {item.quantity}
                      </p>
                      <p className="text-gray-800 font-medium">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">
                    No items found for this order.
                  </p>
                )}
              </div>
            </div>
          </Drawer>
        )}
      </div>
    </section>
  );
}

export default isAuth(Sellerorder);
