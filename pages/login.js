import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { MdArrowForward, MdEmail, MdPassword } from "react-icons/md";
import { useContext, useState } from "react";
import { Api } from "@/services/service";
import { useRouter } from "next/router";
import { userContext } from "./_app";
import Swal from "sweetalert2";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [otp, setotp] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    console.log(userDetail);
    if (userDetail.username && userDetail.password) {
      props.loader(true);
      Api("post", "login", { ...userDetail }, router).then(
        (res) => {
          props.loader(false)
          console.log("res================>", res);
          if (res?.status) {
            if (res.data.type === "ADMIN" || res.data.type === "SELLER") {
              console.log("res================>", res);
              if (res.data.type === "SELLER" && (!res.data.store || (res.data.store && res.data.store.verification !== "Verified"))) {
                Swal.fire({
                  text: "Your account hasn't been verified. Please wait by 2-7 working days. Thanks.",
                  icon: "warning",
                  showCancelButton: false,
                  confirmButtonText: "OK"
                })
                return
              }
              localStorage.setItem("userDetail", JSON.stringify(res.data));
              setUser(res.data);
              setUserDetail({
                username: "",
                password: "",
              });
              localStorage.setItem("token", res.data.token);
              props.toaster({ type: "success", message: "Login Successful" });
              router.push("/");
            } else {
              props.toaster({ type: "error", message: "You are not an Admin" });
            }
          }
        },
        (err) => {
          props.loader(false);
          console.log(err);
          props.toaster({ type: "error", message: err?.message });
        }
      );
    } else {
      props.toaster({ type: "error", message: "Missing credentials" });
    }
  };

  return (
    <div className="flex min-h-screen bg-custom-lightGray justify-center items-center ">
      <div className="border-2 rounded-3xl border-custom-red bg-custom-creame md:p-10 p-5 sm:w-1.5 md:w-1/3  ">
        <p className="text-black text-center md:text-4xl text-2xl font-semibold mb-10">
          Welcome
        </p>
        <div className="flex bg-white py-2 mt-4 rounded-md border  border-custom-gray md:h-14 sm:h-10 w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5 justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <MdEmail className="text-xl text-custom-gray" />
            </div>
          </div>
          <input
            placeholder="Username"
            className="bg-white outline-none pl-2 text-black text-xs md:text-base border-l-2 border-custom-gray md:h-10 h-5"
            value={userDetail.username}
            autoComplete="false"
            onChange={(text) => {
              setUserDetail({ ...userDetail, username: text.target.value });
            }}
          />
        </div>
        {submitted && userDetail.email === "" && (
          <p className="text-red-700 mt-1">Username is required</p>
        )}
        {/* {submitted &&
          !checkEmail(userDetail.email) &&
          userDetail.email !== "" && (
            <p className="text-red-700 mt-1">Email is invalid</p>
          )} */}
        <div className="flex bg-white py-2 mt-4 rounded-md  border  border-custom-gray md:h-14 sm:h-10 min-w-full relative items-center w-64 md:min-w-full ">
          <div className="flex md:mx-4 mx-2.5  justify-center md:h-10 sm:h-8 items-center ">
            <div className="md:w-5 md:h-5 w-4 h-4 relative">
              <MdPassword className="text-xl text-custom-gray" />
            </div>
          </div>
          <input
            placeholder="Password"
            // type={showPass ? "text" : "password"}
            type="text"
            className="bg-white outline-none pl-2 text-black text-xs md:text-base border-l-2 border-custom-gray md:h-10 h-5"
            value={userDetail.password}
            autoComplete="new-password"
            onChange={(text) => {
              setUserDetail({ ...userDetail, password: text.target.value });
            }}
          />
          {/* <div
            className="absolute right-3 "
            onClick={() => setShowPass(!showPass)}
          >
            <div className="md:w-5 md:h-3.5 w-3.5 h-2.5 relative">
              {showPass ? (
                <AiFillEye className="text-xl text-custom-orange" />
              ) : (
                <AiFillEyeInvisible className="text-xl text-custom-orange" />
              )}
            </div>
          </div> */}
        </div>
        {submitted && userDetail.password === "" && (
          <p className="text-red-700 mt-1">Password is required</p>
        )}


        <div className=" mt-10 grid grid-cols-2 gap-8">
          <div className="items-start">
            <p className="text-black text-left md:text-4xl text-2xl font-semibold ">
              Sign in
            </p>
          </div>
          <div className="flex justify-end"

            onClick={submit}
          >
            <div className="md:w-10 md:h-10 w-8 h-8 relative bg-custom-gray rounded-full flex justify-center items-center">
              <MdArrowForward className="text-white w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
