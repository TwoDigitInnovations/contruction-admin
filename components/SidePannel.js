
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext } from 'react'
import { AiOutlineBulb } from 'react-icons/ai'
import { MdDashboard } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { FaSackDollar } from 'react-icons/fa6'
import { MdSupportAgent, MdContentPaste } from 'react-icons/md'
import { VscFeedback } from 'react-icons/vsc'
import { ImCross } from 'react-icons/im'
import { userContext } from '@/pages/_app'
import { BiSolidCategory, BiUser } from "react-icons/bi";
import { MdSubscriptions, MdPayments, MdOutlineTouchApp, MdCleaningServices } from "react-icons/md";
import { IoSettings } from "react-icons/io5";
import { FaRegUserCircle } from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { FaChevronDown } from "react-icons/fa";
import { IoIosContact } from 'react-icons/io'
import { FaCircleQuestion } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { FaUserTie } from "react-icons/fa";

const SidePannel = ({ setOpenTab, openTab }) => {
    const [user, setUser] = useContext(userContext)
    const router = useRouter();

    const logOutHandler = () => {
        localStorage.removeItem("PBuser")
        localStorage.removeItem("token")
        setUser({})
        router.push('/login')
    }

    const menuItems = [
        {
            href: "/",
            title: "Dashbord",
            img: <MdDashboard className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/add-product",
            title: "Add Product",
            img: <AiFillProduct className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/users",
            title: "Users",
            img: <BiUser className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },

        // {
        //     href: "/products",
        //     title: "Products",
        //     img: <AiFillProduct className='text-3xl' />,
        //     access: ["ADMIN", "SELLER"],
        // },
        {
            href: "/queries",
            title: "Queries",
            img: <FaCircleQuestion className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/driver",
            title: "Driver",
            img: <FaShoppingBag className='text-3xl' />,
            access: ["ADMIN", "SELLER"],
        },
        {
            href: "/vendor",
            title: "Vendor",
            img: <FaUserTie className='text-3xl' />,
            access: ["ADMIN",],
        },
        {
            href: "/categories",
            title: "Categories",
            img: <BiSolidCategory className='text-3xl' />,
            access: ["ADMIN"],
        },
        {
            href: "/settings",
            title: "Settings",
            img: <IoSettings className='text-3xl' />,
            access: ["ADMIN"],
        },
    ];


    return (
        <>
            <div className=' fixed top-0 left-0 z-20  md:w-[300px]  hidden sm:grid grid-rows-5  overflow-hidden'>
                <div className=''>
                    <div className='bg-custom-black py-5  overflow-y-scroll h-screen  scrollbar-hide'>

                        <div className=' pb-7 row-span-1 w-full flex items-center justify-center cursor-pointer' onClick={(() => router.push('/'))}>
                            <img src="/Logo.png" alt="" className='w-[182px] h-full' />
                            {/* <p className='text-center mt-10 text-3xl md:text-4xl lg:text-5xl font-semibold'>Logo</p> */}
                        </div>

                        <div className='flex flex-col justify-between row-span-4  w-full'>
                            <ul className='w-full flex flex-col text-left mt-4 '>
                                {menuItems.map((item, i) => (<Link href={item.href} className={`${item?.access?.includes(user?.type) ? 'flex' : 'hidden'}  items-center mx-10 cursor-pointer group m-1 hover:bg-yellow-600  ${router.pathname === item.href ? 'bg-yellow-600 text-white rounded-[8px]' : 'text-custom-blue'}`}>
                                    <div className='ps-6 py-3  text-white font-semibold flex items-center gap-4'>
                                        <div className='w-6'>
                                            {item?.img}
                                        </div>
                                        {item?.title}
                                    </div>
                                </Link>))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`w-full absolute top-0 left-0 z-40 sm:hidden flex flex-col h-screen max-h-screen overflow-hidden bg-yellow-600 ${openTab ? 'scale-x-100' : 'scale-x-0'} transition-all duration-300 origin-left`}>
                <div className=' row-span-1  w-full text-white  relative '>
                    <ImCross className='absolute top-4 right-4 z-40 text-2xl text-black' onClick={() => setOpenTab(!openTab)} />
                    <div className='flex items-center gap-3 w-full  p-3'>
                        <div className='p-1 rounded overflow-hidden' >

                            <img src="/Logo.png" alt="" className='w-[182px] h-[44px] object-contain' />
                         
                        </div>
                        <div className='flex flex-col text-left justify-center'>
                           
                            <p className='-mt-2 text-sm'>{user?.fullName}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col justify-center items-start row-span-2 h-full  w-full'>
                   
                    <ul className='w-full h-full flex flex-col text-left justify-start items-center border-t-2 border-white'>
                        {menuItems.map((item, i) => (<li key={i} className={`${item?.access?.includes(user?.type) ? 'flex' : 'hidden'} w-full items-center text-white cursor-pointer group hover:bg-custom-lightGray hover:text-custom-blue  border-b-2 border-white`}>
                            <div className=' py-2 pl-6 font-semibold flex items-center gap-4  ' onClick={() => setOpenTab(!openTab)}>
                                <div className='w-6'>
                                    {item?.img}
                                </div>
                                <Link href={item.href} >{item?.title}</Link>
                            </div>
                        </li>))}

                       
                    </ul>
                </div>

            </div>

        </>
    )
}

export default SidePannel