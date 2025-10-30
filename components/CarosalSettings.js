import React, { useState, useRef, useEffect } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Api, ApiFormData } from '@/services/service';

export default function CarosalSettings({ toaster, loader }) {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const f = useRef(null);
    const [carouselImg, setCarouselImg] = useState([]);
    const [singleImg, setSingleImg] = useState('');
    const [settingsId, setSettingsId] = useState('');

    useEffect(() => {
        getsetting();
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);
        loader(true);
        ApiFormData("post", "/user/fileupload", data, router)
            .then((res) => {
                loader(false);
                if (res.status) {
                    setSingleImg(res.data.file);
                    toaster({ type: "success", message: res.data.message });
                }
            })
            .catch((err) => {
                loader(false);
                toaster({ type: "error", message: err?.message });
            });
    };

    const submit = (e) => {
        e.preventDefault();
        loader(true);
        let data = { carousel: carouselImg };
        if (settingsId) data.id = settingsId;

        Api("post", `${settingsId ? `updatesetting` : `createsetting`}`, data, router)
            .then((res) => {
                loader(false);
                if (res?.success) {
                    setSubmitted(false);
                    toaster({ type: "success", message: res?.message });
                } else {
                    toaster({ type: "error", message: res?.data?.message });
                }
            })
            .catch((err) => {
                loader(false);
                toaster({ type: "error", message: err?.message });
            });
    };

    const getsetting = async () => {
        loader(true);
        Api("get", 'getsetting', '', router)
            .then((res) => {
                loader(false);
                if (res?.success && res?.setting?.length > 0) {
                    setSettingsId(res?.setting[0]._id);
                    setCarouselImg(res?.setting[0].carousel);
                }
            })
            .catch((err) => {
                loader(false);
                toaster({ type: "error", message: err?.message });
            });
    };

    const closeIcon = (item) => {
        const updated = carouselImg.filter((f) => f !== item);
        setCarouselImg(updated);
    };

    return (

        <div className="bg-white shadow-xl shadow-gray-200 rounded-2xl p-2 md:p-4 transition-all duration-300 hover:shadow-2xl">
            <form className="space-y-6" onSubmit={submit}>
                {/* Upload Section */}
                <div className="relative">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                        Carousel Image URL
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50 focus-within:ring-2 focus-within:ring-yellow-500 transition-all">
                        <input
                            className="flex-1 bg-transparent py-2.5 px-4 text-sm text-gray-800 outline-none"
                            type="text"
                            placeholder="Paste image URL or upload"
                            value={singleImg}
                            onChange={(e) => setSingleImg(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => f.current.click()}
                            className="p-2 text-yellow-600 hover:text-yellow-700 transition-all"
                        >
                            <MdOutlineFileUpload className="text-2xl" />
                        </button>
                        <input
                            type="file"
                            ref={f}
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                {/* Add Image Button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (singleImg === "") {
                                props.toaster({ type: "error", message: "Carousel Image is required" });
                                return;
                            }
                            setCarouselImg([...carouselImg, singleImg]);
                            setSingleImg('');
                        }}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-medium shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.03]"
                    >
                        Add Image
                    </button>
                </div>

                {/* Carousel Preview */}
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {carouselImg?.map((item, i) => (
                        <div
                            key={i}
                            className="relative group bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all"
                        >
                            <img
                                src={item}
                                alt={`carousel-${i}`}
                                className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-300"
                            />
                            <IoCloseCircleOutline
                                onClick={() => closeIcon(item)}
                                className="absolute top-2 left-2 text-red-600 text-2xl cursor-pointer bg-white rounded-full shadow-md opacity-80 hover:opacity-100 transition-all"
                            />
                        </div>
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-8">
                    <button
                        type="submit"
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.05]"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>

    );
}


