"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Navbar = () => {
       const router = useRouter();
       const { data: session } = useSession();
       const img = session?.user?.image;
       const name = session?.user?.name;
       const role = session?.user?.role;

       return (
              <motion.div
                     initial={{ y: 40, opacity: 0 }}
                     animate={{ y: 0, opacity: 1 }}
                     transition={{ duration: 0.6 }}
                     className="w-full bg-white shadow-md px-6 md:py-3 py-1 flex md:flex-row flex-col justify-between items-center sticky top-2 z-50">

                     {/* Logo */}
                     <div
                            onClick={() => router.push("/")}
                            className="font-bold text-xl text-green-600 cursor-pointer"
                     >
                            <img src="/ann_daan_logo.png" className="h-10" />
                     </div>

                     <div className="flex items-center gap-5">
                            {role && (
                                   <span
                                          className="text-xs font-medium px-3 py-1 rounded-full capitalize tracking-wide bg-green-100 text-green-700 border border-green-200"
                                   >
                                          {role}
                                   </span>
                            )}

                            <div className="relative group">
                                   <div className="w-10 h-10 rounded-full overflow-hidden border shadow-sm cursor-pointer">
                                          {img ? (
                                                 <img
                                                        src={img}
                                                        alt="user"
                                                        className="w-full h-full object-cover"
                                                 />
                                          ) : (
                                                 <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold">
                                                        {name ? name.charAt(0).toUpperCase() : "U"}
                                                 </div>
                                          )}
                                   </div>

                                   <div className="absolute right-0 hidden group-hover:block bg-white shadow-lg rounded-lg p-2 w-40">
                                          <button
                                                 onClick={() => signOut({ callbackUrl: "/" })}
                                                 className="block w-full text-left px-3 py-2 text-red-500 hover:bg-gray-100 cursor-pointer font-semibold"
                                          >
                                                 Logout
                                          </button>
                                   </div>
                            </div>

                     </div>
              </motion.div>
       );
};
export default Navbar;