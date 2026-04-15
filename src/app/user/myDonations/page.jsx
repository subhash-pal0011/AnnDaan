"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { socketConnection } from "@/lib/socketConnection";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const Page = () => {

       const [active, setActive] = useState("active");
       const [donations, setDonations] = useState([]);
       const { userData } = useSelector((state) => state.user)
       const router = useRouter()


       const getDonateFood = async () => {
              try {
                     const res = await axios.get("/api/user/getDonateFood");
                     if (res.data.success) {
                            console.log(res.data.data);
                            setDonations(res.data?.data)
                     }
              } catch (error) {
                     console.log("Fetch error:", error);
              }
       };

       useEffect(() => {
              getDonateFood()
       }, [])


       //REAL TIME
       useEffect(() => {
              const socket = socketConnection();

              //  ACCEPTED
              socket.on("donation-accepted", (data) => {
                     setDonations(prev =>
                            prev.map(item =>
                                   item._id === data.foodId
                                          ? {
                                                 ...item,
                                                 status: "Accepted",
                                                 acceptedBy: data.acceptedBy,
                                          }
                                          : item
                            )
                     );
              });

              // PICKED
              socket.on("donation-picked", (data) => {
                     setDonations(prev =>
                            prev.map(item =>
                                   item._id === data.foodId
                                          ? { ...item, status: "Picked" }
                                          : item
                            )
                     );
              });

              // DELIVERED (ADD THIS)
              socket.on("donation-delivered", (data) => {
                     console.log("Delivered real-time 🔥", data);

                     setDonations(prev =>
                            prev.map(item =>
                                   item._id === data.foodId
                                          ? { ...item, status: "Delivered" }
                                          : item
                            )
                     );
              });

              return () => {
                     socket.off("donation-accepted");
                     socket.off("donation-picked");
                     socket.off("donation-delivered");
              };
       }, []);

       const deleteFood = async (foodId) => {
              try {
                     const res = await axios.delete("/api/user/deleteDonate", {
                            data: { foodId },
                     });

                     if (res.data.success) {
                            setDonations((prev) =>prev.filter(item => item._id !== foodId));
                            toast.success(res.data.message)
                            
                     }

              } catch (error) {
                     console.log("Delete Error:", error);
                     toast.error(error?.response?.data?.message);
              }
       };


       const filteredDonations = donations.filter((item) => {
              if (active === "active") {
                     return item.status !== "Delivered";
              } else {
                     return item.status === "Delivered";
              }
       });

       return (
              <div className="w-full min-h-screen bg-gray-100">

                     {/*  NAVBAR */}
                     <div className="p-2">
                            <motion.nav className="bg-white shadow-md rounded-lg px-4 py-3 flex flex-wrap justify-between items-center">

                                   <img src="/ann_daan_logo.png" className="h-8 sm:h-10" />

                                   <div className="flex gap-4 sm:gap-6 items-center text-gray-700 font-medium mt-2 sm:mt-0">
                                          <Link href="/" className="text-sm sm:text-base hover:text-gray-400 transition font-semibold">
                                                 Home
                                          </Link>

                                          <Link href="/user/donateForm" className="text-sm sm:text-base hover:text-gray-400 transition font-semibold">
                                                 Donate
                                          </Link>

                                          <button onClick={() => signOut({ callbackUrl: "/register" })}
                                                 className="cursor-pointer text-sm sm:text-base text-red-500 hover:text-red-600 transition font-semibold">
                                                 Logout
                                          </button>
                                   </div>
                            </motion.nav>
                     </div>

                     {/* ================= HERO SECTION ================= */}
                     <div className="md:p-2 p-1">
                            <div className="relative">
                                   <img
                                          src="/food.jpg"
                                          className="h-60 md:h-80 w-full object-cover md:rounded-xl rounded"
                                   />
                                   <div className="absolute inset-0 bg-black/40 md:rounded-xl rounded"></div>

                                   <motion.div
                                          initial={{ opacity: 0, x: -40 }}
                                          animate={{ opacity: 1, x: 0 }}
                                          className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 text-white"
                                   >
                                          <div className="text-xl md:text-3xl font-bold flex items-center gap-2">
                                                 Welcome,

                                                 <span className="max-w-30 md:max-w-50 truncate inline-block">
                                                        {userData?.name}
                                                 </span>

                                                 <img src="/hello.gif" className="w-6 md:w-8" />
                                          </div>

                                          <p className="text-sm md:text-lg text-gray-200 mt-2">
                                                 Track your donations and help more people
                                          </p>
                                   </motion.div>
                            </div>
                     </div>


                     <div className="md:px-3 px-2">
                            <div className="bg-white/40 backdrop-blur-md shadow-lg rounded-xl md:px-5 px-2">

                                   <div className="py-5 text-center space-x-5 flex flex-wrap justify-center">

                                          <button
                                                 onClick={() => setActive("active")}
                                                 className={`font-semibold px-5 py-2 rounded-full text-sm sm:text-base transition-all duration-300 cursor-pointer
                                                 ${active === "active" ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"}`}
                                          >
                                                 Active
                                          </button>

                                          <button
                                                 onClick={() => setActive("completed")}
                                                 className={`px-5 py-2 rounded-full text-sm sm:text-base transition-all duration-300 cursor-pointer
                                                ${active === "completed" ? "bg-green-500 text-white shadow" : "text-gray-600 hover:bg-gray-100"} font-semibold`}
                                          >
                                                 Completed
                                          </button>

                                   </div>

                                   <div className="space-y-5">
                                          {filteredDonations.length > 0 ? (
                                                 filteredDonations.map((item) => (

                                                        < motion.div
                                                               key={item?._id}
                                                               whileHover={{ scale: 1.03 }}
                                                               initial={{ opacity: 0, y: 20 }}
                                                               animate={{ opacity: 1, y: 0 }}
                                                               className="bg-white md:px-8 px-1 p-4 rounded shadow-md hover:shadow-xl transition space-y-2"
                                                        >
                                                               <div className="flex items-center md:gap-1 flex-wrap">

                                                                      {item?.foodType === "veg" ? <img src="/veg-logo-logo.png" className="h-10" />
                                                                             :
                                                                             <img src="/Non-Veg-Logo.png" className="h-10" />
                                                                      }

                                                                      <p className="md:text-2xl text-xl tranca font-bold text-gray-700">{item.food}</p>
                                                                      <p className="text-xs text-gray-700">
                                                                             {new Date(item.createdAt).toLocaleString()}
                                                                      </p>
                                                               </div>

                                                               <div className="space-y-1.5 mt-2">
                                                                      <div className="text-sm text-gray-500 space-y-1">
                                                                             <p>{item.address}</p>

                                                                             <div className="flex gap-1">
                                                                                    <span>Prepared Time:</span>
                                                                                    <span>{item.time}</span>
                                                                             </div>
                                                                      </div>

                                                                      <div className="flex gap-1 text-sm text-gray-500">
                                                                             <span>Expiry Date:</span>
                                                                             <span>{item.expiry}</span>
                                                                      </div>
                                                               </div>

                                                               <div className="flex gap-1 text-sm text-gray-500">
                                                                      <p>Food Type :</p> <p>{item.foodType}</p>,
                                                                      <p>Quantity :</p> <p>{item.quantity}</p>
                                                               </div>

                                                               {/* Footer */}
                                                               <div className="mt-4 flex justify-between items-center">

                                                                      {/* Status */}
                                                                      <span
                                                                             className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${item.status === "Pending"
                                                                                    ? "bg-yellow-100 text-yellow-600"
                                                                                    : item.status === "Accepted"
                                                                                           ? "bg-blue-100 text-blue-600"
                                                                                           : item.status === "Picked"
                                                                                                  ? "bg-green-100 text-green-600"
                                                                                                  : "bg-gray-100 text-gray-600"
                                                                                    }`}
                                                                      >
                                                                             {item.status}
                                                                      </span>

                                                                      {/* Actions */}
                                                                      {!item.acceptedBy && (
                                                                             <button onClick={() => deleteFood(item._id)}
                                                                                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer flex">
                                                                                    <img src="/deleteIcon.gif" className="h-6 items-center text-center" />
                                                                                    Delete
                                                                             </button>
                                                                      )}
                                                               </div>

                                                               {item?.acceptedBy && (
                                                                      <div className="mt-3 bg-linear-to-r from-blue-50 to-blue-100 rounded p-3 shadow-sm hover:shadow-md transition-all duration-300">

                                                                             <div className="flex items-center gap-2 mb-2">
                                                                                    <img src="/connect.png" className="h-6" />
                                                                                    <p className="text-xs font-semibold text-blue-700">
                                                                                           NGO Assigned
                                                                                    </p>
                                                                             </div>

                                                                             <div className="space-y-1 text-sm text-gray-700">
                                                                                    <p className="flex items-center gap-2">
                                                                                           👤 <span className="font-medium">{item.acceptedBy?.name}</span>
                                                                                    </p>

                                                                                    <div className="flex flex-wrap justify-between gap-2">
                                                                                           <p className="flex items-center gap-2">
                                                                                                  📞 <span>{item.acceptedBy?.phone}</span>
                                                                                           </p>

                                                                                           {/* ❌ Buttons hide only when Delivered */}
                                                                                           {item.status !== "Delivered" && (
                                                                                                  <div className="flex flex-wrap gap-2 mt-3">

                                                                                                         <a
                                                                                                                href={`tel:${item.acceptedBy?.phone}`}
                                                                                                                className="flex items-center text-white justify-center gap-2 px-4 py-2 rounded-xl bg-green-500 text-sm font-semibold shadow-md"
                                                                                                         >
                                                                                                                📞 Call
                                                                                                         </a>

                                                                                                         <button
                                                                                                                onClick={() => router.push(`/user/trackeOrder/${item?._id}/`)}
                                                                                                                className="flex items-center text-white justify-center gap-2 px-4 py-2 text-sm cursor-pointer rounded-xl bg-blue-500 font-semibold shadow-md"
                                                                                                         >
                                                                                                                <img src="/location.gif" className="h-5" /> Track
                                                                                                         </button>

                                                                                                  </div>
                                                                                           )}
                                                                                    </div>
                                                                             </div>

                                                                             {/* ✅ Status Message (NOW WILL WORK) */}
                                                                             <div className="mt-2 text-[11px] font-medium">

                                                                                    {item.status === "Accepted" && (
                                                                                           <p className="text-green-600">
                                                                                                  ✅ NGO will pick up your food soon
                                                                                           </p>
                                                                                    )}

                                                                                    {item.status === "Picked" && (
                                                                                           <p className="text-blue-600">
                                                                                                  🚚 NGO has picked up your food and is on the way
                                                                                           </p>
                                                                                    )}

                                                                                    {item.status === "Delivered" && (
                                                                                           <p className="text-purple-600">
                                                                                                  Your donation has reached someone who needed it most. Thank you ❤️
                                                                                           </p>
                                                                                    )}

                                                                             </div>
                                                                      </div>
                                                               )}
                                                        </motion.div>
                                                 ))
                                          ) : (
                                                 <div className="text-center text-gray-500 py-10">
                                                        {active === "active"
                                                               ? "No active donations 🚫"
                                                               : "No completed donations yet 🎉"}
                                                 </div>
                                          )}

                                   </div>
                            </div>
                     </div>
              </div >
       );
};
export default Page;

