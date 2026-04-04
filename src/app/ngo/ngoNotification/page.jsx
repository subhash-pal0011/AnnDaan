"use client";
import Navbar from "@/component/Navbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import axios from "axios";

const Page = () => {
       const [notifications, setNotifications] = useState([]);
       const [loading, setLoading] = useState(true);
       const router = useRouter();

       const getNotification = async () => {
              try {
                     const res = await axios.get("/api/ngo/getNotification");
                     if (res.data.success) {
                            setNotifications(res.data.data);
                            console.log("Notifications:", res.data.data);
                     }
              } catch (error) {
                     console.log("Get notification error:", error);
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => {
              getNotification();
       }, []);

       const handleAction = (id, action) => {
              const updated = notifications.map((item) =>
                     item._id === id ? { ...item, status: action } : item
              );
              setNotifications(updated);
       };

       return (
              <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-100">
                     <div className="p-2 space-y-7">
                            <Navbar />

                            <div
                                   onClick={() => router.push("/")}
                                   className="flex items-center gap-1 cursor-pointer px-5"
                            >
                                   <IoMdArrowBack size={24} className="text-gray-500 hover:text-gray-700" />
                                   <p className="font-semibold text-gray-500 hover:text-gray-700">
                                          Back
                                   </p>
                            </div>

                            {/* Header */}
                            <div className="text-center mb-8 flex flex-col items-center">
                                   <div className="md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                                          <p>NGO Notifications</p>
                                          <img src="/Notificationbell.gif" className="h-8" />
                                   </div>
                                   <p className="text-gray-500 text-sm mt-1">
                                          Nearby food donation requests
                                   </p>
                            </div>

                            {/* Loading */}
                            {loading ? (
                                   <div className="flex justify-center mt-20">
                                          <div className="w-10 h-10 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                   </div>
                            ) : notifications.length === 0 ? (
                                   /* Empty State */
                                   <div className="flex flex-col items-center justify-center mt-20 text-center">
                                          <img src="/SandyLoading.gif" className="h-28" />
                                          <h2 className="text-xl font-semibold text-gray-700">
                                                 No Notifications Yet.
                                          </h2>
                                          <p className="text-gray-500 text-sm mt-1">
                                                 You will see nearby food donation requests here.
                                          </p>

                                          <button
                                                 onClick={() => window.location.reload()}
                                                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                                          >
                                                 Refresh
                                          </button>
                                   </div>
                            ) : (
                                   /* Cards */
                                   <motion.div
                                          className="grid gap-6 max-w-lg mx-auto"
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                   >
                                          {notifications.length > 0 ? (
                                                 notifications.map((item) => (
                                                        <motion.div
                                                               key={item._id}
                                                               initial={{ opacity: 0, y: 40 }}
                                                               animate={{ opacity: 1, y: 0 }}
                                                               transition={{ duration: 0.4 }}
                                                               whileHover={{ scale: 1.02 }}
                                                               className="bg-white md:p-5 p-4 rounded-2xl shadow-md hover:shadow-xl transition border border-gray-100"
                                                        >
                                                               {/* 🔝 Top */}
                                                               <div className="flex flex-wrap justify-between items-center mb-3 md:gap-3">
                                                                      <h2 className="font-semibold text-lg text-gray-800">
                                                                             🍱 {item.foodId?.foodType || "Food"}
                                                                      </h2>
                                                                      <p className="text-xs text-gray-700">
                                                                             {new Date(item.createdAt).toLocaleString()}
                                                                      </p>
                                                               </div>

                                                               {/* 📦 Quantity */}
                                                               <p className="text-sm text-gray-700 font-medium mb-2">
                                                                      📦 {item.foodId?.quantity || "-"}
                                                               </p>

                                                               {/* 📍 Location */}
                                                               <div className="text-sm text-gray-600 space-y-1">
                                                                      <p>📍 {item.foodId?.location?.name || "-"}, {item.foodId?.city || "-"}</p>
                                                                      <p>🗺️ {item.foodId?.state || "-"} - {item.foodId?.pinCode || "-"}</p>
                                                               </div>

                                                               {/* ⏰ Time + Expiry */}
                                                               <div className="flex md:flex-row flex-col justify-between text-sm text-gray-500 mt-2">
                                                                      <p>⏰ {item.foodId?.time || "-"}</p>
                                                                      <p className="flex flex-wrap">⌛ Expiry: {item.foodId?.expiry || "-"}</p>
                                                               </div>

                                                               {/* 📝 Notes */}
                                                               {item.foodId?.notes && (
                                                                      <p className="text-xs text-gray-400 mt-2">📝 {item.foodId.notes}</p>
                                                               )}

                                                               {/* 🔘 Buttons */}
                                                               {item.ngoStatus === "assigned" ? (
                                                                      <div className="flex gap-3 mt-5">
                                                                             <button
                                                                                    onClick={() => handleAction(item._id, "accepted")}
                                                                                    className="flex-1 bg-green-500 text-white py-2 rounded-lg cursor-pointer hover:bg-green-600 transition font-medium"
                                                                             >
                                                                                    Accept
                                                                             </button>

                                                                             <button
                                                                                    onClick={() => handleAction(item._id, "rejected")}
                                                                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium cursor-pointer"
                                                                             >
                                                                                    Reject
                                                                             </button>
                                                                      </div>
                                                               ) : (
                                                                      <p className="mt-4 text-xs text-right text-gray-400">
                                                                             Status:{" "}
                                                                             <span className={item.ngoStatus === "accepted" ? "text-green-600" : "text-red-500"}>
                                                                                    {item.ngoStatus}
                                                                             </span>
                                                                      </p>
                                                               )}
                                                        </motion.div>
                                                 ))
                                          ) : (
                                                 <div className="flex flex-col items-center justify-center text-center">
                                                        <img src="/EmptyNotifications.gif" className="h-28" />
                                                        <h2 className="text-xl font-semibold text-gray-700">
                                                               No Notifications Yet.
                                                        </h2>
                                                        <p className="text-gray-500 text-sm mt-1">
                                                               You will see nearby food donation requests here.
                                                        </p>
                                                        <button
                                                               onClick={() => window.location.reload()}
                                                               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                                                        >
                                                               Refresh
                                                        </button>
                                                 </div>
                                          )}
                                   </motion.div>
                            )}
                     </div >
              </div >
       );
};

export default Page;