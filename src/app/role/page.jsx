"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { FaPhone } from "react-icons/fa";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
       const {
              register,
              handleSubmit,
              formState: { errors, isSubmitting }
       } = useForm();

       const router = useRouter()

       const onSubmit = async (data) => {
              try {
                     const res = await axios.post("/api/role", data)
                     if (res.data.success) {
                            toast.success(res.data.message)
                            router.push("/")
                     }
              } catch (error) {
                     toast.error(error?.response?.data?.message)
                     console.log("Edit profile error :", error);
              }
       };
      
       return (
              <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">

                     <motion.div
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md rounded space-y-3"
                     >
                            <div className="text-center space-y-1">
                                   <h2 className="text-2xl font-semibold text-gray-800">
                                          Complete Your Profile
                                   </h2>
                                   <p className="text-sm text-gray-500">
                                          Just a few more details to continue
                                   </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                                   {/* Phone */}
                                   <motion.div
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ type: "spring", stiffness: 80 }}
                                          className="space-y-1">
                                          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-black">
                                                 <FaPhone className="text-gray-400 mr-2" />
                                                 <input
                                                        type="text"
                                                        placeholder="Phone Number"
                                                        {...register("phone", {
                                                               required: "Phone is required",
                                                               pattern: {
                                                                      value: /^[6-9]\d{9}$/,
                                                                      message: "Enter valid phone number"
                                                               }
                                                        })}
                                                        className="w-full bg-transparent outline-none"
                                                 />
                                          </div>
                                          {errors.phone && (
                                                 <p className="text-red-500 text-xs ml-2">
                                                        {errors.phone.message}
                                                 </p>
                                          )}
                                   </motion.div>

                                   {/* Role */}
                                   <motion.div
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ type: "spring", stiffness: 80 }}
                                          className="space-y-1"
                                   >
                                          <select
                                                 {...register("role", { required: "Role is required" })}
                                                 className="md:w-full border rounded-lg px-3 py-2 bg-gray-50 outline-none text-gray-600 cursor-pointer"
                                          >
                                                 <option value="">Select Your Role</option>
                                                 <option value="organizer">Event Organizer</option>
                                                 <option value="ngo">NGO</option>
                                                 <option value="restaurant">Restaurant</option>
                                          </select>

                                          {errors.role && (
                                                 <p className="text-red-500 text-xs ml-2">
                                                        {errors.role.message}
                                                 </p>
                                          )}
                                   </motion.div>

                                   {/* Button */}
                                   <button
                                          disabled={isSubmitting}
                                          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50 flex justify-center cursor-pointer"
                                   >
                                          {isSubmitting ? (
                                                 <img src="/loader.gif" className="w-6 h-6" />
                                          ) : (
                                                 "Save & Continue"
                                          )}
                                   </button>
                            </form>
                     </motion.div>
              </div>
       );
};

export default Page;

