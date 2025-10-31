import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import { userContext } from "./_app";
import { Api } from "@/services/service";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({
    username: "",
    password: "",
  });
  const [user, setUser] = useContext(userContext);

 const submit = async () => {
  setSubmitted(true);

  if (userDetail.username && userDetail.password) {
    props.loader(true);
    setLoading(true);

    try {
      const res = await Api("post", "login", { ...userDetail }, router);
      props.loader(false);
      setLoading(false);

      if (res?.status) {
        const user = res.data;

        if (user.type === "ADMIN" || user.type === "VENDOR") {
          
          if (user.type === "VENDOR" && user.verified !== "VERIFIED") {
            Swal.fire({
              text: "Your account hasn't been verified yet. Please wait 2–7 working days. Thanks.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            return;
          }

          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", user.token);
          setUser(user);
          setUserDetail({ username: "", password: "" });

          props.toaster({ type: "success", message: "Login Successful" });
          router.push("/");

        } else {
          props.toaster({
            type: "error",
            message: "You are not authorized to access this portal.",
          });
        }
      }

    } catch (err) {
      props.loader(false);
      setLoading(false);
      props.toaster({ type: "error", message: err?.message || "Login failed." });
    }

  } else {
    props.toaster({ type: "error", message: "Missing credentials" });
  }
};

return (
  <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 flex items-center justify-center p-4 relative overflow-hidden">
    {/* background pattern */}
    <div className="absolute inset-0 bg-black/10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>
    </div>

    <div className="relative w-full max-w-md">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-yellow-600 py-3 rounded-3xl flex items-center justify-center mb-4 space-x-2">
            <img src="/Logo.png" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600 text-sm">Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${submitted && !userDetail.username
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                  }`}
                value={userDetail.username}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, username: e.target.value })
                }
              />
            </div>
            {submitted && !userDetail.username && (
              <p className="text-red-500 text-xs font-medium">Username is required</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 border rounded-xl text-neutral-700 focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none transition-all duration-200 ${submitted && !userDetail.password
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                  }`}
                value={userDetail.password}
                onChange={(e) =>
                  setUserDetail({ ...userDetail, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {submitted && !userDetail.password && (
              <p className="text-red-500 text-xs font-medium">Password is required</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-yellow-300 disabled:opacity-70 shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                Sign In <ArrowRight className="ml-2 h-5 w-5" />
              </div>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2025 BOADMAS. All rights reserved.
          </p>
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute -top-14 -left-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-md opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-8 -right-10 w-32 h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-md opacity-20 animate-pulse"></div>
    </div>
  </div>
);
}
