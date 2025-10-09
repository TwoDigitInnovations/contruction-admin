import React, { useMemo, useState, useEffect } from "react";
import Table, { indexID } from "@/components/table";
import { useRouter } from "next/router";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import { IoCloseCircleOutline } from "react-icons/io5";
import Avatar from "@mui/material/Avatar";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
// Import icons for enhanced UI
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

function Users(props) {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const [viewPopup, setViewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(0);
const [totalItems, setTotalItems] = useState(0);
const [itemsPerPage] = useState(10);

  useEffect(() => {
    getUsers();
}, [currentPage]);

useEffect(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    } else {
        getUsers();
    }
}, [searchTerm, filterDate]);

  const handleClose = () => {
    setViewPopup(false);
  };

const getUsers = async () => {
    props.loader(true);
    
    // Build query parameters
    const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
    });

    // Add search and filter parameters if they exist
    if (searchTerm) queryParams.append('search', searchTerm);
    if (filterDate) queryParams.append('date', filterDate);

    await Api("get", `getAllUsers?${queryParams}`, "", router).then(
        (res) => {
            props.loader(false);
            console.log("res=====> User Data ::", res);
            setUserData(res?.data?.users || []);
            
            // Fix pagination calculation
            const total = res?.data?.pagination?.total || res?.data?.users?.length || 0;
            const pages = Math.ceil(total / itemsPerPage);
            
            setCurrentPage(res?.data?.pagination?.page || 1);
            setTotalPages(pages);
            setTotalItems(total);
        },
        (error) => {
            props.loader(false);
            console.log(error);
            props.toaster({ type: "error", message: error.message });
        }
    );
};


const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
};

const handlePrevious = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
};

console.log("Pagination Debug:", {
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
    userDataLength: userData.length
});

const handleNext = () => {
    if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
    }
};

const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        if (currentPage <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }
    }
    
    return pages;
};

const clearFilters = () => {
    setSearchTerm('');
    setFilterDate('');
    setCurrentPage(1);
};

  const updateStatus = async (id, verified) => {
    props.loader(true);
    Api("post", `verifyuser/${id}`, {verified}, router).then(
      (res) => {
        props.loader(false);
        console.log("res================>", res);
        getUsers();
        if (verified === "SUSPEND") {
          props.toaster({
            type: "success",
            message: "User suspended successfully",
          });
        }
        if (verified === "VERIFIED") {
          props.toaster({
            type: "success",
            message: "User verified successfully",
          });
        }
        setViewPopup(false);
      },
      (err) => {
        props.loader(false);
        console.log(err);
        props.toaster({ type: "error", message: err?.message });
      }
    );
  };

  // Handle pagination
  // const handlePageChange = (newPage) => {
  //   if (newPage >= 1 && newPage <= totalPages) {
  //     setPage(newPage);
  //   }
  // };

  // Table Cell Components with enhanced styling
  function name({ value }) {
    return (
      <div className="flex items-center justify-center">
        <HiOutlineUserCircle className="text-gray-500 mr-2" size={20} />
        <p className="text-gray-800 text-base font-medium">{value || "—"}</p>
      </div>
    );
  }

  function emailCell({ value }) {
    return (
      <div className="flex items-center justify-center">
        <p className="text-gray-700 text-base font-normal hover:text-blue-600 transition-colors">{value}</p>
      </div>
    );
  }

  function userType({ value }) {
    return (
      <div className="flex items-center justify-center">
        <span className={`px-3 py-1 rounded-full text-sm font-medium
          ${value === "USER" && "bg-blue-100 text-blue-700"}
          ${value === "VENDOR" && "bg-purple-100 text-purple-700"}
          ${value === "DRIVER" && "bg-green-100 text-green-700"}
        `}>
          {value}
        </span>
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
            setViewPopup(true);
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
      // {
      //   Header: "ID",
      //   Cell: indexID,
      // },
 {
    Header: "ID",
    Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
},
      {
        Header: "NAME",
        accessor: "username",
        Cell: name,
      },
      {
        Header: "E-MAIL",
        accessor: "email",
        Cell: emailCell,
      },
      {
        Header: "USER TYPE",
        accessor: "type",
        Cell: userType,
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
            User Management
          </h1>
        </div>
        <div className="mt-3 md:mt-0 flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search user..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                <label className="text-gray-700 font-medium mr-3">User Type:</label>
                <select className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">All</option>
                  <option value="USER">User</option>
                  <option value="VENDOR">Vendor</option>
                  <option value="DRIVER">Driver</option>
                </select>
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
        <div className="max-h-[calc(100vh-370px)] overflow-y-auto">
            {userData.length > 0 ? (
                <Table columns={columns} data={userData} disablePagination={true} showPagination={false} />
            ) : (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <HiOutlineUserCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterDate ? 'Try adjusting your filters' : 'No users available'}
                        </p>
                    </div>
                </div>
            )}
        </div>
        </div>
          
          {/* Pagination Controls */}
        {/* Pagination Controls - Replace the entire existing pagination section with this */}
{userData.length > 0 && totalItems > itemsPerPage && (
        <div className="flex-shrink-0 border-t border-gray-200 pt-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-600">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                            currentPage === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <FiChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => (
                            <button
                                key={index}
                                onClick={() => typeof page === 'number' && handlePageChange(page)}
                                disabled={page === '...'}
                                className={`px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                                    page === currentPage
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                                        : page === '...'
                                        ? 'text-gray-400 cursor-default'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                            currentPage === totalPages
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <FiChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    )}
        </div>
      </section>

      {/* User Detail Popup */}
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
                    alt={popupData?.username || "User"}
                    sx={{ 
                      width: 70, 
                      height: 70,
                      bgcolor: popupData?.type === "USER" ? "#3B82F6" : 
                              popupData?.type === "VENDOR" ? "#8B5CF6" : "#10B981",
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' 
                    }}
                  >
                    {popupData?.username?.charAt(0) || "U"}
                  </Avatar>
                  {popupData?.verified === "VERIFIED" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-start md:pl-5 mt-3 md:mt-0">
                  <h3 className="text-xl font-bold text-gray-800">
                    {popupData?.username || "Anonymous User"}
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
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <p className="text-base text-gray-600 ml-1">
                      {popupData?.phone || "Not provided"}
                    </p>
                  </div>
                  <div className="flex items-center mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-base text-gray-600 ml-1">
                      {popupData?.address || popupData?.shop_address || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* User Type and Status */}
              <div className="flex md:justify-center justify-start items-center mt-4 md:mt-0">
                <div className="flex flex-col">
                  <div className="mb-2">
                    <span className="text-sm font-medium text-gray-500">User Type</span>
                    <div className="mt-1">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block
                        ${popupData?.type === "USER" && "bg-blue-100 text-blue-700"}
                        ${popupData?.type === "VENDOR" && "bg-purple-100 text-purple-700"}
                        ${popupData?.type === "DRIVER" && "bg-green-100 text-green-700"}
                      `}>
                        {popupData?.type}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <div className="mt-1">
                      <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block
                        ${popupData?.verified === "VERIFIED" && "bg-green-100 text-green-700"}
                        ${popupData?.verified === "SUSPEND" && "bg-red-100 text-red-700"}
                        ${popupData?.verified === "PENDING" && "bg-yellow-100 text-yellow-700"}
                      `}>
                        {popupData?.verified}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional User Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location Information */}
              {popupData?.location && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Location</h4>
                  <div className="text-gray-600">
                    <p><span className="font-medium">City:</span> {popupData?.city || "Not provided"}</p>
                    <p><span className="font-medium">State:</span> {popupData?.state || "Not provided"}</p>
                    <p><span className="font-medium">Country:</span> {popupData?.country || "Not provided"}</p>
                    <p><span className="font-medium">Pincode:</span> {popupData?.pincode || "Not provided"}</p>
                    <p><span className="font-medium">Coordinates:</span> {popupData?.location?.coordinates?.join(", ") || "Not provided"}</p>
                  </div>
                </div>
              )}

              {/* Vendor Information */}
              {popupData?.type === "VENDOR" && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-lg font-semibold text-purple-700 mb-3">Vendor Details</h4>
                  <div className="text-gray-600">
                    <p><span className="font-medium">Shop Name:</span> {popupData?.shop_name || "Not provided"}</p>
                    <p><span className="font-medium">Shop Address:</span> {popupData?.shop_address || "Not provided"}</p>
                  </div>
                </div>
              )}

              {/* Account Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-700 mb-3">Account Information</h4>
                <div className="text-gray-600">
                  <p><span className="font-medium">Account Created:</span> {moment(popupData?.createdAt).format("MMMM DD, YYYY")}</p>
                  <p><span className="font-medium">Last Updated:</span> {moment(popupData?.updatedAt).format("MMMM DD, YYYY")}</p>
                  <p><span className="font-medium">Account ID:</span> {popupData?._id}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="mt-6 flex justify-center gap-4">
              {popupData?.verified !== "VERIFIED" && (
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
              {popupData?.verified !== "SUSPEND" && (
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
            </div> */}
          </div>
        </Dialog>
      )}
    </section>
  );
}

export default isAuth(Users);