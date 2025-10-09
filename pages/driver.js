







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
// Import additional icons for enhanced UI
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";

function driver(props) {
  const router = useRouter();
  const [driverData, setDriverData] = useState([]);
  const [viewPopup, setviewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    getDriver();
  }, []);

  const handleClose = () => {
    setviewPopup(false);
  };

  const getDriver = async () => {
    props.loader(true);
    await Api("get", "getAllDriver", "", router).then(
      (res) => {
        props.loader(false);
        console.log("res=====> Driver Data ::", res);
        setDriverData(res?.data);
      },
      (error) => {
        props.loader(false);
        console.log(error);
        props.toaster({ type: "error", message: error.message });
      }
    );
  };

  const updateStatus = async (id, verified) => {
    props.loader(true);
    Api("post", `verifyuser/${id}`, {verified}, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        getDriver();
        if (verified === "SUSPEND") {
          props.toaster({
            type: "success",
            message: "Driver suspended successfully",
          });
        }
        if (verified === "VERIFIED") {
          props.toaster({
            type: "success",
            message: "Driver verified successfully",
          });
        }
        setviewPopup(false);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  // Table Cell Components with enhanced styling
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
      <div className="flex items-center justify-center">
        <p className="text-gray-700 text-base font-normal hover:text-blue-600 transition-colors">{value}</p>
      </div>
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
      <div className="flex items-center justify-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium text-center
          ${value === "VERIFIED" && "bg-green-100 text-green-700"}
          ${value === "SUSPEND" && "bg-red-100 text-red-700"}
          ${value === "PENDING" && "bg-yellow-100 text-yellow-700"}
        `}>
          {value}
        </span>
      </div>
    );
  }

  const info = ({ value, row }) => {
    return (
      <div className="flex items-center justify-center">
        <button
          className="h-[38px] w-[100px] bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 text-sm font-medium rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300 flex items-center justify-center"
          onClick={() => {
            setviewPopup(true);
            setPopupData(row.original);
          }}
        >
          <span className="mr-2">Details</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
          </svg>
        </button>
      </div>
    );
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        Cell: indexID,
      },
      {
        Header: "NAME",
        accessor: "username",
        Cell: name,
      },
      {
        Header: "E-MAIL",
        accessor: "email",
        Cell: email,
      },
      {
        Header: "DATE",
        accessor: "createdAt",
        Cell: date,
      },
      {
        Header: "STATUS",
        accessor: "verified",
        Cell: status,
      },
      {
        Header: "ACTIONS",
        Cell: info,
      },
    ],
    []
  );

  return (
    <section className="w-full h-full bg-gray-50 md:pt-5 pt-2 pb-5 pl-5 pr-5">
      {/* Enhanced Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <div className="bg-blue-600 h-8 w-1 rounded mr-3"></div>
          <h1 className="text-gray-800 font-bold md:text-3xl text-2xl">
            Driver Management
          </h1>
        </div>
        <div className="mt-3 md:mt-0 flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search driver..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden md:mt-6 mt-4">
        {/* Enhanced Filter Section */}
        <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-4">
          <div className="md:flex items-center">
            <div className="flex items-center">
              <div className="bg-blue-50 p-2 rounded-lg">
                <FiFilter className="text-blue-600" size={20} />
              </div>
              <h2 className="ml-3 text-gray-800 font-semibold">Filter Options</h2>
            </div>
            <div className="md:ml-8 mt-4 md:mt-0 flex items-center flex-wrap gap-3">
              <div className="flex items-center">
                <label className="text-gray-700 font-medium mr-3">Date Range:</label>
                <input
                  className="px-4 py-2 border text-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  placeholder="Select date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
              <div className="flex items-center ml-0 md:ml-4">
                <label className="text-gray-700 font-medium mr-3">Status:</label>
                <select className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="PENDING">Pending</option>
                  <option value="SUSPEND">Suspended</option>
                </select>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg ml-0 md:ml-4 transition-all duration-300">
                Apply Filter
              </button>
            </div>
          </div>
        </div>

        {/* Table Section with fixed height for scrolling */}
        <div className="p-4">
          <div className="overflow-x-auto">
            <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
              <Table columns={columns} data={driverData} />
            </div>
          </div>
        </div>
      </section>
{viewPopup && (
  <Dialog 
    open={viewPopup} 
    onClose={handleClose} 
    maxWidth="md"
    PaperProps={{
      style: { 
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <div className="p-6 bg-white relative overflow-hidden">
      {/* Close Button with hover effect */}
      <button 
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        onClick={handleClose}
      >
        <IoCloseCircleOutline className="h-8 w-8" />
      </button>

      {/* Header Section with Profile Information */}
      <div className="md:flex justify-between border-b border-gray-200 pb-5">
        <div className="flex flex-col md:flex-row items-start">
          <div className="relative">
            <Avatar
              // alt={singleData.username}
              // src={singleData.profile}
              sx={{ 
                width: 70, 
                height: 70,
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
              }}
            />
            {popupData?.verified === "Verified" && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="flex flex-col justify-start md:pl-5 mt-3 md:mt-0">
            <h3 className="text-xl font-bold text-gray-800">
              {popupData?.username}
            </h3>
            <div className="flex items-center mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <p className="text-base text-gray-600 ml-1">
                {popupData?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="flex md:justify-center justify-start items-center md:border-l border-gray-200 mt-4 md:mt-0">
          <div className="grid grid-cols-2 gap-5 md:pl-6">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-xl font-bold text-blue-600">0</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-xl font-bold text-green-600">0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Image Carousel */}
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
            onRealIndexChange={(newindex) => setCuurentIndex(newindex.activeIndex)}
            onSlideChange={() => console.log("slide change")}
            onSwiper={(swiper) => console.log(swiper)}
          >
            {driverData?.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="w-full flex justify-center items-center bg-gray-100 py-4">
                  <div className="relative rounded-lg overflow-hidden">
                    <img
                      src={item?.img}
                      alt={`Document ${i+1}`}
                      className="rounded-lg md:w-80 md:h-64 w-60 h-48 object-cover"
                    />
                  </div>
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

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        {popupData?.verified !== "Verified" && (
          <button
            className="flex items-center justify-center text-white font-medium px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => {
              updateStatus(popupData?._id, "VERIFIED");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Verify
          </button>
        )}
        {popupData?.verified !== "Suspend" && (
          <button
            className="flex items-center justify-center text-white font-medium px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
            onClick={() => {
              updateStatus(popupData?._id, "SUSPEND");
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
            </svg>
            Suspend
          </button>
        )}
      </div>
    </div>
  </Dialog>
)}
      {/* Enhanced Detail Popup */}
      
    </section>
  );
}

export default isAuth(driver);