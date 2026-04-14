"use client";
import { useForm } from "react-hook-form"
import Navbar from "@/component/Navbar";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { motion } from "framer-motion";
import axios from "axios";
import { socketConnection } from "@/lib/socketConnection";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
const LiveMap = dynamic(() => import("@/component/LiveMap"), {
       ssr: false,
});

const Page = () => {
       const [showOtpBox, setShowOtpBox] = useState(false)
       const [notifications, setNotifications] = useState([]);
       const [loading, setLoading] = useState(true);
       const { userData } = useSelector((state) => state.user)
       const [foodLocation, setFoodLocation] = useState(null);
       const [ngoLocation, setNgoLocation] = useState(null)
       const [acceptLoadingId, setAcceptLoadingId] = useState(null);
       const router = useRouter();

       const donateUserPhoneNum = notifications?.[0]?.donationUserId?.phone
       const acceptFoodId = notifications?.[0]?.foodId?._id


       const {
              register,
              handleSubmit,
              watch,
              formState: { errors, isSubmitting },
       } = useForm()

       const getNotification = async () => {
              try {
                     const res = await axios.get("/api/ngo/getNotification");
                     if (res.data.success) {
                            setNotifications(res.data.data)
                     }
              } catch (error) {
                     console.log("Get notification error:", error);
              } finally {
                     setLoading(false);
              }
       };

       useEffect(() => {
              if (!userData?._id) return;

              const socket = socketConnection();

              socket.off("new-food").on("new-food", (data) => {
                     setNotifications((prev) => {
                            const isBusy = prev.some(
                                   (item) => item.ngoStatus === "accepted" || item.ngoStatus === "out_for_delivery"
                            );

                            if (isBusy) return prev;

                            const exists = prev.find((item) => item._id === data._id);
                            if (exists) return prev;

                            return [data, ...prev];
                     });
              });

              return () => {
                     socket.off("new-food");
              };
       }, [userData?._id]);


       const accept = async (foodId) => {
              try {
                     setAcceptLoadingId(foodId);

                     const res = await axios.post(
                            `/api/ngo/notification/${foodId}/acceptNotification`
                     );

                     if (res.data.success) {
                            toast.success(res.data.message);

                            setNotifications((prev) =>
                                   prev
                                          .map((item) =>
                                                 item._id === foodId
                                                        ? { ...item, ngoStatus: "accepted" }
                                                        : item
                                          )
                                          .filter((item) => item._id === foodId)
                            );

                            window.location.reload();
                     }
              } catch (error) {
                     console.log("accept error:", error.response?.data);
              } finally {
                     setAcceptLoadingId(null);
              }
       };


       const acceptFood = async () => {
              try {
                     const res = await axios.get("/api/ngo/getAcceptFoodDonation");
                     // console.log("acceptFood : ", res.data)

                     if (res.data.success) {
                            const coords = res.data?.data?.[0]?.foodId?.location?.coordinates;
                            if (coords) {
                                   setFoodLocation({
                                          latitude: coords[1],
                                          longitude: coords[0],
                                   });
                            }
                     }
              } catch (error) {
                     console.log("acceptFood error:", error);
              }
       };

       useEffect(() => {
              getNotification();
              acceptFood()
       }, [userData]);


       useEffect(() => {
              if (!userData?._id) return;

              const socket = socketConnection();

              let watcherId;
              let lastSent = 0;
              let lastErrorTime = 0;

              watcherId = navigator.geolocation.watchPosition(
                     (pos) => {
                            const lat = pos.coords.latitude;
                            const lng = pos.coords.longitude;

                            setNgoLocation({
                                   latitude: lat,
                                   longitude: lng,
                            });

                            if (Date.now() - lastSent > 5000) {
                                   lastSent = Date.now();
                                   socket.emit("updated-location", {
                                          userId: userData._id,
                                          latitude: lat,
                                          longitude: lng,
                                   });
                            }
                     },
                     (error) => {
                            if (Date.now() - lastErrorTime > 5000) {
                                   lastErrorTime = Date.now();

                                   if (error.code === 1) {
                                          console.warn("Permission denied");
                                   } else if (error.code === 2) {
                                          console.warn(" Position unavailable");
                                   } else if (error.code === 3) {
                                          console.warn("⏱ Timeout");
                                   }
                            }
                     },
                     {
                            enableHighAccuracy: true,
                            maximumAge: 10000,
                            timeout: 15000,
                     }
              );

              return () => {
                     if (watcherId) navigator.geolocation.clearWatch(watcherId);
                     socket.disconnect();
              };
       }, [userData?._id]);


       const sendOtpForDonateUser = async (phone) => {
              try {
                     const res = await axios.post("/api/otp_twilio/sendOtp", {
                            phone: phone,
                     });

                     if (res.data.success) {
                            toast.success(res.data.message);
                     }
              } catch (error) {
                     console.log("sendOtpForDonateUser-Error:", error);
                     toast.error(error?.response?.data?.message);
              }
       };


       const onSubmit = async (data) => {
              const otp = Object.values(data.otp).join("");

              try {
                     const res = await axios.post("/api/otp_twilio/verifyOtp", {
                            otp,
                            phone: donateUserPhoneNum,
                            acceptFoodId,
                     });

                     if (res.data.success) {
                            toast.success(res?.data?.message || "OTP verified successfully");
                            setShowOtpBox(false)
                            window.location.reload();
                     }


              } catch (error) {
                     console.log("verify otp Error:", error);
                     toast.error(error?.response?.data?.message);
              }
       };


       const markDelivered = async () => {
              try {
                     const res = await axios.post("/api/ngo/markDelivered", {
                            foodId: acceptFoodId,
                     });

                     if (res.data.success) {
                            toast.success(res.data.message);

                            setNotifications((prev) =>
                                   prev.filter((item) => item.foodId._id !== acceptFoodId)
                            );
                     }
              } catch (error) {
                     console.log(error);
                     toast.error(error?.response?.data?.message);
              }
       };


       // REAL TIME DELETE
       useEffect(() => {
              const socket = socketConnection();

              socket.on("donation-deleted", (data) => {
                     setNotifications((prev) =>
                            prev.filter(item => item.foodId._id !== data.foodId)
                     );
              });

              return () => {
                     socket.off("donation-deleted");
              };
       }, []);


       const handleReject = async (notificationId) => {
              try {
                     const res = await axios.post("/api/ngo/rejectNotification", {
                            notificationId,
                     });

                     if (res.data.success) {
                            toast.success(res.data.message);

                            setNotifications((prev) => {
                                   prev.filter((item) => item._id !== notificationId);
                            });
                     }
              } catch (error) {
                     console.log("Reject Error:", error);
              }
       };

       return (
              <div className="min-h-screen bg-linear-to-b from-blue-50 to-gray-100">
                     <div className="p-2 space-y-7">
                            <Navbar />


                            {showOtpBox && (
                                   <div className="fixed inset-0 flex items-center justify-center z-50">

                                          {/* overlay */}
                                          <div className="absolute inset-0 bg-black/40"></div>

                                          {/* box */}
                                          <div className="relative rounded-xl shadow md:p-4 p-2 w-75 text-center mt-5">

                                                 <h2 className="text-lg font-semibold mb-3">Enter OTP 🔐</h2>

                                                 <form onSubmit={handleSubmit(onSubmit)}>

                                                        <div className="flex gap-2 text-center items-center justify-center">
                                                               {Array.from({ length: 6 }).map((_, index) => (
                                                                      <motion.input
                                                                             initial={{ x: 40, opacity: 0 }}
                                                                             animate={{ x: 0, opacity: 1 }}
                                                                             transition={{ delay: index * 0.2, duration: 0.4 }}
                                                                             key={index}
                                                                             type="text"
                                                                             maxLength={1}
                                                                             inputMode="numeric"
                                                                             className="w-full p-2 md:h-10 h-8 md:max-w-12 max-w-8 border rounded-full text-center border-gray-100"

                                                                             {...register(`otp.${index}`, { required: true })}
                                                                             onInput={(e) => {
                                                                                    e.target.value = e.target.value.replace(/[^0-9]/g, "")

                                                                                    if (e.target.value && e.target.nextElementSibling) {
                                                                                           e.target.nextElementSibling.focus()
                                                                                    }

                                                                             }}
                                                                             onKeyDown={(e) => {
                                                                                    if (e.key === "Backspace" && !e.target.value) {
                                                                                           if (e.target.previousElementSibling) {
                                                                                                  e.target.previousElementSibling.focus()
                                                                                           }
                                                                                    }
                                                                             }}
                                                                      />
                                                               ))}
                                                        </div>

                                                        <div className="flex gap-3 mt-4 ">
                                                               <button
                                                                      className={`flex-1 text-white py-2 rounded transition-all duration-300 ${isSubmitting
                                                                             ? "bg-green-300 cursor-not-allowed"
                                                                             : "bg-green-500 hover:bg-green-600 cursor-pointer"
                                                                             }`}
                                                                      disabled={isSubmitting}
                                                               >
                                                                      {isSubmitting ? "Verifying..." : "Verify"}
                                                               </button>

                                                               <button
                                                                      onClick={() => setShowOtpBox(false)}

                                                                      className="flex-1 bg-gray-300 py-2 rounded  cursor-pointer hover:bg-gray-400"
                                                               >
                                                                      Cancel
                                                               </button>
                                                        </div>
                                                 </form>

                                          </div>
                                   </div>
                            )}

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
                                   <motion.div className={`mx-auto max-w-full md:px-10 px-2 ${showOtpBox ? "blur-xs pointer-events-none" : ""}`}
                                          initial={{ opacity: 0 }}
                                          animate={{ opacity: 1 }}
                                   >
                                          {notifications.length > 0 ? (
                                                 notifications.map((item) => {
                                                        const isOtpVerified = item?.foodId?.otpVerified === true;

                                                        return (
                                                               <div
                                                                      key={item._id}
                                                                      className="flex flex-col md:flex-row gap-6 mb-6 items-start justify-center"
                                                               >
                                                                      {/* 🧾 CARD */}
                                                                      <motion.div
                                                                             initial={{ opacity: 0, y: 40 }}
                                                                             animate={{ opacity: 1, y: 0 }}
                                                                             transition={{ duration: 0.4 }}
                                                                             whileHover={{ scale: 1.02 }}
                                                                             className="bg-white md:p-5 p-4 rounded-md shadow-md hover:shadow-xl transition border border-gray-100"
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

                                                                             {/* Donor Info */}
                                                                             <p className="text-sm text-gray-700 mt-2">
                                                                                    👤 {item.donationUserId?.name || "Unknown"}
                                                                             </p>

                                                                             <p className="text-sm text-gray-700 mt-1.5">
                                                                                    📞 {item.donationUserId?.phone || "No phone available"}
                                                                             </p>

                                                                             {/* Full Address */}
                                                                             <p className="text-sm text-gray-600 mt-2 flex  flex-wrap">
                                                                                    📍 {item.foodId?.address}, {item.foodId?.city}, {item.foodId?.state} - {item.foodId?.pinCode}
                                                                             </p>

                                                                             {/* 📦 Quantity */}
                                                                             <p className="text-sm text-gray-700 font-medium mb-2">
                                                                                    📦 {item.foodId?.quantity || "-"}
                                                                             </p>


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
                                                                                                  onClick={() => accept(item?._id)}
                                                                                                  disabled={acceptLoadingId === item._id}
                                                                                                  className={`flex-1 text-white py-2 rounded-lg transition font-medium ${acceptLoadingId === item._id
                                                                                                         ? "bg-green-300 cursor-not-allowed"
                                                                                                         : "bg-green-500 hover:bg-green-600 cursor-pointer"
                                                                                                         }`}
                                                                                           >
                                                                                                  {acceptLoadingId === item._id ? "Accepting..." : "Accept"}
                                                                                           </button>
















                                                                                           <button
                                                                                                  onClick={() => handleReject(item._id)}
                                                                                                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition font-medium cursor-pointer"
                                                                                           >
                                                                                                  Reject
                                                                                           </button>
                                                                                    </div>
                                                                             ) : (
                                                                                    <div>
                                                                                           <p className="mt-4 text-xs text-right text-gray-400">
                                                                                                  Status:{" "}
                                                                                                  <span className={item.ngoStatus === "accepted" ? "text-green-600" : "text-red-500"}>
                                                                                                         {item.ngoStatus}
                                                                                                  </span>
                                                                                           </p>

                                                                                           <select
                                                                                                  onChange={(e) => {
                                                                                                         const value = e.target.value;

                                                                                                         if (value === "out_for_delivery") {

                                                                                                                setShowOtpBox(true);
                                                                                                                sendOtpForDonateUser(donateUserPhoneNum);
                                                                                                         }

                                                                                                         if (value === "delivered") {
                                                                                                                markDelivered(); console.log("Mark as delivered");
                                                                                                         }
                                                                                                  }}
                                                                                                  className="w-full max-w-xs p-2.5 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-1 text-xs cursor-pointer focus:ring-green-400"
                                                                                           >
                                                                                                  <option value="">Select Status</option>
                                                                                                  {!isOtpVerified && (
                                                                                                         <option value="out_for_delivery">🚚 Out for Delivery</option>
                                                                                                  )}
                                                                                                  <option value="delivered">✅ Delivered</option>
                                                                                           </select>


                                                                                    </div>
                                                                             )}


                                                                      </motion.div>

                                                                      {item.ngoStatus === "accepted" && (
                                                                             <div className="w-full max-w-150 h-50">
                                                                                    <LiveMap
                                                                                           foodLocation={foodLocation}
                                                                                           ngoLocation={ngoLocation}
                                                                                    />
                                                                             </div>
                                                                      )}
                                                               </div>
                                                        )

                                                 })
                                          ) : (
                                                 <div className="text-center">No Notifications</div>
                                          )}

                                          <div>
                                                 <input type="text" />
                                          </div>

                                   </motion.div>
                            )}
                     </div >
              </div >
       );
};

export default Page;




