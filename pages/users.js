import React, { useMemo, useState, useEffect } from "react";
import Table from "@/components/table";
import { useRouter } from "next/router";
import moment from "moment";
import Dialog from "@mui/material/Dialog";
import Avatar from "@mui/material/Avatar";
import isAuth from "@/components/isAuth";
import { Api } from "@/services/service";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";
import { HiOutlineUserCircle } from "react-icons/hi";
import { IoCloseCircleOutline } from "react-icons/io5";
import PaginationComponent from "@/components/PaginationComponen"; // ensure correct path
import { Eye } from "lucide-react";

function Users(props) {
  const router = useRouter();

  // table data
  const [userData, setUserData] = useState([]);

  // popup
  const [viewPopup, setViewPopup] = useState(false);
  const [popupData, setPopupData] = useState({});

  // filters
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // VERIFIED, PENDING, SUSPEND
  const [searchTerm, setSearchTerm] = useState("");

  // pagination
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
  }, [searchTerm, filterDate, filterStatus]);



  const getUsers = async () => {
    props.loader(true);

    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        status:filterStatus,
        userType: "USER",
      });

      if (searchTerm) queryParams.append("search", searchTerm);
      if (filterDate) queryParams.append("date", filterDate);
      if (filterStatus) queryParams.append("verified", filterStatus);

      const res = await Api("get", `getAllUsers?${queryParams}`, "", router);
      props.loader(false);

      // response handling (safe fallbacks)
      const users = res?.data?.users || [];
      const pagination = res?.data?.pagination || {};
      const total = pagination?.total ?? users.length ?? 0;
      const page = pagination?.page ?? currentPage;
      const pages = Math.ceil(total / itemsPerPage) || 0;

      setUserData(users);
      setCurrentPage(page);
      setTotalPages(pages);
      setTotalItems(total);
    } catch (error) {
      props.loader(false);
      console.error("getUsers error:", error);
      props.toaster({ type: "error", message: error?.message || "Failed to fetch users" });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterStatus("");
    setCurrentPage(1);
  };

 
  const updateStatus = async (id, verified) => {
    props.loader(true);
    try {
      const res = await Api("post", `verifyuser/${id}`, { verified }, router);
      props.loader(false);

      if (res?.status) {
        // refresh list
        await getUsers();
        props.toaster({
          type: "success",
          message:
            verified === "VERIFIED"
              ? "User verified successfully"
              : verified === "SUSPEND"
                ? "User suspended successfully"
                : "Status updated",
        });
      } else {
        props.toaster({ type: "error", message: res?.data?.message || "Failed to update status" });
      }
      setViewPopup(false);
    } catch (err) {
      props.loader(false);
      console.error("updateStatus error:", err);
      props.toaster({ type: "error", message: err?.message || "Failed to update status" });
    }
  };

  const renderName = ({ value }) => (
    <div className="flex items-center justify-center">
      <HiOutlineUserCircle className="text-gray-500 mr-2" size={20} />
      <p className="text-gray-800 text-base font-medium">{value || "—"}</p>
    </div>
  );

  const renderEmail = ({ value }) => (
    <div className="flex items-center justify-center">
      <p className="text-gray-700 text-base font-normal hover:text-blue-600 transition-colors">{value}</p>
    </div>
  );

  const renderUserType = ({ value }) => (
    <div className="flex items-center justify-center">
      <span className={`px-3 py-1 rounded-full text-sm font-medium
        ${value === "USER" ? "bg-blue-100 text-blue-700" : ""}
        ${value === "VENDOR" ? "bg-purple-100 text-purple-700" : ""}
        ${value === "DRIVER" ? "bg-green-100 text-green-700" : ""}
      `}>
        {value}
      </span>
    </div>
  );

  const renderDate = ({ value }) => (
    <div className="flex items-center justify-center bg-gray-50 rounded-md px-3 py-1">
      <FiCalendar className="text-gray-500 mr-2" size={16} />
      <p className="text-gray-700 text-sm font-medium">{moment(value).format("DD MMM YYYY")}</p>
    </div>
  );

  const renderStatus = ({ value }) => (
    <div className="flex items-center justify-center">
      <span className={`px-3 py-1 rounded-full text-sm font-medium text-center
        ${value === "VERIFIED" ? "bg-green-100 text-green-700" : ""}
        ${value === "SUSPEND" ? "bg-red-100 text-red-700" : ""}
        ${value === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
      `}>
        {value}
      </span>
    </div>
  );

  const renderActions = ({ row }) => (
    <div className="flex items-center justify-center">
      <button
        className="h-[38px] w-[110px] bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 text-sm font-medium rounded-lg border border-yellow-200 hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
        onClick={() => {
          setViewPopup(true);
          setPopupData(row.original);
        }}
      >
        <span>Details</span>
        
        <Eye size={16} />
      </button>
    </div>
  );

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
      },
      {
        Header: "NAME",
        accessor: "username",
        Cell: renderName,
      },
      {
        Header: "E-MAIL",
        accessor: "email",
        Cell: renderEmail,
      },
      {
        Header: "USER TYPE",
        accessor: "type",
        Cell: renderUserType,
      },
      {
        Header: "DATE",
        accessor: "createdAt",
        Cell: renderDate,
      },
      {
        Header: "STATUS",
        accessor: "verified",
        Cell: renderStatus,
      },
      {
        Header: "ACTIONS",
        Cell: renderActions,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentPage, itemsPerPage]
  );

  return (
    <section className="w-full h-full bg-gray-50 pb-8 py-6 md:px-6 px-2">
      <div className="overflow-y-scroll h-screen scrollbar-hide pb-28 ">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4  backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6">
          <div>
            <h1 className="text-gray-800 font-bold md:text-3xl text-2xl">User Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage platform users — verify, suspend, and view details</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[24rem]">
              <input
                type="text"
                placeholder="Search user by name, email or phone..."
                className="pl-10 pr-4 py-2 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 mb-6">

          <div className="bg-gradient-to-r from-yellow-50 to-white border-b border-gray-200 p-4">
            <div className="md:flex md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <FiFilter className="text-yellow-600" size={18} />
                </div>
                <h2 className="ml-1 text-gray-800 font-semibold">Filter Options</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
                {/* Date */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium">Date:</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  <label className="text-gray-700 font-medium">Status:</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="">All</option>
                    <option value="VERIFIED">Verified</option>
                    <option value="PENDING">Pending</option>
                    <option value="SUSPEND">Suspended</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={clearFilters}
                    className="bg-yellow-600 text-white hover:bg-gray-200  px-4 py-2 rounded-lg transition-all duration-200"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

       
          <div className="px-4">

            <div className="">
              {userData.length > 0 ? (
                <Table columns={columns} data={userData} disablePagination={true} showPagination={false} />
              ) : (
                <div className="flex items-center justify-center min-h-[450px] rounded-lg">
                  <div className="text-center py-10">
                    <HiOutlineUserCircle className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-xl font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-md text-gray-500">
                      {searchTerm || filterDate || filterStatus ? 'Try adjusting your filters' : 'No users available'}
                    </p>
                  </div>
                </div>
              )}
            </div>

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
      </div>


      {viewPopup && (
        <Dialog
          open={viewPopup}
          onClose={() => setViewPopup(false)}
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
            {/* Close */}
            <button
              onClick={() => setViewPopup(false)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <IoCloseCircleOutline className="h-7 w-7" />
            </button>

            {/* Header */}
            <div className="md:flex justify-between items-start gap-4 border-b border-gray-100 pb-4">
              <div className="flex items-start gap-4">
                <Avatar
                  alt={popupData?.username || "User"}
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: popupData?.type === "USER" ? "#F59E0B" :
                      popupData?.type === "VENDOR" ? "#8B5CF6" : "#10B981",
                    boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
                  }}
                >
                  {popupData?.username?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>

                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800">{popupData?.username || "Anonymous User"}</h3>
                  <p className="text-sm text-gray-600 mt-1">{popupData?.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{popupData?.phone || "Not provided"}</p>
                  <p className="text-sm text-gray-500 mt-1">{moment(popupData?.createdAt).format("MMMM DD, YYYY")}</p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 mt-3 md:mt-0">
                <div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block
                    ${popupData?.type === "USER" ? "bg-blue-100 text-blue-700" : ""}
                    ${popupData?.type === "VENDOR" ? "bg-purple-100 text-purple-700" : ""}
                    ${popupData?.type === "DRIVER" ? "bg-green-100 text-green-700" : ""}
                  `}>
                    {popupData?.type || "USER"}
                  </span>
                </div>
                <div>
                  <span className={`px-4 py-1 rounded-full text-sm font-medium inline-block
                    ${popupData?.verified === "VERIFIED" ? "bg-green-100 text-green-700" : ""}
                    ${popupData?.verified === "SUSPEND" ? "bg-red-100 text-red-700" : ""}
                    ${popupData?.verified === "PENDING" ? "bg-yellow-100 text-yellow-700" : ""}
                  `}>
                    {popupData?.verified || "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-gray-700 mb-2">Contact & Location</h4>
                <p className="text-sm text-gray-600"><span className="font-medium">Email:</span> {popupData?.email || "Not provided"}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Phone:</span> {popupData?.phone || "Not provided"}</p>
                <p className="text-sm text-gray-600 mt-2"><span className="font-medium">Address:</span> {popupData?.address || popupData?.shop_address || "Not provided"}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-blue-700 mb-2">Account</h4>
                <p className="text-sm text-gray-600"><span className="font-medium">Created:</span> {moment(popupData?.createdAt).format("MMMM DD, YYYY")}</p>
                <p className="text-sm text-gray-600"><span className="font-medium">Updated:</span> {popupData?.updatedAt ? moment(popupData?.updatedAt).format("MMMM DD, YYYY") : "—"}</p>
                <p className="text-sm text-gray-600 mt-2 break-all"><span className="font-medium">Account ID:</span> {popupData?._id}</p>
              </div>
            </div>

            {/* Vendor extra info (if vendor) */}
            {popupData?.type === "VENDOR" && (
              <div className="mt-4 bg-purple-50 p-4 rounded-lg">
                <h4 className="text-md font-semibold text-purple-700 mb-2">Vendor Details</h4>
                <p className="text-sm text-gray-600"><span className="font-medium">Shop Name:</span> {popupData?.shop_name || "Not provided"}</p>
                <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Shop Address:</span> {popupData?.shop_address || "Not provided"}</p>
              </div>
            )}

            {/* Footer - action buttons */}
            <div className="mt-6 flex flex-col md:flex-row md:justify-end gap-3">
          {popupData?.verified !== "SUSPEND" && (
                <button
                  onClick={() => updateStatus(popupData?._id, "SUSPEND")}
                  className="w-full md:w-auto px-5 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                >
                  Suspend
                </button>
          )}
              

              
              <button
                onClick={() => updateStatus(popupData?._id, "VERIFIED")}
                className="w-full md:w-auto px-5 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
              >
                Verify
              </button>

         
              <button
                onClick={() => setViewPopup(false)}
                className="w-full md:w-auto px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </section>
  );
}

export default isAuth(Users);
