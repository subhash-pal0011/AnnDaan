"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import axios from "axios";

const Page = () => {

       const [active, setActive] = useState("active");
       const [donations, setDonations] = useState([]);


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
       return (
              <div className="w-full min-h-screen bg-gray-100">

                     {/* ================= NAVBAR ================= */}
                     <div className="p-2">
                            <motion.nav className="bg-white shadow-md rounded-lg px-4 py-3 flex flex-wrap justify-between items-center">

                                   <img src="/ann_daan_logo.png" className="h-8 sm:h-10" />

                                   <div className="flex gap-4 sm:gap-6 items-center text-gray-700 font-medium mt-2 sm:mt-0">
                                          <Link href="/" className="text-sm sm:text-base hover:text-gray-400 transition font-semibold">
                                                 Home
                                          </Link>

                                          <Link href="/donateForm" className="text-sm sm:text-base hover:text-gray-400 transition font-semibold">
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
                                          <h1 className="text-xl md:text-3xl font-bold flex items-center gap-2">
                                                 Welcome, Subhash
                                                 <img src="/hello.gif" className="w-6 md:w-8" />
                                          </h1>

                                          <p className="text-sm md:text-lg text-gray-200 mt-2">
                                                 Track your donations and help more people
                                          </p>
                                   </motion.div>
                            </div>
                     </div>


                     <div className="md:px-3 px-2">
                            <div className="bg-white/40 backdrop-blur-md shadow-lg rounded-xl md:px-5 px-2">

                                   <div className="py-5 text-center space-x-5">

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
                                          {donations?.map((item) => (
                                                 < motion.div
                                                        key={item?._id}
                                                        whileHover={{ scale: 1.03 }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-white md:px-8 px-1 p-4 rounded shadow-md hover:shadow-xl transition space-y-2"
                                                 >
                                                        {/* Food */}
                                                        <div className="flex items-center md:gap-1.5 flex-wrap">
                                                               <img src="/food-1.gif" className="h-10" />
                                                               <p className="text-2xl font-bold text-gray-700 mt-3">{item.food}</p>
                                                               <p className="text-xs mt-3 text-gray-700">
                                                                      {new Date(item.createdAt).toLocaleString()}
                                                               </p>
                                                        </div>

                                                        {/* Info */}
                                                        <div className="space-y-1.5 mt-2">
                                                               {/* Left Side */}
                                                               <div className="text-sm text-gray-500 space-y-1">
                                                                      <p>{item.address}</p>

                                                                      <div className="flex gap-1">
                                                                             <span>Prepared Time:</span>
                                                                             <span>{item.time}</span>
                                                                      </div>
                                                               </div>

                                                               {/* Right Side */}
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
                                                               {item.status !== "completed" && (
                                                                      <button className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer flex">
                                                                             <img src="/deleteIcon.gif" className="h-6 items-center text-center" />
                                                                             Delete
                                                                      </button>
                                                               )}
                                                        </div>

                                                        {item.acceptedBy && (
                                                               <div className="mt-3 bg-linear-to-r from-blue-50 to-blue-100  rounded p-3 shadow-sm hover:shadow-md transition-all duration-300">

                                                                      {/* Header */}
                                                                      <div className="flex items-center gap-2 mb-2">
                                                                             <img src="/connect.png" className="h-6" />
                                                                             <p className="text-xs font-semibold text-blue-700">
                                                                                    NGO Assigned
                                                                             </p>
                                                                      </div>

                                                                      {/* NGO Details */}
                                                                      <div className="space-y-1 text-sm text-gray-700">
                                                                             <p className="flex items-center gap-2">
                                                                                    👤 <span className="font-medium">{item.acceptedBy?.name}</span>
                                                                             </p>
                                                                             <div className="flex justify-between">
                                                                                    <p className="flex items-center gap-2">
                                                                                           📞 <span>{item.acceptedBy?.phone}</span>
                                                                                    </p>

                                                                                    <a
                                                                                           href={`tel:${item.acceptedBy?.phone}`}
                                                                                           className="flex items-center text-white justify-center gap-2  mt-3 px-4 py-2 rounded-xl  bg-linear-to-r from-green-500 to-emerald-600 text-sm font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200"
                                                                                    >
                                                                                           📞 Call NGO
                                                                                    </a>
                                                                             </div>

                                                                      </div>

                                                                      {/* Status Line */}
                                                                      <div className="mt-2 text-[11px] text-green-600 font-medium">
                                                                             ✅ NGO will pick up your food soon
                                                                      </div>
                                                               </div>
                                                        )}
                                                 </motion.div>
                                          ))}
                                   </div>
                            </div>
                     </div>
              </div >
       );
};
export default Page;