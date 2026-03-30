"use client";
import React from "react";
import { motion } from "framer-motion";

const WelcomePage = ({ nextStep }) => {
       return (
              <div className="min-h-screen w-full flex items-center justify-center bg-liner-to-br from-green-100 to-orange-100 px-4">

                     <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full max-w-md  rounded  text-center"
                     >

                            {/* Logo */}
                            <div className="flex flex-col items-center mb-4">
                                   <img
                                          src="/ann_daan_logo.png"
                                          className="h-16 w-auto object-contain"
                                          alt="AnnDaan Logo"
                                   />
                                   <p className="text-sm text-gray-500 mt-1">
                                          From Celebration to Compassion
                                   </p>
                            </div>

                            {/* Heading */}
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                                   Reduce Food Waste, Feed the Hungry
                            </h2>

                            {/* Description*/}
                            <p className="text-sm text-gray-500 mb-2">
                                   Donate surplus food to those in need and make a difference in your community
                            </p>

                            {/* Extra Feature Line*/}
                            <p className="text-xs text-orange-500 font-medium mb-4">
                                   Restaurants can also exchange excess food with each other to reduce waste
                            </p>

                            {/* How It Works Card */}
                            <div className="p-4 mb-6 ">

                                   <h3 className="text-gray-700 font-semibold mb-4 text-xl">
                                          How It Works
                                   </h3>

                                   <div className="flex flex-wrap justify-around items-center text-center md:px-5">

                                          {/* Step 1 */}
                                          <div className="flex flex-col items-center space-y-2">
                                                 <img src="/surplus_food.webp" className="h-12 w-12 object-contain" />

                                                 <div className="text-xs font-semibold text-gray-600">
                                                        <p>List</p>
                                                        <p>Surplus Food</p>
                                                 </div>
                                          </div>

                                          {/* Step 2 */}
                                          <div className="flex flex-col items-center space-y-2">
                                                 <img src="/connect.png" className="h-12 w-12 object-contain" />

                                                 <div className="text-xs font-semibold text-gray-600">
                                                        <p>Connect</p>
                                                        <p>With NGOs</p>
                                                 </div>

                                          </div>

                                          {/* Step 3 */}
                                          <div className="flex flex-col items-center space-y-2">
                                                 <img src="/food-2.png" className="h-12 w-12 object-contain" />

                                                 <div className="text-xs font-semibold text-gray-600">
                                                        <p>Distribute to</p>
                                                        <p>Those in Need</p>
                                                 </div>
                                          </div>

                                   </div>
                            </div>

                            {/* Button */}
                            <button
                                   onClick={() => nextStep(2)}
                                   className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-2"
                            >
                                   <span>Get Started: Register Now</span>

                                   <img
                                          src="/rightArrow.gif"
                                          alt="arrow"
                                          className="h-8 object-contain"
                                   />
                            </button>

                     </motion.div>
              </div>
       );
};

export default WelcomePage;