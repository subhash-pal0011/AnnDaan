"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import axios from "axios";
import { TbCurrentLocation } from "react-icons/tb";
import dynamic from "next/dynamic";
import { toast } from "sonner";
const MapView = dynamic(() => import("@/component/MapView"), {
       ssr: false,
});

const DonatePage = () => {
       const [aiLoading, setAiLoading] = useState(false);
       const [position, setPosition] = useState(null)

       const {
              register,
              handleSubmit,
              setValue,
              reset,
              watch,
              formState: { errors, isSubmitting },
       } = useForm();


       useEffect(() => {
              if (navigator.geolocation) {
                     navigator.geolocation.getCurrentPosition((poss) => {
                            const { latitude, longitude } = poss.coords
                            setPosition([latitude, longitude])
                     }, (err) => {
                            console.error("Location error:", err),
                            {
                                   enableHighAccuracy: true,
                                   maximumAge: 0, // Browser kabhi-kabhi purani (cached) location yaad rakh leta hai
                                   timeout: 10000 // 10 seconds mea nhi milta to bata do nhi mila location
                            }

                     })
              }
       }, [])


       // IS FUNCTION SE HUM ADDRESS FIND KR RHE HII LAT ,LNG DE KR.
       const fetchAddress = async () => {
              try {
                     if (!position) return;
                     const res = await axios.get(
                            `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`
                     );
                     const data = res.data;
                     setValue("location", data.display_name || "");
                     setValue("city", data.address?.county || "");
                     setValue("state", data.address?.state || "");
                     setValue("pinCode", data.address?.postcode || "");
              } catch (error) {
                     console.log("fetch address using lat lng error:", error);
              }
       };
       useEffect(() => {
              fetchAddress();
       }, [position]);


       // Use my current location FUNCTION
       const handleUseCurrentLocation = () => {
              if (navigator.geolocation) {
                     navigator.geolocation.getCurrentPosition((poss) => {
                            const { latitude, longitude } = poss.coords
                            setPosition([latitude, longitude])
                     }, (err) => {
                            console.error("Location error:", err),
                            {
                                   enableHighAccuracy: true,
                                   maximumAge: 0, // Browser kabhi-kabhi purani (cached) location yaad rakh leta hai
                                   timeout: 10000 // 10 seconds mea nhi milta to bata do nhi mila location
                            }
                     })
              }
       };


       const watchAll = watch();

       //  AI CALL.
       const handleAISuggestion = async () => {
              const data = watchAll;
              if (!data.food || !data.date || !data.time || !data.foodType || !data.period) {
                     return;
              }
              try {
                     setAiLoading(true);
                     const res = await axios.post("/api/user/ai", data);
                     setValue("notes", res.data.note);
                     setValue("expiry", res.data.expiry);
                     setValue("foodStatus", res.data.status);
                     setValue("color", res.data.color);
                     setValue("safetyScore", res.data.safetyScore);

              } catch (err) {
                     console.log(err);
                     alert("AI error");
              } finally {
                     setAiLoading(false);
              }
       };

       useEffect(() => {
              if (watchAll.food && watchAll.date && watchAll.time && watchAll.foodType && watchAll.period) {
                     handleAISuggestion();
              }
       }, [watchAll.food, watchAll.date, watchAll.time, watchAll.foodType, watchAll.storedInFridge, watchAll.period]);


       const onSubmit = async (data) => {
              try {
                     const res = await axios.post("/api/user/donation", data)
                     if (res.data.success) {
                            toast.success(res.data.message)
                            reset()
                     }
              } catch (error) {
                     console.log("donation form error :", error)
                     toast.error(error?.response?.data?.message)
              }
       };

       return (
              <div className="min-h-screen bg-linear-to-br from-green-100 to-orange-100 flex w-full items-center p-2">

                     <div className="flex flex-col md:flex-row justify-between gap-3 w-full">
                            <motion.form
                                   initial={{ opacity: 0, y: 30 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   onSubmit={handleSubmit(onSubmit)}
                                   className="w-full max-w-2xl bg-white p-6 rounded-xl shadow-xl space-y-5"
                            >

                                   {/* TITLE */}
                                   <div className="flex items-center justify-center">
                                          <h2 className="text-2xl font-bold text-center text-green-600">
                                                 Donate Food
                                          </h2>
                                          <img src="/food.gif" className="h-10" />
                                   </div>

                                   {/* FOOD */}
                                   <div className="relative">
                                          <input
                                                 type="text"
                                                 placeholder="Food Name"
                                                 {...register("food", {
                                                        required: "Food name is required*",
                                                        validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                                 className="w-full p-3 border rounded-lg shadow-xl"
                                          />

                                          {errors.food && (
                                                 <p className="text-red-500 text-xs ml-2 mt-1">
                                                        {errors.food.message}
                                                 </p>
                                          )}
                                   </div>

                                   {/* TYPE */}
                                   <div className="flex items-center gap-4">
                                          <label className="flex items-center gap-2 shadow p-2">
                                                 <input
                                                        type="radio"
                                                        value="veg"
                                                        {...register("foodType", { required: "Type is required*" })}
                                                 />
                                                 Veg
                                          </label>

                                          <label className="flex items-center gap-2 shadow p-2">
                                                 <input
                                                        type="radio"
                                                        value="non-veg"
                                                        {...register("foodType", { required: "Type is required*" })}
                                                 />
                                                 Non-Veg
                                          </label>

                                          {errors.foodType && (
                                                 <p className="text-red-500 text-xs">
                                                        {errors.foodType.message}
                                                 </p>
                                          )}
                                   </div>
                                   {/* ERROR MESSAGE */}


                                   {/* FRIDGE */}
                                   <div className="flex items-center gap-3">
                                          <input type="checkbox" {...register("storedInFridge")} />
                                          <label>Stored in Fridge ❄️</label>
                                   </div>

                                   {/* QUANTITY */}
                                   <div>
                                          <input
                                                 type="text"
                                                 {...register("quantity", {
                                                        required: "Quantity is required*", validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                                 placeholder="Quantity (e.g. 10 plates)"
                                                 className="w-full p-3 border rounded-lg shadow-xl"
                                          />

                                          {errors.quantity && (
                                                 <p className="text-red-500 text-xs ml-2 mt-1">
                                                        {errors.quantity.message}
                                                 </p>
                                          )}
                                   </div>

                                   {/* LOCATION */}
                                   <div>
                                          <input
                                                 {...register("location", {
                                                        required: "Location is required*", validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                                 placeholder="Pickup Location"
                                                 className="w-full p-3 border rounded-lg shadow-xl"
                                          />
                                          {errors.location && (
                                                 <p className="text-red-500 text-xs ml-2 mt-1">
                                                        {errors.location.message}
                                                 </p>
                                          )}
                                   </div>


                                   <div onClick={handleUseCurrentLocation} className="flex items-center gap-1 text-blue-500 cursor-pointer hover:underline">
                                          <TbCurrentLocation size={20} />
                                          <p className="font-semibold">Use my current location</p>
                                   </div>

                                   <div className="flex md:flex-row flex-col gap-2">

                                          {/* CITY */}
                                          <div>
                                                 <input
                                                        {...register("city", {
                                                               required: "City is required*", validate: (value) =>
                                                                      value.trim().length > 0 || "Only spaces not allowed",
                                                        })}
                                                        placeholder="City"
                                                        className="w-full p-3 border rounded-lg shadow-xl"
                                                 />
                                                 {errors.city && (
                                                        <p className="text-red-500 text-xs ml-2 mt-1">
                                                               {errors.city.message}
                                                        </p>
                                                 )}
                                          </div>

                                          {/* STATE */}
                                          <div>
                                                 <input
                                                        {...register("state", {
                                                               required: "State is required*", validate: (value) =>
                                                                      value.trim().length > 0 || "Only spaces not allowed",
                                                        })}
                                                        placeholder="State"
                                                        className="w-full p-3 border rounded-lg shadow-xl"
                                                 />
                                                 {errors.state && (
                                                        <p className="text-red-500 text-xs ml-2 mt-1">
                                                               {errors.state.message}
                                                        </p>
                                                 )}
                                          </div>

                                          <div>
                                                 <input
                                                        {...register("pinCode", {
                                                               required: "PinCode is required*", validate: (value) =>
                                                                      value.trim().length > 0 || "Only spaces not allowed",
                                                        })}
                                                        placeholder="PinCode"
                                                        className="w-full p-3 border rounded-lg shadow-xl"
                                                 />
                                                 {errors.pinCode && (
                                                        <p className="text-red-500 text-xs ml-2 mt-1">
                                                               {errors.pinCode.message}
                                                        </p>
                                                 )}
                                          </div>

                                   </div>


                                   {/* DATE */}
                                   <div>
                                          <input
                                                 type="date"
                                                 {...register("date", {
                                                        required: "Date is required*", validate: (value) =>
                                                               value.trim().length > 0 || "Only spaces not allowed",
                                                 })}
                                                 className="w-full p-3 border rounded-lg shadow-xl"
                                          />
                                          {errors.date && (
                                                 <p className="text-red-500 text-xs ml-2 mt-1">
                                                        {errors.date.message}
                                                 </p>
                                          )}
                                   </div>

                                   {/* TIME */}
                                   <div className="flex flex-col gap-1">
                                          <div className="flex gap-3">

                                                 {/* TIME INPUT */}
                                                 <input
                                                        type="time"
                                                        {...register("time", {
                                                               required: "Time is required*",
                                                        })}
                                                        className="w-full p-3 border rounded-lg shadow-xl"
                                                 />

                                                 {/* AM / PM */}
                                                 <select
                                                        {...register("period", {
                                                               required: "Select AM/PM*",
                                                        })}
                                                        className="p-3 border rounded-lg shadow-xl"
                                                 >
                                                        <option value="">Select</option>
                                                        <option value="AM">AM</option>
                                                        <option value="PM">PM</option>
                                                 </select>

                                          </div>

                                          {/* ERROR MESSAGE */}
                                          {(errors.time || errors.period) && (
                                                 <p className="text-red-500 text-xs ml-1">
                                                        {errors.time?.message || errors.period?.message}
                                                 </p>
                                          )}
                                   </div>

                                   {/* ALERT */}
                                   <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 rounded flex items-center">
                                          <img src="/Alert.gif" className="h-8" />
                                          <p className="text-sm text-yellow-800">
                                                 Food safety matters. Only donate fresh & properly stored food.
                                          </p>
                                   </div>

                                   {/* EXPIRY */}
                                   <input
                                          {...register("expiry")}
                                          placeholder="Expiry (AI calculated)"
                                          className="w-full p-3 border rounded-lg bg-green-100 text-green-800 font-semibold shadow-xl"
                                          readOnly
                                   />


                                   {/* STATUS */}
                                   {watch("foodStatus") && (
                                          <div
                                                 className={`p-3 rounded-lg text-white text-center font-semibold shadow-xl ${watch("color") === "green" ? "bg-green-500" : watch("color") === "yellow" ? "bg-yellow-500" : "bg-red-500"}`}
                                          >
                                                 {watch("foodStatus")}
                                          </div>
                                   )}

                                   {/* SAFETY SCORE  >>>>>>>>>>>> LINE*/}
                                   {/* !== undefined ISKA MTLB HII AGR UNDEFINE HII TO MT DEIKHO AGRR 0 BHI HII TO DIKHAO. */}
                                   {watch("safetyScore") !== undefined && (
                                          <div className="shadow">
                                                 <p className="text-sm mb-1 font-medium">
                                                        Food Safety Score: {watch("safetyScore")}%
                                                 </p>
                                                 <div className="w-full bg-gray-200 rounded h-3">
                                                        <div className="bg-green-500 h-3 rounded transition-all" style={{ width: `${watch("safetyScore")}%` }}>
                                                        </div>
                                                 </div>
                                          </div>
                                   )}

                                   {/* NOTES */}
                                   <textarea
                                          {...register("notes")}
                                          placeholder="AI Notes / Instructions"
                                          className="w-full p-3 border rounded-lg shadow-2xl"
                                   />

                                   {/* AI BUTTON */}
                                   <button
                                          type="button"
                                          disabled={aiLoading}
                                          onClick={handleAISuggestion}
                                          className={`w-full py- rounded-lg text-white ${aiLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                                   >
                                          {aiLoading
                                                 ? <div className="cursor-pointer items-center flex justify-center"><img src="/robo.gif" className="h-10" /> <p>Checking Food Safety</p> </div>
                                                 : <div className="cursor-pointer items-center flex justify-center py-2"> <p>Auto Fill</p> </div>}
                                   </button>

                                   <button
                                          disabled={isSubmitting || watch("foodStatus") === "Unsafe"}
                                          className={`cursor-pointer w-full py-2 text-center items-center justify-center flex rounded-lg text-white ${watch("foodStatus") === "Unsafe" ? "bg-gray-400 cursor-not-allowed" :
                                                 "bg-green-600 hover:bg-green-700"
                                          }`}
                                   >
                                          {isSubmitting ? <img src="/loader.gif" className="h-7"/> :  "Submit Donation"}
                                   </button>

                            </motion.form>

                            <div className="w-full h-150">
                                   <MapView position={position} setPosition={setPosition} />
                            </div>
                     </div>
              </div>
       );
};

export default DonatePage;