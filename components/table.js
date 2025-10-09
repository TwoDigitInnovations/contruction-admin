// import React from "react";
// import {
//   useTable,
//   useFilters,
//   useGlobalFilter,
//   useAsyncDebounce,
//   useSortBy,
//   usePagination,
// } from "react-table";
// // import {
// //   ChevronDoubleLeftIcon,
// //   ChevronLeftIcon,
// //   ChevronRightIcon,
// //   ChevronDoubleRightIcon,
// // } from "@heroicons/react/solid";
// import { Button, PageButton } from "./buttons";
// // import { classNames } from "./utils";
// import { SortIcon, SortUpIcon, SortDownIcon, Eyeicon } from "./icons";
// import Image from "next/image";
// import {
//   MdOutlineKeyboardDoubleArrowLeft,
//   MdKeyboardArrowLeft,
//   MdOutlineKeyboardArrowRight,
//   MdOutlineKeyboardDoubleArrowRight,
// } from "react-icons/md";

// // Define a default UI for filtering
// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length;
//   const [value, setValue] = React.useState(globalFilter);
//   // const onChange = useAsyncDebounce((value) => {
//   //   setGlobalFilter(value || undefined);
//   // }, 200);

//   const onChange = (value) => {
//     setGlobalFilter(value || undefined);
//   };

//   return (
//     <label className="w-full flex justify-end items-center gap-x-2 md:items-baseline md:px-0 py-5">
//       {/* <span className="text-black md:text-base text-xs ">Global Search: </span> */}
//       {/* <button type="button" className="text-white bg-yellow-600 px-4 py-2 rounded-md">Add items</button> */}
//       {/* <input
//         type="text"
//         className="rounded-md  p-2 w-96 border border-[#B9B9B9] shadow-sm outline-none"
//         value={value || ""}
//         onChange={(e) => {
//           setValue(e.target.value);
//           onChange(e.target.value);
//         }}
//         placeholder={`${count} records...`}
//       /> */}
//     </label>
//   );
// }

// // This is a custom filter UI for selecting
// // a unique option from a list
// export function SelectColumnFilter({
//   column: { filterValue, setFilter, preFilteredRows, id, render },
// }) {
//   // Calculate the options for filtering
//   // using the preFilteredRows
//   const options = React.useMemo(() => {
//     const options = new Set();
//     preFilteredRows.forEach((row) => {
//       options.add(row.values[id]);
//     });
//     return [...options.values()];
//   }, [id, preFilteredRows]);

//   // Render a multi-select box
//   return (
//     <label className="flex gap-x-2 items-baseline">
//       <span className="text-gray-700">{render("Header")}: </span>
//       <select
//         className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//         name={id}
//         id={id}
//         value={filterValue}
//         onChange={(e) => {
//           setFilter(e.target.value || undefined);
//         }}
//       >
//         <option value="">All</option>
//         {options.map((option, i) => (
//           <option key={i} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//     </label>
//   );
// }

// export function StatusPill({ value }) {
//   const status = value ? value.toLowerCase() : "unknown";

//   return <span className="text-white text-sm">{status}</span>;
// }

// export function indexID({ row }) {
//   // console.log(row);
//   return (
//     <div className="text-center">
//       <p>{parseInt(row.id) + 1}</p>
//     </div>
//   );
// }

// export function AvatarCell({ value, column, row }) {
//   return (
//     <div className="flex items-center">
//       <div className="ml-4">
//         <div className="text-sm font-medium text-white">{value}</div>
//         {/* <div className="text-sm text-gray-500">
//           {row.original[column.emailAccessor]}
//         </div> */}
//       </div>
//     </div>
//   );
// }

// function Table({ columns, data, refs }) {
//   // Use the state and functions returned from useTable to build your UI
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     prepareRow,
//     page, // Instead of using 'rows', we'll use page,
//     // which has only the rows for the active page

//     // The rest of these things are super handy, too ;)
//     canPreviousPage,
//     canNextPage,
//     pageOptions,
//     pageCount,
//     gotoPage,
//     nextPage,
//     previousPage,
//     setPageSize,

//     state,
//     preGlobalFilteredRows,
//     setGlobalFilter,
//   } = useTable(
//     {
//       columns,
//       data,
//     },
//     useFilters, // useFilters!
//     useGlobalFilter,
//     useSortBy,
//     usePagination // new
//   );

//   // Render the UI for your table
//   const defaultExpandedRows = data.map((element, index) => {
//     return { index: true };
//   });
//   return (
//     <>
//       <div className="sm:flex sm:gap-x-2">
//         <GlobalFilter
//           preGlobalFilteredRows={preGlobalFilteredRows}
//           globalFilter={state.globalFilter}
//           setGlobalFilter={setGlobalFilter}
//         />
//         {headerGroups.map((headerGroup) =>
//           headerGroup.headers.map((column) =>
//             column.Filter ? (
//               <div className="mt-2 sm:mt-0" key={column.id}>
//                 {column.render("Filter")}
//               </div>
//             ) : null
//           )
//         )}
//       </div>
//       {/* table */}
//       <div className="flex flex-col rounded-xl border-[#B9B9B9] border-[1px]">
//         <div className="-my-2 overflow-x-auto ">
//           <div className="py-2 align-middle inline-block min-w-full ">
//             <div className="shadow overflow-hidden  sm:rounded-lg">
//               <table
//                 {...getTableProps()}
//                 className="min-w-full rounded-xl"
//                 ref={refs}
//               >
//                 <thead className="bg-transparent  border-b-[1px] border-[#B9B9B9] rounded-xl pb-1">
//                   {headerGroups.map((headerGroup, index) => (
//                     <tr {...headerGroup.getHeaderGroupProps()} key={index}>
//                       {headerGroup.headers.map((column, index) => (
//                         // Add the sorting props to control sorting. For this example
//                         // we can add them into the header props
//                         <th
//                           key={index}
//                           scope="col"
//                           className="group pl-2 py-3  text-md font-medium text-black text-left tracking-wider"
//                           {...column.getHeaderProps(
//                             column.getSortByToggleProps()
//                           )}
//                         >
//                           <div className="flex items-center justify-center">
//                             {column.render("Header")}
//                             {/* Add a sort direction indicator */}
//                             <span>
//                               {column.isSorted ? (
//                                 column.isSortedDesc ? (
//                                   <SortDownIcon className="w-4 h-4 text-gray-400" />
//                                 ) : (
//                                   <SortUpIcon className="w-4 h-4 text-gray-400" />
//                                 )
//                               ) : (
//                                 <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
//                               )}
//                             </span>
//                           </div>
//                         </th>
//                       ))}
//                     </tr>
//                   ))}
//                 </thead>
//                 <tbody
//                   {...getTableBodyProps()}
//                   className="bg-white divide-y divide-[#B9B9B9] "
//                 >
//                   {page.map((row, i) => {
//                     // new
//                     prepareRow(row);
//                     return (
//                       <tr {...row.getRowProps()} key={i}>
//                         {row.cells.map((cell, index) => {
//                           return (
//                             <td
//                               key={index}
//                               {...cell.getCellProps()}
//                               className="pl-2 py-4 whitespace-nowrap text-white text-left"
//                               role="cell"
//                             >
//                               {
//                                 cell.column.Cell.name === "defaultRenderer" ? (
//                                   <div className="text-sm text-black ">
//                                     {cell.render("Cell")}
//                                   </div>
//                                 ) : (
//                                   <div className="text-sm text-black ">
//                                     {cell.render("Cell")}
//                                   </div>
//                                 )
//                                 // (cell.render("Cell"))
//                               }
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Pagination */}
//       <div className="py-3 flex items-center justify-between d_none">
//         <div className="flex-1 flex justify-between sm:hidden">
//           <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
//             Previous
//           </Button>
//           <Button onClick={() => nextPage()} disabled={!canNextPage}>
//             Next
//           </Button>
//         </div>
//         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//           <div className="flex gap-x-2 items-baseline">
//             <span className="text-sm text-black">
//               Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
//               <span className="font-medium">{pageOptions.length}</span>
//             </span>
//             <label>
//               <span className="sr-only">Items Per Page</span>
//               <select
//                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
//                 value={state.pageSize}
//                 onChange={(e) => {
//                   setPageSize(Number(e.target.value));
//                 }}
//               >
//                 {[5, 10, 20].map((pageSize) => (
//                   <option
//                     key={pageSize}
//                     value={pageSize}
//                     className="text-custom-orange"
//                   >
//                     Show {pageSize}
//                   </option>
//                 ))}
//               </select>
//             </label>
//           </div>
//           <div>
//             <nav
//               className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
//               aria-label="Pagination"
//             >
//               <PageButton
//                 className="rounded-l-md"
//                 onClick={() => gotoPage(0)}
//                 disabled={!canPreviousPage}
//               >
//                 <span className="sr-only">First</span>
//                 <MdOutlineKeyboardDoubleArrowLeft
//                   className="h-5 w-5 text-gray-400"
//                   aria-hidden="true"
//                 />
//               </PageButton>
//               <PageButton
//                 onClick={() => previousPage()}
//                 disabled={!canPreviousPage}
//               >
//                 <span className="sr-only">Previous</span>
//                 <MdKeyboardArrowLeft
//                   className="h-5 w-5 text-gray-400"
//                   aria-hidden="true"
//                 />
//               </PageButton>
//               <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
//                 <span className="sr-only">Next</span>
//                 <MdOutlineKeyboardArrowRight
//                   className="h-5 w-5 text-gray-400"
//                   aria-hidden="true"
//                 />
//               </PageButton>
//               <PageButton
//                 className="rounded-r-md"
//                 onClick={() => gotoPage(pageCount - 1)}
//                 disabled={!canNextPage}
//               >
//                 <span className="sr-only">Last</span>
//                 <MdOutlineKeyboardDoubleArrowRight
//                   className="h-5 w-5 text-gray-400"
//                   aria-hidden="true"
//                 />
//               </PageButton>
//             </nav>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Table;

import React from "react";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  usePagination,
} from "react-table";
import { Button, PageButton } from "./buttons";
import { SortIcon, SortUpIcon, SortDownIcon, Eyeicon } from "./icons";
import Image from "next/image";
import {
  MdOutlineKeyboardDoubleArrowLeft,
  MdKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);

  const onChange = (value) => {
    setGlobalFilter(value || undefined);
  };

  return (
    <label className="w-full flex justify-end items-center gap-x-2 md:items-baseline md:px-0 py-5">
    </label>
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id, render },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <label className="flex gap-x-2 items-baseline">
      <span className="text-gray-700">{render("Header")}: </span>
      <select
        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        name={id}
        id={id}
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <option value="">All</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusPill({ value }) {
  const status = value ? value.toLowerCase() : "unknown";
  return <span className="text-white text-sm">{status}</span>;
}

export function indexID({ row }) {
  return (
    <div className="text-center">
      <p>{parseInt(row.id) + 1}</p>
    </div>
  );
}

export function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="ml-4">
        <div className="text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function Table({ columns, data, refs, disablePagination = false, showPagination = true }) {
  // Use the state and functions returned from useTable to build your UI
  const tableInstance = useTable(
    {
      columns,
      data,
      // Disable pagination if disablePagination is true
      ...(disablePagination && { 
        initialState: { pageSize: data.length || 10 },
        manualPagination: true,
        pageCount: 1
      })
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    rows, // Use rows instead of page when pagination is disabled
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = tableInstance;

  // Use all rows when pagination is disabled, otherwise use page
  const tableData = disablePagination ? rows : page;

  return (
    <>
      <div className="sm:flex sm:gap-x-2">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) =>
            column.Filter ? (
              <div className="mt-2 sm:mt-0" key={column.id}>
                {column.render("Filter")}
              </div>
            ) : null
          )
        )}
      </div>
      
      {/* table */}
      <div className="flex flex-col rounded-xl border-[#B9B9B9] border-[1px]">
        <div className="-my-2 overflow-x-auto ">
          <div className="py-2 align-middle inline-block min-w-full ">
            <div className="shadow overflow-hidden  sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full rounded-xl"
                ref={refs}
              >
                <thead className="bg-transparent  border-b-[1px] border-[#B9B9B9] rounded-xl pb-1">
                  {headerGroups.map((headerGroup, index) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                      {headerGroup.headers.map((column, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="group pl-2 py-3  text-md font-medium text-black text-left tracking-wider"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div className="flex items-center justify-center">
                            {column.render("Header")}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="bg-white divide-y divide-[#B9B9B9] "
                >
                  {tableData.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={i}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              key={index}
                              {...cell.getCellProps()}
                              className="pl-2 py-4 whitespace-nowrap text-white text-left"
                              role="cell"
                            >
                              {
                                cell.column.Cell.name === "defaultRenderer" ? (
                                  <div className="text-sm text-black ">
                                    {cell.render("Cell")}
                                  </div>
                                ) : (
                                  <div className="text-sm text-black ">
                                    {cell.render("Cell")}
                                  </div>
                                )
                              }
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pagination - Only show if showPagination is true and pagination is not disabled */}
      {showPagination && !disablePagination && (
        <div className="py-3 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </Button>
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div className="flex gap-x-2 items-baseline">
              <span className="text-sm text-black">
                Page <span className="font-medium">{state.pageIndex + 1}</span> of{" "}
                <span className="font-medium">{pageOptions.length}</span>
              </span>
              <label>
                <span className="sr-only">Items Per Page</span>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  value={state.pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[5, 10, 20].map((pageSize) => (
                    <option
                      key={pageSize}
                      value={pageSize}
                      className="text-custom-orange"
                    >
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <PageButton
                  className="rounded-l-md"
                  onClick={() => gotoPage(0)}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">First</span>
                  <MdOutlineKeyboardDoubleArrowLeft
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <span className="sr-only">Previous</span>
                  <MdKeyboardArrowLeft
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton onClick={() => nextPage()} disabled={!canNextPage}>
                  <span className="sr-only">Next</span>
                  <MdOutlineKeyboardArrowRight
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
                <PageButton
                  className="rounded-r-md"
                  onClick={() => gotoPage(pageCount - 1)}
                  disabled={!canNextPage}
                >
                  <span className="sr-only">Last</span>
                  <MdOutlineKeyboardDoubleArrowRight
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </PageButton>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Table;