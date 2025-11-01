import React, { useMemo, useState, useEffect } from "react";
import Table, { indexID } from "@/components/table";
import { useRouter } from "next/router";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Navigation } from "swiper/modules";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import PaginationComponent from "@/components/PaginationComponen";
import { Eye } from "lucide-react";

function Driver(props) {
  const router = useRouter();
  const [driverData, setDriverData] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [AllImage, setAllImage] = useState({})

  useEffect(() => {
    getDriver();
  }, [currentPage]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      getDriver();
    }
  }, [searchTerm, filterDate, filterStatus]);


  const handleClose = () => setViewPopup(false);

  const getDriver = async () => {
    props.loader(true);
    const params = new URLSearchParams({
      page: currentPage || 1,
      limit: itemsPerPage || 10,
      search: searchTerm || "",
      date: filterDate || "",
      status: filterStatus || "",
    });
    await Api("get", `getAllDriver?${params.toString()}`, "", router).then(
      (res) => {
        props.loader(false);
        const Drivers = res?.data?.data || [];
        const total = res?.data?.totalItems;
        const page = res?.data?.currentPage;
        const pages = Math.ceil(total / itemsPerPage) || 0;

        setCurrentPage(page);
        setTotalPages(pages);
        setDriverData(Drivers);
        setTotalItems(total);
      },
      (error) => {
        props.loader(false);
        props.toaster({ type: "error", message: error.message });
      }
    );
  };

  const updateStatus = async (id, verified) => {
    props.loader(true);
    Api("post", `verifyuser/${id}`, { verified }, router).then(
      (res) => {
        props.loader(false);
        getDriver();
        props.toaster({
          type: "success",
          message:
            verified === "SUSPEND"
              ? "Driver suspended successfully"
              : "Driver verified successfully",
        });
        setViewPopup(false);
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
  // === Table Columns ===
  function name({ value }) {
    return (
      <div className="flex items-center justify-center">
        <HiOutlineUserCircle className="text-gray-500 mr-2" size={20} />
        <p className="text-gray-800 text-base font-medium">{value}</p>
      </div>
    );
  }

  function email({ value }) {
    return (
      <p className="text-gray-700 text-center text-base hover:text-yellow-600 transition-colors">
        {value}
      </p>
    );
  }

  function date({ value }) {
    return (
      <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 py-1">
        <FiCalendar className="text-gray-500 mr-2" size={16} />
        <p className="text-gray-700 text-sm font-medium">
          {moment(value).format("DD MMM YYYY")}
        </p>
      </div>
    );
  }

  function status({ value }) {
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium text-center ${value === "VERIFIED"
          ? "bg-green-100 text-green-700"
          : value === "SUSPEND"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
          }`}
      >
        {value}
      </span>
    );
  }

  const info = ({ row }) => (
    <div className="flex items-center justify-center">
      <button
        onClick={() => {
          setViewPopup(true);
          setPopupData(row.original);
          setAllImage([
            {
              label: "Driving License", img: row.original.driving_licence_img
              , number: row.original.driving_licence_no

            },
            {
              label: "Vehicle Document", img: row.original.vehicle_doc_img, number: row.original.vehicle_doc_no
            }
          ]);
        }}
        className="h-[38px] w-[100px] bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
      >
        Details
        <Eye size={16} />
      </button>
    </div>
  );

  const columns = useMemo(
    () => [
      { Header: "ID", Cell: indexID },
      { Header: "NAME", accessor: "username", Cell: name },
      { Header: "E-MAIL", accessor: "email", Cell: email },
      { Header: "DATE", accessor: "createdAt", Cell: date },
      { Header: "STATUS", accessor: "verified", Cell: status },
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
            Driver Management
          </h1>
          <div className="relative mt-3 md:mt-0">
            <input
              type="text"
              placeholder="Search driver..."
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
                    Date Range:
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
                  <select className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"

                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">All</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPEND">Suspended</option>
                  </select>
                </div>
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg ml-0 md:ml-4 transition-all duration-300"
                  onClick={clearFilters}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="px-4 mb-6">
            {driverData.length > 0 ? (
              <Table
                columns={columns}
                data={driverData}
                disablePagination={true}
                showPagination={false}
              />
            ) : (
              <div className="flex items-center justify-center min-h-[450px]">
                <div className="text-center py-10">
                  <HiOutlineUserCircle className="mx-auto h-16 w-16 text-gray-400" />
                  <h3 className="mt-4 text-xl font-medium text-gray-900">
                    No Drivers found
                  </h3>
                  <p className="mt-1 text-md text-gray-500">
                    {filterDate
                      ? "Try adjusting your filters"
                      : "No Drivers available"}
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

        {/* Popup */}
        {viewPopup && (
          <Dialog
            open={viewPopup}
            onClose={handleClose}
            maxWidth="md"
            PaperProps={{
              style: {
                borderRadius: "16px",
                overflow: "visible",
                backdropFilter: "blur(6px)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
              },
            }}
          >
            <div className="p-6 bg-white relative md:w-[500px] w-[95vw] rounded-2xl">
              <button
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
                onClick={handleClose}
              >
                <IoCloseCircleOutline className="h-8 w-8" />
              </button>

              {/* Header */}
              <div className="md:flex justify-between border-b border-gray-200 pb-5">
                <div className="flex flex-col md:flex-row items-start">
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                  <div className="flex flex-col justify-start md:pl-5 mt-3 md:mt-0">
                    <h3 className="text-xl font-bold text-gray-800">
                      {popupData?.username}
                    </h3>
                    <p className="text-base text-gray-600 mt-1">
                      {popupData?.email}
                    </p>
                  </div>
                </div>

                <div className="flex md:justify-center items-center md:border-l border-gray-200 mt-4 md:mt-0">
                  <div className="grid grid-cols-2 gap-5 md:pl-6">
                    <div className="bg-yellow-50 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Total Orders
                      </p>
                      <p className="text-xl font-bold text-yellow-600">0</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Total Earnings
                      </p>
                      <p className="text-xl font-bold text-green-600">0</p>
                    </div>
                  </div>
                </div>
              </div>


              <div className="my-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-3">Documents</h4>
                <div className="relative">
                  <Swiper
                    navigation={{
                      nextEl: '.swiper-button-next-custom',
                      prevEl: '.swiper-button-prev-custom',
                    }}
                    pagination={{
                      clickable: true,
                      dynamicBullets: true,
                    }}
                    modules={[Navigation]}
                    className="mySwiper rounded-lg overflow-hidden shadow-md"
                    // onRealIndexChange={(newindex) => setCurrentIndex(newindex.activeIndex)}
                    onSlideChange={() => console.log("slide change")}
                    onSwiper={(swiper) => console.log(swiper)}
                  >
                    {AllImage?.map((item, i) => (
                      <SwiperSlide key={i}>
                        <div className="w-full flex flex-col justify-center items-center bg-gray-100 pt-4">
                          <div className="relative rounded-lg overflow-hidden">
                            <img
                              src={item?.img}
                              alt={item?.label}
                              className="rounded-lg md:w-80 md:h-64 w-60 h-48 object-cover"
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-700">{item?.label}</p>
                          <p className="mt-2 text-sm text-gray-200 text-center py-2 rounded-md bg-black w-full">NO: {item?.number}</p>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {/* Custom navigation buttons */}
                  <div className="swiper-button-prev-custom absolute left-2 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                  <div className="swiper-button-next-custom absolute right-2 top-1/2 z-10 -translate-y-1/2 bg-white rounded-full p-2 shadow-md cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-center gap-4">
                {popupData?.verified !== "VERIFIED" && (
                  <button
                    className="flex items-center justify-center text-white font-medium px-6 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => updateStatus(popupData?._id, "VERIFIED")}
                  >
                    Verify
                  </button>
                )}
                {popupData?.verified !== "SUSPEND" && (
                  <button
                    className="flex items-center justify-center text-white font-medium px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    onClick={() => updateStatus(popupData?._id, "SUSPEND")}
                  >
                    Suspend
                  </button>
                )}
              </div>
            </div>
          </Dialog>
        )}
      </div>
    </section>
  );
}

export default isAuth(Driver);
