"use client";
import React, { useState, useEffect } from "react";
import L from "leaflet";
import {
       MapContainer,
       Marker,
       TileLayer,
       Popup,
       Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Custom Icon
const customIcon = L.icon({
       iconUrl: "/location.gif",
       iconSize: [40, 40],
});

const customIcon2 = L.icon({
       iconUrl: "/DeliveryBike.gif",
       iconSize: [50, 50],
});

const LiveMap = ({ foodLocation, ngoLocation }) => {
       const [position, setPosition] = useState(null);



       // console.log("foodLocation :", foodLocation);
       // console.log("ngoLocation :", ngoLocation);


       useEffect(() => {
              if (ngoLocation?.latitude && ngoLocation?.longitude) {
                     setPosition([ngoLocation.latitude, ngoLocation.longitude]);
              } else if (foodLocation?.latitude && foodLocation?.longitude) {
                     setPosition([foodLocation.latitude, foodLocation.longitude]);
              }
       }, [foodLocation, ngoLocation]);

       // ✅ Loading UI
       if (!position) {
              return (
                     <div className="flex items-center justify-center h-75 gap-2">
                            <img src="/map.gif" className="h-10" />
                            <p className="font-semibold">Loading map...</p>
                     </div>
              );
       }

       return (
              <div className="w-full">
                     <MapContainer
                            center={position}
                            zoom={13}
                            scrollWheelZoom={true}
                            className="h-75 md:h-80 w-full rounded-lg"
                     >
                            <TileLayer
                                   attribution="&copy; OpenStreetMap contributors"
                                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />


                            {ngoLocation?.latitude && (
                                   <Marker
                                          position={[ngoLocation.latitude, ngoLocation.longitude]}
                                          icon={customIcon2}
                                   >
                                          <Popup>🏢 NGO Location</Popup>
                                   </Marker>
                            )}

                            {/* ✅ Food Marker */}
                            {foodLocation?.latitude && (
                                   <Marker
                                          position={[foodLocation.latitude, foodLocation.longitude]}
                                          icon={customIcon}
                                   >
                                          <Popup>🍱 Food Location</Popup>
                                   </Marker>
                            )}

                            {foodLocation?.latitude && ngoLocation?.latitude && (
                                   <Polyline
                                          positions={[
                                                 [foodLocation.latitude, foodLocation.longitude],
                                                 [ngoLocation.latitude, ngoLocation.longitude],
                                          ]}
                                          color="green"
                                   />
                            )}
                     </MapContainer>
              </div>
       );
};

export default LiveMap;