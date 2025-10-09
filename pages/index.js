import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { FaCarSide } from "react-icons/fa";
import { Api } from '@/services/service';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import isAuth from '@/components/isAuth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Home(props) {
  const router = useRouter();
  const [userList, setUserList] = useState([]);
  const [vehicalData, setvehicalData] = useState([]);
  const [offerData, setOfferData] = useState([]);
  const [labels, setLables] = useState([]);
  const [opt, setOpt] = useState({});

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'All Users',
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Total Users",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#112725",
        backgroundColor: "white",
      },
    ],
  };


  useEffect(() => {
    // getUsers()
    // getvehical();
    // getoffer()
  }, [])

  // const getUsers = async () => {
  //   props.loader(true);
  //   Api("get", "/getUsers", "", router).then(
  //     (res) => {
  //       props.loader(false);
  //       console.log("res================>", res);
  //       setUserList(res.data);

  //     },
  //     (err) => {
  //       props.loader(false);
  //       console.log(err);
  //       props.toaster({ type: "error", message: err?.message });
  //     }
  //   );
  // };

  // const getvehical = async () => {
  //   props.loader(true);
  //   Api("get", "/getallvehical", "", router).then(
  //     (res) => {
  //       props.loader(false);
  //       console.log("res================>", res);
  //       setvehicalData(res.data);
  //     },
  //     (err) => {
  //       props.loader(false);
  //       console.log(err);
  //       props.toaster({ type: "error", message: err?.message });
  //     }
  //   );
  // };

  // const getoffer = async () => {
  //   props.loader(true);
  //   Api("get", "/getalloffer", "", router).then(
  //     (res) => {
  //       props.loader(false);
  //       console.log("res================>", res);
  //       setOfferData(res.data);
  //     },
  //     (err) => {
  //       props.loader(false);
  //       console.log(err);
  //       props.toaster({ type: "error", message: err?.message });
  //     }
  //   );
  // };

  return (
    <section className=" w-full h-full  bg-transparent md:pt-5 pt-2 pb-5 pl-5 pr-5">
      <div className='md:pt-[0px] pt-[0px] h-full overflow-scroll no-scrollbar'>
        <p className=" text-custom-black mt-5 font-bold md:text-[32px] text-2xl md:pb-0 pb-3">Dashboard</p>
        <div className="md:pb-10">
          <section className="bg-transparent md:px-5 md:py-10 py-5 h-full w-full">
            <div className="grid md:grid-cols-4 grid-cols-1 w-full gap-5">

              <div className="w-full bg-white boxShadow p-5 rounded-[20px]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-custom-black text-base font-normal">Total User</p>
                    <p className="text-custom-black md:text-[28px] text-xl font-bold pt-2">40,689</p>
                  </div>
                  <img className="md:w-[60px]  w-[50px] md:h-[60px] h-[50px]" src="/totalUserImg.png" />
                </div>
                <div className="md:pt-5 pt-3 flex justify-start items-center">
                  <img className="w-[20px] h-[12px] " src="/totalUserImg-1.png" />
                  <p className="text-base font-normal text-custom-green ml-3">8.5%<span className="text-custom-black ml-2">Up from yesterday</span></p>
                </div>
              </div>

              <div className="w-full bg-white boxShadow p-5 rounded-[20px]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-custom-black text-base font-normal">Total Profit</p>
                    <p className="text-custom-black md:text-[28px] text-xl font-bold pt-2">10293</p>
                  </div>
                  <img className="md:w-[60px]  w-[50px] md:h-[60px] h-[50px]" src="/totalProfitImg.png" />
                </div>
                <div className="md:pt-5 pt-3 flex justify-start items-center">
                  <img className="w-[20px] h-[12px] " src="/totalUserImg-1.png" />
                  <p className="text-base font-normal text-custom-green ml-3">1.3%<span className="text-custom-black ml-2">Up from past week</span></p>
                </div>
              </div>

              <div className="w-full bg-white boxShadow p-5 rounded-[20px]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-custom-black text-base font-normal">Total transactions</p>
                    <p className="text-custom-black md:text-[28px] text-xl font-bold pt-2">$89,000</p>
                  </div>
                  <img className="md:w-[60px]  w-[50px] md:h-[60px] h-[50px]" src="/totalTransactionsImg.png" />
                </div>
                <div className="md:pt-5 pt-3 flex justify-start items-center">
                  <img className="w-[20px] h-[12px] " src="/totalTransactionsImg-1.png" />
                  <p className="text-base font-normal text-custom-lightRed ml-3">4.3%<span className="text-custom-black ml-2">Down from yesterday</span></p>
                </div>
              </div>

              <div className="w-full bg-white boxShadow p-5 rounded-[20px]">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col justify-start items-start">
                    <p className="text-custom-black text-base font-normal">Queries</p>
                    <p className="text-custom-black md:text-[28px] text-xl font-bold pt-2">12599</p>
                  </div>
                  <img className="md:w-[60px]  w-[50px] md:h-[60px] h-[50px]" src="/queriesImg.png" />
                </div>
              </div>

            </div>

            {/* <img className="w-full h-[444px]" src="/totalTransactionsImg-2.png" /> */}
          </section>
        </div>

      </div>
    </section>
  );
}

export default isAuth(Home)