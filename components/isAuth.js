
import { useEffect } from "react";
import { useRouter } from "next/router";

const isAuth = (Component) => {
    return function IsAuth(props) {
        const router = useRouter();
        console.log(router)
        let auth = false;
        let user
        if (typeof window !== "undefined") {
            user = localStorage.getItem("userDetail");
        }
        if (user) {
            const u = JSON.parse(user)
            const token = localStorage.getItem("token");
            if (router?.pathname === '/' || router?.pathname === '/products' || router?.pathname === '/add-product' || router?.pathname === '/queries' || router?.pathname === '/orders') {
                auth = token && (u?.type === 'ADMIN' || u?.type === 'SELLER') ? true : false
            } else {
                auth = token && u?.type === 'ADMIN' ? true : false
            }
        }
        useEffect(() => {
            if (!auth) {
                localStorage.clear();
                router.replace('/login')
            }
        }, []);

        // if (!auth) {
        //     return <div></div>;
        // }

        return <Component {...props} />;
    };
}

export default isAuth