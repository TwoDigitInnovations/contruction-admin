import React, { useMemo, useState, useEffect } from "react";
import Table from "@/components/table";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import moment from "moment";
import {
    RxCrossCircled
} from "react-icons/rx";
import {
    FiSearch,
    FiCalendar,
    FiEye,
    FiMail,
    FiPhone,
    FiUser,
} from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import isAuth from "@/components/isAuth";
import PaginationComponent from "@/components/PaginationComponen";

function Queries(props) {
    const router = useRouter();
    const [GetInTouchData, setGetInTouchData] = useState([]);
    const [viewPopup, setviewPopup] = useState(false);
    const [popupData, setPopupData] = useState({});
    const [filterDate, setFilterDate] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        getInTouch();
    }, [currentPage]);

    // Reset to first page when filters change
    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            getInTouch();
        }
    }, [searchTerm, filterDate]);

    const getInTouch = () => {
        props.loader(true);

        const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: itemsPerPage.toString(),
        });

        if (searchTerm) queryParams.append("search", searchTerm);
        if (filterDate) queryParams.append("date", filterDate);

        Api("get", `getInquery?${queryParams}`, "", router).then(
            (res) => {
                props.loader(false);

                if (res?.status) {
                    setGetInTouchData(res?.data?.data || []);
                    setCurrentPage(res?.data?.currentPage || 1);
                    setTotalPages(res?.data?.totalPages || 0);
                    setTotalItems(res?.data?.totalItems || 0);
                } else {
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    // Filtered Data (for client display)
    const filteredData = useMemo(() => {
        return GetInTouchData.filter((item) => {
            const matchesSearch =
                searchTerm === "" ||
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone?.includes(searchTerm);

            const matchesDate =
                filterDate === "" ||
                moment(item.createdAt).format("YYYY-MM-DD") === filterDate;

            return matchesSearch && matchesDate;
        });
    }, [GetInTouchData, searchTerm, filterDate]);

    // Table column renderers
    const name = ({ value }) => (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                <FiUser className="text-white text-sm" />
            </div>
            <p className="text-gray-800 text-sm font-medium">{value}</p>
        </div>
    );

    const email = ({ value }) => (
        <div className="flex items-center gap-2">
            <FiMail className="text-yellow-600 text-sm" />
            <p className="text-gray-700 text-sm font-normal">{value}</p>
        </div>
    );

    const date = ({ value }) => (
        <div className="flex items-center gap-2">
            <FiCalendar className="text-yellow-600 text-sm" />
            <p className="text-gray-700 text-sm font-normal">
                {moment(value).format("DD MMM YYYY")}
            </p>
        </div>
    );

    const mobile = ({ value }) => (
        <div className="flex items-center gap-2">
            <FiPhone className="text-yellow-600 text-sm" />
            <p className="text-gray-700 text-sm font-normal">{value}</p>
        </div>
    );

    const info = ({ row }) => (
        <div className="flex items-center justify-center">
            <button
                className="group relative h-9 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                onClick={() => {
                    setviewPopup(true);
                    setPopupData(row.original);
                }}
            >
                <FiEye className="text-sm" />
                View
            </button>
        </div>
    );

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
            },
            { Header: "NAME", accessor: "name", Cell: name },
            { Header: "EMAIL", accessor: "email", Cell: email },
            { Header: "DATE", accessor: "createdAt", Cell: date },
            { Header: "MOBILE", accessor: "phone", Cell: mobile },
            { Header: "ACTION", accessor: "view", Cell: info },
        ],
        [currentPage, itemsPerPage]
    );

    const clearFilters = () => {
        setSearchTerm("");
        setFilterDate("");
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-yellow-50 px-4 md:px-6 py-6">
            <div className="overflow-y-scroll h-screen scrollbar-hide pb-28">
                <div className="flex-shrink-0 mb-6 ">
                    {/* Filters Section */}
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl md:p-6 p-3">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-900 font-bold text-2xl md:text-3xl">
                                Customer Queries
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                <span>Total: {totalItems} queries</span>
                            </div>
                        </div>

                        {/* Search and Filters */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search */}
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-transparent text-black transition-all duration-300 bg-white"
                                />
                            </div>

                            {/* Date Filter */}
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="w-full text-black pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300 bg-white"
                                />
                            </div>

                            {/* Clear Button */}
                            <div className="flex items-center">
                                <button
                                    onClick={clearFilters}
                                    className="w-full py-3 px-4 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 font-medium rounded-xl transition-all duration-300 border border-yellow-400 hover:shadow-md"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex-1 pb-6">
                    <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200 h-full flex flex-col">
                        <div className="flex-1 min-h-screen p-4 flex flex-col">
                            {/* Table */}
                            <div className="flex-1 ">
                                {filteredData.length > 0 ? (
                                    <Table
                                        columns={columns}
                                        data={filteredData}
                                        disablePagination={true}
                                        showPagination={false}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center min-h-[450px] bg-gray-50 rounded-lg">
                                        <div className="text-center space-y-2">
                                            <BiMessageSquareDetail className="mx-auto h-14 w-14 text-gray-400 mb-2" />
                                            <h3 className="text-lg font-medium text-gray-900">No queries found</h3>
                                            <p className="text-sm text-gray-500">
                                                {searchTerm || filterDate
                                                    ? "Try adjusting your filters"
                                                    : "No customer queries available"}
                                            </p>
                                        </div>
                                    </div>

                                )}
                            </div>


                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                </div>

            </div>
            {viewPopup && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative w-[90%] max-w-lg bg-white rounded-lg shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">
                                Query Details
                            </h3>
                            <button
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                onClick={() => setviewPopup(false)}
                            >
                                <RxCrossCircled className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Name:
                                    </label>
                                    <p className="text-gray-800">{popupData.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Email:
                                    </label>
                                    <p className="text-gray-800">{popupData.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Phone:
                                    </label>
                                    <p className="text-gray-800">{popupData.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Date:
                                    </label>
                                    <p className="text-gray-800">
                                        {moment(popupData.createdAt).format("DD MMM YYYY, hh:mm A")}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Service:
                                    </label>
                                    <p className="text-gray-800">{popupData.service}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">
                                        Description:
                                    </label>
                                    <p className="text-gray-800 leading-relaxed">
                                        {popupData.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4">
                            <button
                                onClick={() => setviewPopup(false)}
                                className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default isAuth(Queries);
