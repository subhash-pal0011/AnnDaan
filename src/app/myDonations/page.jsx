"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {

       const [active, setActive] = useState("active");
       const router = useRouter()

       const data = [
              {
                     id: 1,
                     food: "Veg Biryani",
                     location: "Lucknow",
                     time: "5:00 PM",
                     status: "pending",
              },
              {
                     id: 2,
                     food: "Paneer Butter Masala",
                     location: "Delhi",
                     time: "2:00 PM",
                     status: "accepted",
              },
              {
                     id: 3,
                     food: "Dal & Rice",
                     location: "Kanpur",
                     time: "Yesterday",
                     status: "completed",
              },
              {
                     id: 4,
                     food: "Chapati & Sabzi",
                     location: "Noida",
                     time: "Today",
                     status: "pending",
              },
       ]


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
                            {/* Container */}
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
                                          {data.map((item) => (
                                                 <motion.div
                                                        key={item.id}
                                                        whileHover={{ scale: 1.03 }}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition space-y-4"
                                                 >
                                                        {/* Food */}
                                                        <h2 className="text-lg font-semibold text-gray-800">
                                                               🍱 {item.food}
                                                        </h2>

                                                        {/* Info */}
                                                        <div className="text-sm text-gray-500 space-y-1">
                                                               <p>📍 {item.location}</p>
                                                               <p>⏰ {item.time}</p>
                                                        </div>

                                                        {/* Footer */}
                                                        <div className="mt-4 flex justify-between items-center">

                                                               {/* Status */}
                                                               <span
                                                                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${item.status === "pending"
                                                                             ? "bg-yellow-100 text-yellow-600"
                                                                             : item.status === "accepted"
                                                                                    ? "bg-blue-100 text-blue-600"
                                                                                    : "bg-green-100 text-green-600"
                                                                             }`}
                                                               >
                                                                      {item.status}
                                                               </span>

                                                               {/* Actions */}
                                                               {item.status !== "completed" && (
                                                                      <div className="flex gap-2">
                                                                             <button className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                                                                                    Edit
                                                                             </button>
                                                                             <button className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition">
                                                                                    Delete
                                                                             </button>
                                                                      </div>
                                                               )}
                                                        </div>
                                                 </motion.div>
                                          ))}
                                   </div>
                            </div>
                     </div>
              </div>
       );
};
export default Page;