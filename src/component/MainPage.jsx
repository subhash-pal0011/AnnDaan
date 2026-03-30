"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { motion } from "framer-motion";

const MainPage = () => {
       const router = useRouter()

       return (
              <div className="w-full min-h-screen bg-gray-50">

                     <section className="relative bg-linear-to-b from-blue-200 to-orange-100 text-center">
                            <img
                                   src="/fistSectionImg.png"
                                   className="w-full h-75 md:h-125 object-cover"
                                   alt="hero"
                            />

                            <motion.div
                                   initial="hidden"
                                   animate="visible"
                                   transition={{ duration: 1 }}
                                   className="absolute inset-0 flex flex-col justify-center items-center px-4"
                            >

                                   <motion.h1
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.6 }}
                                          className="text-2xl md:text-5xl font-bold text-gray-800"
                                   >
                                          Reduce Food Waste,
                                          <br />
                                          <span className="text-yellow-500">Feed the Hungry</span>
                                   </motion.h1>

                                   <motion.p
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.2, duration: 0.6 }}
                                          className="text-gray-600 mt-3 text-sm md:text-lg"
                                   >
                                          Donate Surplus Food to Those in Need
                                   </motion.p>

                                   <motion.div
                                          initial={{ opacity: 0, y: 40 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.4, duration: 0.6 }}
                                          className="flex flex-col md:flex-row gap-4 mt-6"
                                   >
                                          <button
                                                 onClick={() => router.push("/myDonations")}
                                                 className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold flex gap-1 items-center cursor-pointer"
                                          >
                                                 Donate Food
                                                 <img src="/rightArrow.gif" className="h-7" />
                                          </button>

                                          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold">
                                                 Join as NGO
                                          </button>
                                   </motion.div>

                            </motion.div>
                     </section>

                     {/* ================= HOW IT WORKS ================= */}
                     <section className="text-center flex flex-col gap-8 mt-10 px-4">

                            <motion.div
                                   initial={{ opacity: 0, y: 60 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.6 }}
                                   viewport={{ once: false, amount: 0.2 }}
                                   className="flex items-center gap-3 max-w-xl w-full mx-auto"
                            >
                                   <div className="flex-1 h-px bg-gray-400"></div>
                                   <h2 className="text-2xl font-bold text-gray-700">
                                          How It Works
                                   </h2>
                                   <div className="flex-1 h-px bg-gray-400"></div>
                            </motion.div>

                            <motion.div
                                   initial="hidden"
                                   whileInView="show"
                                   viewport={{ once: false, amount: 0.2 }}
                                   transition={{ staggerChildren: 0.2 }}
                                   className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6, ease: "easeOut" }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-5 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <div className="text-green-600 font-bold text-xl">1. List Food</div>
                                          <img src="/surplushFood.png" className="h-30 mx-auto" />
                                          <p className="text-gray-500 text-sm">
                                                 Post your surplus food.
                                          </p>
                                   </motion.div>

                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6, ease: "easeOut" }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <div className="text-green-600 font-bold text-xl">2. NGO Accept</div>
                                          <img src="/NGOAccept.png" className="h-30 mx-auto" />
                                          <p className="text-gray-500 text-sm">
                                                 NGO picks up the food.
                                          </p>
                                   </motion.div>

                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6, ease: "easeOut" }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <div className="text-green-600 font-bold text-xl">3. Distribute</div>
                                          <img src="/distrubute.png" className="h-30 mx-auto" />
                                          <p className="text-gray-500 text-sm">
                                                 Food delivered to those in need.
                                          </p>
                                   </motion.div>

                            </motion.div>

                     </section>

                     {/* ================= WHO CAN PARTICIPATE ================= */}
                     <section className="mt-12 text-center flex flex-col gap-8 px-4 mb-5">

                            {/* Heading */}
                            <motion.div
                                   initial={{ opacity: 0, y: 40 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.6 }}
                                   viewport={{ once: false }}
                                   className="flex items-center gap-3 max-w-xl w-full mx-auto"
                            >
                                   <div className="flex-1 h-px bg-gray-400"></div>
                                   <h2 className="text-2xl font-bold text-gray-700">
                                          Who Can Participate?
                                   </h2>
                                   <div className="flex-1 h-px bg-gray-400"></div>
                            </motion.div>

                            {/* Cards */}
                            <motion.div
                                   initial="hidden"
                                   whileInView="show"
                                   viewport={{ once: false, amount: 0.2 }}
                                   transition={{ staggerChildren: 0.2 }}
                                   className="grid grid-cols-1 md:grid-cols-3 gap-8"
                            >

                                   {/* Card 1 */}
                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6 }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <h3 className="font-semibold text-lg">Food Organizer</h3>
                                          <img src="/foodOrgenizer.png" className="h-28 mx-auto my-3" />
                                          <p className="text-gray-500 text-sm">Share excess food.</p>
                                   </motion.div>

                                   {/* Card 2 */}
                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6 }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <h3 className="font-semibold text-lg">NGO Volunteer</h3>
                                          <img src="/ngoVolunter.png" className="h-28 mx-auto my-3" />
                                          <p className="text-gray-500 text-sm">Help distribute food.</p>
                                   </motion.div>

                                   {/* Card 3 */}
                                   <motion.div
                                          variants={{
                                                 hidden: { opacity: 0, y: 60 },
                                                 show: { opacity: 1, y: 0 }
                                          }}
                                          transition={{ duration: 0.6 }}
                                          whileHover={{ y: -8, scale: 1.03 }}
                                          className="bg-white p-6 rounded-xl shadow hover:shadow-xl"
                                   >
                                          <h3 className="font-semibold text-lg">Restaurant</h3>
                                          <img src="/restorent.png" className="h-28 mx-auto my-3" />
                                          <p className="text-gray-500 text-sm">Donate leftover meals.</p>
                                   </motion.div>

                            </motion.div>
                     </section>

                     {/* ================= CTA ================= */}
                     <section className="py-16 text-center bg-linear-to-r from-orange-200 to-blue-200 px-4">

                            <motion.h2
                                   initial={{ opacity: 0, y: 40 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ duration: 0.6 }}
                                   viewport={{ once: false }}
                                   className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                            >
                                   Ready to Make a Difference?
                            </motion.h2>

                            <motion.p
                                   initial={{ opacity: 0, y: 30 }}
                                   whileInView={{ opacity: 1, y: 0 }}
                                   transition={{ delay: 0.2, duration: 0.6 }}
                                   viewport={{ once: false }}
                                   className="text-gray-600 mb-6 text-sm md:text-lg"
                            >
                                   Join us and help reduce food waste today.
                            </motion.p>

                            <motion.button
                                   initial={{ opacity: 0, scale: 0.8 }}
                                   whileInView={{ opacity: 1, scale: 1 }}
                                   transition={{ delay: 0.4, duration: 0.5 }}
                                   viewport={{ once: false }}
                                   whileHover={{ scale: 1.08 }}
                                   whileTap={{ scale: 0.95 }}
                                   className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 shadow-lg"
                            >
                                   Get Started
                            </motion.button>

                     </section>

              </div >
       );
};
export default MainPage;