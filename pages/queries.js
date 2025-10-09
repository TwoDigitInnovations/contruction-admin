import React, { useMemo, useState, useEffect } from 'react'
import Table, { indexID } from '@/components/table'
import { Api } from '@/services/service';
import { useRouter } from 'next/router'
import moment from 'moment';
import { RxCrossCircled } from 'react-icons/rx'
import { FiSearch, FiFilter, FiCalendar, FiEye, FiMail, FiPhone, FiUser, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { BiMessageSquareDetail } from 'react-icons/bi'
import isAuth from '@/components/isAuth';

function Queries(props) {
    const router = useRouter()
    const [GetInTouchData, setGetInTouchData] = useState([]);
    const [viewPopup, setviewPopup] = useState(false)
    const [popupData, setPopupData] = useState({});
    const [filterDate, setFilterDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
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
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            page: currentPage.toString(),
            limit: itemsPerPage.toString()
        });

        // Add search and filter parameters if they exist
        if (searchTerm) queryParams.append('search', searchTerm);
        if (filterDate) queryParams.append('date', filterDate);

        Api("get", `getInquery?${queryParams}`, "", router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.status) {
                    setGetInTouchData(res?.data?.data || []);
                    setCurrentPage(res?.data?.currentPage || 1);
                    setTotalPages(res?.data?.totalPages || 0);
                    setTotalItems(res?.data?.totalItems || 0);
                } else {
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.data?.message });
                props.toaster({ type: "error", message: err?.message });
            }
        );
    };

    // Filter data based on search and date (for display purposes)
    const filteredData = useMemo(() => {
        return GetInTouchData.filter(item => {
            const matchesSearch = searchTerm === '' || 
                item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.phone?.includes(searchTerm);
            
            const matchesDate = filterDate === '' || 
                moment(item.createdAt).format('YYYY-MM-DD') === filterDate;
            
            return matchesSearch && matchesDate;
        });
    }, [GetInTouchData, searchTerm, filterDate]);

    // Pagination handlers
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

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Generate page numbers for pagination
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

    function name({ value }) {
        return (
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <FiUser className="text-white text-sm" />
                </div>
                <p className='text-gray-800 text-sm font-medium'>{value}</p>
            </div>
        )
    }

    function email({ value }) {
        return (
            <div className="flex items-center gap-2">
                <FiMail className="text-blue-500 text-sm" />
                <p className='text-gray-700 text-sm font-normal'>{value}</p>
            </div>
        )
    }

    function date({ value }) {
        return (
            <div className="flex items-center gap-2">
                <FiCalendar className="text-green-500 text-sm" />
                <p className='text-gray-700 text-sm font-normal'>{moment(value).format('DD MMM YYYY')}</p>
            </div>
        )
    }

    function mobile({ value }) {
        return (
            <div className="flex items-center gap-2">
                <FiPhone className="text-orange-500 text-sm" />
                <p className='text-gray-700 text-sm font-normal'>{value}</p>
            </div>
        )
    }

    const info = ({ value, row }) => {
        return (
            <div className="flex items-center justify-center">
                <button 
                    className="group relative h-9 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center gap-2"
                    onClick={() => {
                        setviewPopup(true)
                        setPopupData(row.original)
                    }}
                >
                    <FiEye className="text-sm" />
                    View
                    <div className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
            </div>
        );
    };

    const columns = useMemo(
        () => [
            {
                Header: "ID",
                Cell: ({ row }) => (currentPage - 1) * itemsPerPage + row.index + 1,
            },
            {
                Header: "NAME",
                accessor: 'name',
                Cell: name
            },
            {
                Header: "EMAIL",
                accessor: 'email',
                Cell: email
            },
            {
                Header: "DATE",
                accessor: 'createdAt',
                Cell: date
            },
            {
                Header: "MOBILE",
                accessor: 'phone',
                Cell: mobile
            },
            {
                Header: "ACTION",
                accessor: "view",
                Cell: info,
            },
        ],
        [currentPage, itemsPerPage]
    );

    const clearFilters = () => {
        setSearchTerm('');
        setFilterDate('');
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        {/* Header content */}
                    </div>
                </div>

                {/* Filter Section - Fixed */}
                <div className='bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-6'>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-900 font-bold text-2xl md:text-3xl">Customer Queries</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Total: {totalItems} queries</span>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {/* Search Input */}
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                            />
                        </div>
                        
                        {/* Date Filter */}
                        <div className="relative">
                            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="date"
                                value={filterDate}
                                onChange={(e) => setFilterDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white"
                            />
                        </div>
                        
                        {/* Clear Filters Button */}
                        <div className="flex items-center">
                            <button
                                onClick={clearFilters}
                                className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 border border-gray-300 hover:shadow-md"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Section - Scrollable */}
            <div className="flex-1 min-h-0 px-6 pb-6">
                <div className='bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200 h-full flex flex-col'>
                    {/* Table Content with Pagination */}
                    <div className='flex-1 min-h-0 p-6 flex flex-col'>
                        {/* Table */}
                        <div className="flex-1 overflow-auto mb-6">
                            <div className="min-w-full">
                                {filteredData.length > 0 ? (
                                    <Table columns={columns} data={filteredData} disablePagination={true} showPagination={false} />
                                ) : (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-center">
                                            <BiMessageSquareDetail className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No queries found</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                {searchTerm || filterDate ? 'Try adjusting your filters' : 'No customer queries available'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination Section */}
                        {totalPages > 1 && (
                            <div className="flex-shrink-0 border-t border-gray-200 pt-6">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    {/* Page Info */}
                                    <div className="text-sm mb-10 text-gray-600">
                                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                                    </div>

                                    {/* Pagination Controls */}
                                    <div className="flex items-center mb-5 gap-2">
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
                </div>
            </div>

            {/* Simple Popup Modal */}
            {viewPopup && (
                <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative w-[90%] max-w-lg bg-white rounded-lg shadow-lg">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Query Details</h3>
                            <button
                                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                                onClick={() => setviewPopup(false)}
                            >
                                <RxCrossCircled className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className='p-4 space-y-4 max-h-96 overflow-y-auto'>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Name:</label>
                                    <p className="text-gray-800">{popupData.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Email:</label>
                                    <p className="text-gray-800">{popupData.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Phone:</label>
                                    <p className="text-gray-800">{popupData.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Date:</label>
                                    <p className="text-gray-800">{moment(popupData.createdAt).format('DD MMM YYYY, hh:mm A')}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Service:</label>
                                    <p className="text-gray-800">{popupData.service}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Description:</label>
                                    <p className="text-gray-800 leading-relaxed">{popupData.description}</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t p-4">
                            <button
                                onClick={() => setviewPopup(false)}
                                className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default isAuth(Queries)