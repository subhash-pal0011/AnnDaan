"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, LocateFixed } from "lucide-react";

export default function GetLocation() {
       const [loading, setLoading] = useState(false);
       const router = useRouter();

       const saveLocation = async (lat, lng) => {
              try {
                     await axios.post("/api/user/update-location", {
                            location: {
                                   type: "Point",
                                   coordinates: [lng, lat],
                            },
                     });

                     toast.success("Location saved ");
                     router.push("/");
              } catch (err) {
                     toast.error("Failed to save location");
              }
       };

       const handleGPS = () => {
              if (!navigator.geolocation) {
                     toast.error("Geolocation not supported");
                     return;
              }

              setLoading(true);

              navigator.geolocation.getCurrentPosition(
                     (pos) => {
                            const { latitude, longitude } = pos.coords;
                            saveLocation(latitude, longitude);
                     },
                     (error) => {
                            console.log("get location error :" ,error)
                            toast.error("Permission denied");
                            setManual(true);
                            setLoading(false);
                     },
                     {
                            enableHighAccuracy: true,
                             maximumAge: 0,
                            timeout: 10000,
                     }
              );
       };


       return (
              <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-black via-gray-900 to-gray-800 px-4">

                     <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 w-full max-w-md text-center space-y-6 text-white"
                     >
                            <div className="flex justify-center">
                                   <div className="bg-white/20 p-4 rounded-full">
                                          <MapPin size={28} />
                                   </div>
                            </div>

                            <div>
                                   <h1 className="text-2xl font-bold">
                                          Enable Your Location 📍
                                   </h1>
                                   <p className="text-sm text-gray-300 mt-1">
                                          Find nearby NGOs instantly
                                   </p>
                            </div>

                            <button
                                   onClick={handleGPS}
                                   disabled={loading}
                                   className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                            >
                                   <LocateFixed size={18} />
                                   {loading ? "Getting Location..." : "Use Current Location"}
                            </button>

                            <p className="text-xs text-gray-400">
                                   Your location is safe & used only for NGO matching ❤️
                            </p>
                     </motion.div>
              </div>
       );
}