"use client"
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
       const router = useRouter();

       return (
              <div className="w-full h-screen flex items-center justify-center bg-gray-50">
                     <div className="flex flex-col items-center text-center p-6 bg-white shadow-xl rounded-2xl max-w-sm w-full">

                            <img
                                   src="/cross.gif"
                                   alt="Access Denied"
                                   className="w-32 h-32 mb-4"
                            />

                            <h1 className="text-2xl font-bold text-red-500 mb-2">
                                   Access Denied 🚫
                            </h1>

                            <p className="text-gray-600 text-sm mb-5">
                                   You don't have permission to view this page.
                            </p>

                            <button
                                   onClick={() => router.back()}
                                   className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-300 cursor-pointer"
                            >
                                   Go Back
                            </button>
                     </div>
              </div>
       );
};

export default Page;
