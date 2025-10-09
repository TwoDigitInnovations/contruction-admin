import React, { useState, useRef, useEffect } from 'react'
import { MdOutlineFileUpload } from "react-icons/md";
import { useRouter } from "next/router";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Api, ApiFormData } from '@/services/service';
import isAuth from '@/components/isAuth';

function Settings(props) {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const f = useRef(null);
    const [carouselImg, setCarouselImg] = useState([]);
    const [singleImg, setSingleImg] = useState('');
    const [settingsId, setSettingsId] = useState('');
    const [singleUrl, setSingleUrl] = useState('');

    useEffect(() => {
        getsetting()
    }, [])

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const data = new FormData()
        data.append('file', file)
        props.loader(true);
        ApiFormData("post", "/user/fileupload", data, router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res.status) {
                    setSingleImg(res.data.file)
                    props.toaster({ type: "success", message: res.data.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
        const reader = new FileReader();
    };

    const submit = (e) => {
        e.preventDefault();
        console.log(carouselImg);
        props.loader(true);
        let data = {
            carousel: carouselImg,
        };
        if (settingsId) {
            data.id = settingsId
        }
        console.log(data);
        props.loader(true);
        Api("post", `${settingsId ? `updatesetting` : `createsetting`}`, data, router).then(
            (res) => {
                console.log("res================>", res);
                props.loader(false);

                if (res?.success) {

                    setSubmitted(false);
                    props.toaster({ type: "success", message: res?.message });
                } else {
                    props.loader(false);
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

    const getsetting = async () => {
        props.loader(true);
        Api("get", 'getsetting', '', router).then(
            (res) => {
                props.loader(false);
                console.log("res================>", res);
                if (res?.success) {
                    if (res?.setting.length > 0) {
                        setSettingsId(res?.setting[0]._id)
                        setCarouselImg(res?.setting[0].carousel)
                    }
                    // setCarouselImg(res?.setting)
                    // props.toaster({ type: "success", message: res?.message });
                } else {
                    props.loader(false);
                    console.log(res?.data?.message);
                    props.toaster({ type: "error", message: res?.data?.message });
                }
            },
            (err) => {
                props.loader(false);
                console.log(err);
                props.toaster({ type: "error", message: err?.message });
            }
        );
    }

    const closeIcon = (item) => {
        const d = carouselImg.filter((f) => f !== item);
        setCarouselImg(d)
    }

    return (
        <>
            {/* <section className=" w-full h-full  bg-transparent !p-4 !md:p-5 -mt-[55px]">
            <div className='md:pt-[55px] pt-[35px] h-full'>
                <h1 className="text-2xl md:text-3xl font-semibold text-custom-orange uppercase  md:mt-2 mt-5 md:mb-10 mb-5 text-white">
                    Carousel
                </h1>

                <div className='h-full bg-white rounded-[15px] p-5 overflow-scroll no-scrollbar'>
                    <form className="w-full" onSubmit={submit}>
                        <div className="relative w-full">
                            <div className="w-full">
                                <p className="text-custom-gray text-lg font-semibold">Carousel Images</p>
                                <div className="border rounded-md p-2 w-full bg-custom-light flex justify-start items-center">
                                    <input
                                        className="outline-none bg-custom-light md:w-[90%] w-[85%]"
                                        type="text"
                                        placeholder="Carousel Images"
                                        value={singleImg}
                                        onChange={(text) => {
                                            setSingleImg(text.target.value)
                                        }}
                                    // required
                                    />
                                </div>
                                {submitted && carouselImg.carousel_image === "" && (
                                    <p className="text-red-700 mt-1">Carousel Images is required</p>
                                )}
                            </div>

                            <div className="absolute top-[32px] md:right-[10px]  right-[10px]">
                                <MdOutlineFileUpload className="text-black h-8 w-8"
                                    onClick={() => {
                                        f.current.click();
                                    }} />
                                <input type="file"
                                    ref={f}
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end items-end mt-5'>
                            <p className="text-white bg-custom-gray rounded-[10px] text-center  text-md py-2 w-36 cursor-pointer" onClick={() => {
                                if (singleImg === "") {
                                    props.toaster({ type: "error", message: "Carousel Images is required" });
                                    return
                                }
                                setCarouselImg([...carouselImg, singleImg]); setSingleImg('');
                            }}>Add</p>
                        </div>
                        <div className='flex md:flex-row flex-wrap md:gap-5 gap-4 mt-5'>
                            {carouselImg?.map((item, i) => (<div className='relative' key={i}>
                                <img className='md:w-20 w-[85px] h-20 object-contain' src={item} />
                                <IoCloseCircleOutline className='text-red-700 cursor-pointer h-3 w-3 absolute left-[5px] top-[10px]' onClick={() => { closeIcon(item) }} />
                            </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 gap-5">
                            <button type="submit" className="text-white bg-custom-gray rounded-[10px]  text-md py-21 w-36 h-10">Submit</button>
                        </div>
                    </form>
                </div>

            </div>
        </section> */}

            <section className=" w-full h-full bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
                <p className="text-custom-black font-bold  md:text-[32px] text-2xl md:pb-0 pb-3">Carousel</p>

                <section className='px-5 pt-5 pb-5 bg-white h-full rounded-[12px] overflow-scroll md:mt-9 mt-5'>
                    <form className="w-full" onSubmit={submit}>
                        <div className="relative w-full">
                            <div className="w-full">
                                <p className="text-custom-gray text-lg font-semibold">Carousel Images</p>
                                <div className="border rounded-md p-2 w-full bg-custom-light flex justify-start items-center">
                                    <input
                                        className="outline-none bg-custom-light md:w-[90%] w-[85%]"
                                        type="text"
                                        placeholder="Carousel Images"
                                        value={singleImg}
                                        onChange={(text) => {
                                            setSingleImg(text.target.value)
                                        }}
                                    // required
                                    />
                                </div>
                                {submitted && carouselImg.carousel_image === "" && (
                                    <p className="text-red-700 mt-1">Carousel Images is required</p>
                                )}
                            </div>

                            <div className="absolute top-[32px] md:right-[10px]  right-[10px]">
                                <MdOutlineFileUpload className="text-black h-8 w-8"
                                    onClick={() => {
                                        f.current.click();
                                    }} />
                                <input type="file"
                                    ref={f}
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>

                        <div className='flex justify-end items-end mt-5'>
                            <p className="text-white bg-yellow-600 rounded-[10px] text-center  text-md py-2 w-36 cursor-pointer" onClick={() => {
                                if (singleImg === "") {
                                    props.toaster({ type: "error", message: "Carousel Images is required" });
                                    return
                                }
                                setCarouselImg([...carouselImg, singleImg]); setSingleImg('');
                            }}>Add</p>
                        </div>
                        <div className='flex md:flex-row flex-wrap md:gap-5 gap-4 mt-5'>
                            {carouselImg?.map((item, i) => (<div className='relative' key={i}>
                                <img className='md:w-20 w-[85px] h-20 object-contain' src={item} />
                                <IoCloseCircleOutline className='text-red-700 cursor-pointer h-3 w-3 absolute left-[5px] top-[10px]' onClick={() => { closeIcon(item) }} />
                            </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-4 gap-5">
                            <button type="submit" className="text-white bg-yellow-600 rounded-[10px]  text-md py-21 w-36 h-10">Submit</button>
                        </div>
                    </form>
                </section>
            </section>
        </>
    )
}

export default isAuth(Settings)
