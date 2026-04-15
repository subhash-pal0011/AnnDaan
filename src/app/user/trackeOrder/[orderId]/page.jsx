"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { socketConnection } from "@/lib/socketConnection";
const LiveMap = dynamic(() => import("@/component/LiveMap"), {
       ssr: false,
});

const Page = () => {
       const { orderId } = useParams();
       const router = useRouter();
       const { userData } = useSelector((state) => state.user);

       const [order, setOrder] = useState(null);
       const [foodLocation, setFoodLocation] = useState(null);
       const [ngoLocation, setNgoLocation] = useState(null);

       const trackOrder = async () => {
              try {
                     const res = await axios.get(`/api/user/getTrackOrder/${orderId}`);
                     const data = res.data.data;

                     // console.log("data :", data)
                     // console.log("data :", data.acceptedBy?._id)

                     setOrder(data);

                     // Food Location
                     if (data?.location?.coordinates) {
                            const [lng, lat] = data.location.coordinates;
                            setFoodLocation({ latitude: lat, longitude: lng });
                     }

                     // NGO Location
                     if (data?.acceptedBy?.location?.coordinates) {
                            const [lng, lat] = data.acceptedBy.location.coordinates;
                            setNgoLocation({ latitude: lat, longitude: lng });
                     }
              } catch (error) {
                     console.log("trackOrder error:", error);
              }
       };

       useEffect(() => {
              if (orderId) trackOrder();
       }, [orderId, userData?._id]);


       useEffect(() => {
              if (!order?.acceptedBy?._id) return;

              const socket = socketConnection();

              socket.on("update-ngo-location", ({ userId, location }) => {
                     console.log("socket hit:", userId, location);

                     if (userId === order?.acceptedBy?._id) {
                            const [lng, lat] = location.coordinates;

                            setNgoLocation({
                                   latitude: lat,
                                   longitude: lng,
                            });
                     }
              });

              return () => {
                     socket.off("update-ngo-location");
              };
       }, [order]);

       return (
              <div className="w-full min-h-screen bg-linear-to-br from-blue-50 to-blue-100 text-gray-800">

                     {/* Header */}
                     <div className="flex items-center gap-3 p-5 shadow-sm bg-white">
                            <IoMdArrowBack
                                   size={28}
                                   className="cursor-pointer"
                                   onClick={() => router.back()}
                            />
                            <h1 className="text-lg font-semibold">Track Ngo</h1>
                     </div>

                     {/* Content */}
                     <div className="max-w-3xl mx-auto p-4 space-y-4">

                            {/* Order Card */}
                            <div className="bg-white rounded-md shadow-md p-4 text-left">
                                   <div className="flex items-center gap-2">
                                          <p className="text-sm text-gray-500">Order ID</p>
                                          <p className="text-xl font-bold">#{orderId?.slice(-5)}</p>
                                   </div>

                                   {order ? (
                                          <div className="mt-3 space-y-2">
                                                 <p>
                                                        <span className="font-medium">Status:</span>{" "}
                                                        <span className={`px-2 py-1 rounded-full text-xs 
                                                        ${order.status === "Accepted" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                                                               {order.status}
                                                        </span>
                                                 </p>

                                                 <p>
                                                        <span className="font-medium">NGO:</span>{" "}
                                                        {order.acceptedBy?.name || "Not Assigned"}
                                                 </p>

                                                 <p>
                                                        <span className="font-medium">Food:</span> {order.food}
                                                 </p>

                                                 <p>
                                                        <span className="font-medium">Quantity:</span> {order.quantity}
                                                 </p>
                                          </div>
                                   ) : (
                                          <p className="mt-2 text-gray-400">Loading details...</p>
                                   )}
                            </div>


                            <div className="bg-white rounded-md shadow-md p-3">
                                   <h2 className="text-md font-semibold mb-2">Live Tracking</h2>

                                   <div className="rounded-xl overflow-hidden border">
                                          <LiveMap
                                                 foodLocation={foodLocation}
                                                 ngoLocation={ngoLocation}
                                          />
                                   </div>
                            </div>

                     </div>
              </div>
       );
};

export default Page;