import { userContext } from "@/pages/_app";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { PiSignOutFill } from "react-icons/pi";
import Swal from "sweetalert2";

const Navbar = ({ setOpenTab, openTab }) => {
  const [user, setUser] = useContext(userContext);
  const router = useRouter();

  const logOut = () => {
    Swal.fire({
      title: "Are you sure you want to logout?",
      text: "You’ll be redirected to the login page.",
      showCancelButton: true,
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
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
        setUser({});
        localStorage.removeItem("userDetail");
        localStorage.removeItem("token");
        router.push("/login");
      }
    });
  };

  const imageOnError = (event) => {
    event.currentTarget.src = "/userprofile.png";
  };

  return (
    <nav className="w-full sticky top-0 z-20 bg-custom-black shadow-md">
      <div className="max-w-7xl mx-auto flex items-center md:justify-end justify-between px-4 py-3">
        {/* Left Logo Section (Mobile Only) */}
        <div className="md:hidden flex justify-end items-center gap-3">
          <img
            src="/Logo.png"
            alt="Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Right Section for Desktop */}
        {user?.token ? (
          <div className="hidden md:flex items-center gap-4 cursor-pointer">
            <div className="flex items-center gap-3 bg-white/20 hover:bg-white/30 transition p-2 rounded-xl">
              <img
                src={user?.profile || "/dp.png"}
                onError={imageOnError}
                alt="User"
                className="w-10 h-10 rounded-full object-cover border-2 border-white"
              />
              <div className="text-white leading-tight">
                <p className="font-semibold text-base">Construction</p>
                <p className="text-sm text-yellow-100">{user?.type}</p>
              </div>

              {/* Logout Button */}
              <button
                onClick={logOut}
                className=" text-white font-semibold px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
              >
                <PiSignOutFill size={30} />
              </button>
            </div>
          </div>
        ) : (
          <Link href="/login">
            <div className="hidden md:flex items-center bg-white text-yellow-700 px-4 py-2 rounded-xl font-semibold hover:bg-yellow-100 transition">
              Log In
            </div>
          </Link>
        )}

        {/* Mobile Menu */}
        <div className="md:hidden flex items-center gap-3">
          {user?.token && (
            <button
              onClick={logOut}
              className=" text-white font-semibold py-2 rounded-lg hover:bg-yellow-700 transition"
            >
             <PiSignOutFill size={30} />
            </button>
          )}
          <GiHamburgerMenu
            className="text-3xl text-white cursor-pointer"
            onClick={() => setOpenTab(!openTab)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
