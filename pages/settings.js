import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { Api } from "@/services/service";
import isAuth from "@/components/isAuth";
import CarosalSettings from "@/components/CarosalSettings";

function Settings(props) {
    const router = useRouter();
    const [setting, setSetting] = useState({ TaxRate: "", RatePerKM: "" });
    const [isEdit, setIsEdit] = useState(false);
    const f = useRef(null);

    useEffect(() => {
        getSettings();
    }, []);

    // 🔹 Fetch settings from backend
    const getSettings = async () => {
        props.loader(true);
        Api("get", "getSetting", "", router)
            .then((res) => {
                props.loader(false);
                if (res?.data) {
                    setSetting({
                        TaxRate: res.data?.TaxRate || "",
                        RatePerKM: res.data?.RatePerKM || "",
                    });
                    setIsEdit(true); // if data exists, editing mode
                }
            })
            .catch((err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            });
    };

    // 🔹 Save or update settings
    const saveSettings = (e) => {
        e.preventDefault();
        if (setting.TaxRate === "" || setting.RatePerKM === "") {
            return props.toaster({
                type: "error",
                message: "Please fill all fields",
            });
        }

        const data = {
            TaxRate: Number(setting.TaxRate),
            RatePerKM: Number(setting.RatePerKM),
        };

        props.loader(true);
        Api("post", "saveSetting", data, router)
            .then((res) => {
                props.loader(false);
                if (res?.status) {
                    props.toaster({
                        type: "success",
                        message: res?.message || "Settings saved successfully",
                    });
                    setIsEdit(true);
                    getSettings();
                } else {
                    props.toaster({
                        type: "error",
                        message: res?.message || "Something went wrong",
                    });
                }
            })
            .catch((err) => {
                props.loader(false);
                props.toaster({ type: "error", message: err?.message });
            });
    };

    return (
        <section className="w-full h-full bg-gray-50 py-8 px-6 md:px-6">
            <div className="overflow-y-scroll h-screen scrollbar-hide pb-56">
                <p className="text-gray-800 font-bold text-3xl md:text-[32px] ">
                    Website Settings
                </p>

                {/* <CarosalSettings loader={props.loader} toaster={props.toaster} /> */}

                <form
                    ref={f}
                    onSubmit={saveSettings}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-8"
                >
                    <div className="mb-5">
                        <label className="text-gray-600 font-semibold block pb-2">
                            Tax Rate (%)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter tax rate (e.g. 18)"
                            value={setting.TaxRate}
                            onChange={(e) =>
                                setSetting({ ...setting, TaxRate: e.target.value })
                            }
                            className="bg-gray-50 border border-gray-300 outline-none h-[45px] w-full rounded-lg px-4 text-sm font-medium text-black focus:ring-2 focus:ring-yellow-600"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="text-gray-600 font-semibold block pb-2">
                            Rate per KM (₹)
                        </label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Enter rate per KM"
                            value={setting.RatePerKM}
                            onChange={(e) =>
                                setSetting({ ...setting, RatePerKM: e.target.value })
                            }
                            className="bg-gray-50 border border-gray-300 outline-none h-[45px] w-full rounded-lg px-4 text-sm font-medium text-black focus:ring-2 focus:ring-yellow-600"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white font-semibold shadow-md  transition-all"
                    >
                        {isEdit ? "Update Settings" : "Save Settings"}
                    </button>
                </form>
            </div>
        </section>
    );
}

export default isAuth(Settings);
