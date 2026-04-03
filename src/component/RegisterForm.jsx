"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import OtpPage from "./OtpPage";
import { toast } from "sonner";


const RegisterForm = () => {
       const {
              register,
              handleSubmit,
              reset,
              formState: { errors, isSubmitting },
       } = useForm();
       const [showPassword, setShowPassword] = useState(false);
       const [loginForm, setLoginForm] = useState(false);
       const [otpPage, setOtpPage] = useState(false);
       const [otpEmail, setOtpEmail] = useState("");
       const [otpPassword, setOtpPassword] = useState("");
       const router = useRouter();

       const onSubmit = async (data) => {
              try {
                     const res = await axios.post("/api/auth/register", data);
                     if (res.data.success) {
                            toast.success(res.data.message);

                            // show OTP page
                            setOtpPage(true);
                            setOtpEmail(data.email);
                            setOtpPassword(data.password);
                     }
              } catch (error) {
                     console.log("register error:", error);
                     toast.error(error?.response?.data?.message)
              }
       };



       const handelLogin = async (data) => {
              try {
                     const loginRes = await signIn("credentials", {
                            email: data.email,
                            password: data.password,
                            redirect: false,
                     });

                     if (loginRes?.error) {
                            toast.error(loginRes.error || "User not exists"); 
                            return;
                     }

                     if (loginRes?.ok) {
                            toast.success("Logged in successfully");
                            reset();
                            router.push("/");
                     }
              } catch (error) {
                     toast.error("Something went wrong");
                     console.log("login error:", error);
              }
       };


       if (otpPage) {
              return <OtpPage otpEmail={otpEmail} otpPassword={otpPassword} />;
       }

       return (
              <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                     <motion.div
                            initial={{ opacity: 0, y: 60, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-3 text-center"
                     >
                            {/* Logo */}
                            <motion.div
                                   initial={{ opacity: 0, scale: 0.8 }}
                                   animate={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: 0.2 }}
                                   className="text-center"
                            >
                                   <div className="flex justify-center items-center">
                                          <img
                                                 src="/ann_daan_logo.png"
                                                 className="h-16 w-auto object-contain"
                                                 alt="AnnDaan Logo"
                                          />
                                   </div>

                                   <p className="text-sm text-gray-500">
                                          From Celebration to Compassion
                                   </p>
                            </motion.div>

                            <h2 className="text-xl font-semibold text-center text-gray-700">
                                   {!loginForm ? "Create Your Account" : "Welcome Back! Login to Continue"}
                            </h2>

                            {/* Form */}
                            <form
                                   onSubmit={handleSubmit(loginForm ? handelLogin : onSubmit)}
                                   className="space-y-6"
                            >
                                   {/* Name */}
                                   {!loginForm && (
                                          <motion.div
                                                 initial={{ opacity: 0, y: 40 }}
                                                 animate={{ opacity: 1, y: 0 }}
                                                 transition={{ type: "spring", stiffness: 80 }}
                                                 className="space-y-1"
                                          >
                                                 <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
                                                        <FaUser className="text-gray-400 mr-2" />
                                                        <input
                                                               type="text"
                                                               {...register("name", {
                                                                      required: "Name is Required*",
                                                                      validate: (value) =>
                                                                             value.trim().length > 0 || "Only spaces not allowed",
                                                               })}
                                                               placeholder="Full Name"
                                                               className="w-full bg-transparent outline-none"
                                                        />
                                                 </div>
                                                 {errors.name && (
                                                        <p className="text-red-500 text-xs ml-2 absolute">
                                                               {errors.name.message}
                                                        </p>
                                                 )}
                                          </motion.div>
                                   )}

                                   {/* Email */}
                                   <motion.div
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ type: "spring", stiffness: 80 }}
                                          className="space-y-1"
                                   >
                                          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
                                                 <FaEnvelope className="text-gray-400 mr-2" />
                                                 <input
                                                        type="email"
                                                        {...register("email", {
                                                               required: "Email is Required*",
                                                        })}
                                                        placeholder="Email Address"
                                                        className="w-full bg-transparent outline-none"
                                                 />
                                          </div>
                                          {errors.email && (
                                                 <p className="text-red-500 text-xs ml-2 absolute">
                                                        {errors.email.message}
                                                 </p>
                                          )}
                                   </motion.div>

                                   {/* Password */}
                                   <motion.div
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ type: "spring", stiffness: 80 }}
                                          className="space-y-1"
                                   >
                                          <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
                                                 <FaLock className="text-gray-400 mr-2" />
                                                 <input
                                                        type={showPassword ? "text" : "password"}
                                                        {...register("password", {
                                                               required: "Password is Required*",
                                                               validate: (value) =>
                                                                      value.trim().length > 0 || "Only spaces not allowed",
                                                               minLength: {
                                                                      value: 6,
                                                                      message: "Minimum 6 characters required",
                                                               },
                                                        })}
                                                        placeholder="Password"
                                                        className="w-full bg-transparent outline-none"
                                                 />
                                                 <div
                                                        className="cursor-pointer"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                 >
                                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                                 </div>
                                          </div>
                                          {errors.password && (
                                                 <p className="text-red-500 text-xs ml-2 absolute">
                                                        {errors.password.message}
                                                 </p>
                                          )}
                                   </motion.div>

                                   <button
                                          disabled={isSubmitting}
                                          className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 items-center text-center flex justify-center"
                                   >
                                          {isSubmitting ? <img src="/loader.gif" className="h-6" /> : "Sign Up"}
                                   </button>
                            </form>

                            {/* OR Divider */}
                            <div className="flex items-center text-center gap-3">
                                   <div className="flex-1 h-px bg-gray-400"></div>
                                   <span className="text-sm text-gray-400">OR</span>
                                   <div className="flex-1 h-px bg-gray-400"></div>
                            </div>

                            {/* Google Login */}
                            <div className="items-center text-center justify-center flex">
                                   <button
                                          onClick={() => signIn("google", {callbackUrl: "/role"})}
                                          className="flex items-center gap-2 border p-2 px-5 rounded cursor-pointer"
                                   >
                                          <FcGoogle />{" "}
                                          <p className="font-semibold text-sm">Continue with Google</p>
                                   </button>
                            </div>

                            {/* Footer */}
                            <button
                                   onClick={() => setLoginForm(!loginForm)}
                                   className="text-center text-sm text-gray-500"
                            >
                                   {loginForm ? "Don’t have an account yet?" : "Already have an account?"}
                                   <span className="text-orange-500 cursor-pointer hover:underline">
                                          {loginForm ? " Sign Up" : " Login"}
                                   </span>
                            </button>
                     </motion.div>
              </div>
       );
}

export default RegisterForm




// "use client";
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// import { useForm } from "react-hook-form";
// import { FaRegEyeSlash } from "react-icons/fa";
// import { FaRegEye } from "react-icons/fa6";
// import { FcGoogle } from "react-icons/fc";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { signIn } from "next-auth/react";
// import OtpPage from "./OtpPage";
// import { toast } from "sonner";


// const RegisterForm = () => {
//        const {
//               register,
//               handleSubmit,
//               reset,
//               formState: { errors, isSubmitting },
//        } = useForm();
//        const [showPassword, setShowPassword] = useState(false);
//        const [loginForm, setLoginForm] = useState(false);
//        const [otpPage, setOtpPage] = useState(false);
//        const [otpEmail, setOtpEmail] = useState("");
//        const [otpPassword, setOtpPassword] = useState("");
//        const router = useRouter();



//        const [position, setPosition] = useState(null);

//        useEffect(() => {
//               if (navigator.geolocation) {
//                      navigator.geolocation.getCurrentPosition(
//                             (pos) => {
//                                    const { latitude, longitude } = pos.coords;

//                                    console.log("LAT:", latitude);
//                                    console.log("LNG:", longitude);

//                                    setPosition([latitude, longitude]);
//                             },
//                             (err) => {
//                                    console.error("Location error:", err);
//                             },
//                             {
//                                    enableHighAccuracy: true,
//                                    maximumAge: 0,
//                                    timeout: 10000,
//                             }
//                      );
//               }
//        }, []);

//        const onSubmit = async (data) => {
//               console.log("POSITION:", position);
//               try {
//                      if (!position) {
//                             toast.error("Location not found");
//                             return;
//                      }

//                      const payload = {
//                             ...data,

//                             location: {
//                                    type: "Point",
//                                    coordinates: [position[1], position[0]], // ⚠️ lng, lat
//                             },
//                      };

//                      const res = await axios.post("/api/auth/register", payload);

//                      if (res.data.success) {
//                             console.log("registerRes :" ,res)
//                             toast.success(res.data.message);
//                             setOtpPage(true);
//                             setOtpEmail(data.email);
//                             setOtpPassword(data.password);
//                      }

//               } catch (error) {
//                      console.log(error);
//                      toast.error("Register failed");
//               }
//        };



//        const handelLogin = async (data) => {
//               try {
//                      const loginRes = await signIn("credentials", {
//                             email: data.email,
//                             password: data.password,
//                             redirect: false,
//                      });

//                      if (loginRes?.error) {
//                             toast.error(loginRes.error || "User not exists");
//                             return;
//                      }

//                      if (loginRes?.ok) {
//                             toast.success("Logged in successfully");
//                             reset();
//                             router.push("/");
//                      }
//               } catch (error) {
//                      toast.error("Something went wrong");
//                      console.log("login error:", error);
//               }
//        };


//        if (otpPage) {
//               return <OtpPage otpEmail={otpEmail} otpPassword={otpPassword} />;
//        }

//        return (
//               <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
//                      <motion.div
//                             initial={{ opacity: 0, y: 60, scale: 0.95 }}
//                             animate={{ opacity: 1, y: 0, scale: 1 }}
//                             transition={{ duration: 0.6, ease: "easeOut" }}
//                             className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-3 text-center"
//                      >
//                             {/* Logo */}
//                             <motion.div
//                                    initial={{ opacity: 0, scale: 0.8 }}
//                                    animate={{ opacity: 1, scale: 1 }}
//                                    transition={{ delay: 0.2 }}
//                                    className="text-center"
//                             >
//                                    <div className="flex justify-center items-center">
//                                           <img
//                                                  src="/ann_daan_logo.png"
//                                                  className="h-16 w-auto object-contain"
//                                                  alt="AnnDaan Logo"
//                                           />
//                                    </div>

//                                    <p className="text-sm text-gray-500">
//                                           From Celebration to Compassion
//                                    </p>
//                             </motion.div>

//                             <h2 className="text-xl font-semibold text-center text-gray-700">
//                                    {!loginForm ? "Create Your Account" : "Welcome Back! Login to Continue"}
//                             </h2>

//                             {/* Form */}
//                             <form
//                                    onSubmit={handleSubmit(loginForm ? handelLogin : onSubmit)}
//                                    className="space-y-6"
//                             >
//                                    {/* Name */}
//                                    {!loginForm && (
//                                           <motion.div
//                                                  initial={{ opacity: 0, y: 40 }}
//                                                  animate={{ opacity: 1, y: 0 }}
//                                                  transition={{ type: "spring", stiffness: 80 }}
//                                                  className="space-y-1"
//                                           >
//                                                  <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
//                                                         <FaUser className="text-gray-400 mr-2" />
//                                                         <input
//                                                                type="text"
//                                                                {...register("name", {
//                                                                       required: "Name is Required*",
//                                                                       validate: (value) =>
//                                                                              value.trim().length > 0 || "Only spaces not allowed",
//                                                                })}
//                                                                placeholder="Full Name"
//                                                                className="w-full bg-transparent outline-none"
//                                                         />
//                                                  </div>
//                                                  {errors.name && (
//                                                         <p className="text-red-500 text-xs ml-2 absolute">
//                                                                {errors.name.message}
//                                                         </p>
//                                                  )}
//                                           </motion.div>
//                                    )}

//                                    {/* Email */}
//                                    <motion.div
//                                           initial={{ opacity: 0, y: 40 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           transition={{ type: "spring", stiffness: 80 }}
//                                           className="space-y-1"
//                                    >
//                                           <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
//                                                  <FaEnvelope className="text-gray-400 mr-2" />
//                                                  <input
//                                                         type="email"
//                                                         {...register("email", {
//                                                                required: "Email is Required*",
//                                                         })}
//                                                         placeholder="Email Address"
//                                                         className="w-full bg-transparent outline-none"
//                                                  />
//                                           </div>
//                                           {errors.email && (
//                                                  <p className="text-red-500 text-xs ml-2 absolute">
//                                                         {errors.email.message}
//                                                  </p>
//                                           )}
//                                    </motion.div>

//                                    {/* Password */}
//                                    <motion.div
//                                           initial={{ opacity: 0, y: 40 }}
//                                           animate={{ opacity: 1, y: 0 }}
//                                           transition={{ type: "spring", stiffness: 80 }}
//                                           className="space-y-1"
//                                    >
//                                           <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-1 focus-within:ring-gray-800">
//                                                  <FaLock className="text-gray-400 mr-2" />
//                                                  <input
//                                                         type={showPassword ? "text" : "password"}
//                                                         {...register("password", {
//                                                                required: "Password is Required*",
//                                                                validate: (value) =>
//                                                                       value.trim().length > 0 || "Only spaces not allowed",
//                                                                minLength: {
//                                                                       value: 6,
//                                                                       message: "Minimum 6 characters required",
//                                                                },
//                                                         })}
//                                                         placeholder="Password"
//                                                         className="w-full bg-transparent outline-none"
//                                                  />
//                                                  <div
//                                                         className="cursor-pointer"
//                                                         onClick={() => setShowPassword(!showPassword)}
//                                                  >
//                                                         {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
//                                                  </div>
//                                           </div>
//                                           {errors.password && (
//                                                  <p className="text-red-500 text-xs ml-2 absolute">
//                                                         {errors.password.message}
//                                                  </p>
//                                           )}
//                                    </motion.div>

//                                    <button
//                                           disabled={isSubmitting}
//                                           className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 items-center text-center flex justify-center"
//                                    >
//                                           {isSubmitting ? <img src="/loader.gif" className="h-6" /> : "Sign Up"}
//                                    </button>
//                             </form>

//                             {/* OR Divider */}
//                             <div className="flex items-center text-center gap-3">
//                                    <div className="flex-1 h-px bg-gray-400"></div>
//                                    <span className="text-sm text-gray-400">OR</span>
//                                    <div className="flex-1 h-px bg-gray-400"></div>
//                             </div>

//                             {/* Google Login */}
//                             <div className="items-center text-center justify-center flex">
//                                    <button
//                                           onClick={() => signIn("google", { callbackUrl: "/role" })}
//                                           className="flex items-center gap-2 border p-2 px-5 rounded cursor-pointer"
//                                    >
//                                           <FcGoogle />{" "}
//                                           <p className="font-semibold text-sm">Continue with Google</p>
//                                    </button>
//                             </div>

//                             {/* Footer */}
//                             <button
//                                    onClick={() => setLoginForm(!loginForm)}
//                                    className="text-center text-sm text-gray-500"
//                             >
//                                    {loginForm ? "Don’t have an account yet?" : "Already have an account?"}
//                                    <span className="text-orange-500 cursor-pointer hover:underline">
//                                           {loginForm ? " Sign Up" : " Login"}
//                                    </span>
//                             </button>
//                      </motion.div>
//               </div>
//        );
// }

// export default RegisterForm
