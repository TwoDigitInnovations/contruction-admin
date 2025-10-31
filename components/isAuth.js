import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
  return function IsAuth(props) {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false); // ✅ added
    const [auth, setAuth] = useState(false);

    useEffect(() => {
      setIsMounted(true); // ✅ render only after client-side mount
      const user = localStorage.getItem("userDetail");
      const token = localStorage.getItem("token");

      if (user && token) {
        const u = JSON.parse(user);

        const adminAccess = ["/", "/queries", "/order", "/settings", "/vendor", "/users", "/driver", "/categories"];
        const vendorAccess = ["/", "/products", "/add-product", "/Sellersorder", "/profile"];

        if (u?.type === "ADMIN" && adminAccess.includes(router.pathname)) {
          setAuth(true);
        } else if (u?.type === "VENDOR" && vendorAccess.includes(router.pathname)) {
          setAuth(true);
        } else {
          setAuth(false);
          localStorage.clear();
          router.replace("/login");
        }
      } else {
        setAuth(false);
        localStorage.clear();
        router.replace("/login");
      }
    }, [router.pathname]);

    if (!isMounted) return null; // ✅ Prevent hydration mismatch

    return auth ? <Component {...props} /> : null;
  };
};

export default isAuth;
