"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const OtpPage = ({ otpEmail, otpPassword }) => {
       const {
              register,
              handleSubmit,
              formState: { isSubmitting },
       } = useForm();
       const router = useRouter();

       const onSubmit = async (data) => {
              const otp = Object.values(data.otp).join("");

              try {
                     const res = await axios.post("/api/auth/verifyOtpEmail", {
                            email: otpEmail,
                            otp,
                     });

                     if (res.data.success) {
                            toast.success(res.data.message);

                            // Auto login after OTP verification
                            const loginRes = await signIn("credentials", {
                                   email: otpEmail,
                                   password: otpPassword,
                                   redirect: false,
                            });
                            console.log("loginRes", loginRes);
                            if (loginRes?.ok) {
                                   router.push("/editProfile");
                            } else {
                                   toast.error("Auto login failed");
                            }
                     }
              } catch (error) {
                     toast.error(error.response?.data?.message || "Something went wrong");
              }
       };

       return (
              <div className="min-h-screen flex items-center justify-center px-4">
                     <div className="w-full max-w-md rounded-2xl p-8 text-center shadow space-y-3">
                            <h2 className="text-2xl font-semibold">Verify Email OTP</h2>

                            <form
                                   onSubmit={handleSubmit(onSubmit)}
                                   className="flex flex-col items-center space-y-5"
                            >
                                   <div className="flex justify-center gap-3">
                                          {Array.from({ length: 4 }).map((_, index) => (
                                                 <motion.input
                                                        key={index}
                                                        type="text"
                                                        maxLength={1}
                                                        inputMode="numeric"
                                                        initial={{ x: 40, opacity: 0 }}
                                                        animate={{ x: 0, opacity: 1 }}
                                                        transition={{ delay: index * 0.2, duration: 0.4 }}
                                                        className="w-12 h-12 text-lg text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                                        {...register(`otp.${index}`, { required: true, pattern: /^[0-9]$/ })}
                                                        onInput={(e) => {
                                                               e.target.value = e.target.value.replace(/[^0-9]/g, "");
                                                               if (e.target.nextSibling && e.target.value) {
                                                                      e.target.nextSibling.focus();
                                                               }
                                                        }}
                                                 />
                                          ))}
                                   </div>

                                   <button className="border p-2 px-5 cursor-pointer font-semibold bg-gray-800 hover:bg-gray-700 text-white rounded">
                                          {isSubmitting ? <img src="/loader.gif" className="h-6" /> : "Submit"}
                                   </button>
                            </form>
                     </div>
              </div>
       );
};

export default OtpPage;