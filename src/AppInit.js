// "use client"
// import React from 'react'
// import GetCurrentUser from './customHooks/GetCurrentUser'

// const AppInit = ({ children }) => {
//        return (
//               <>
//                      <GetCurrentUser />
//                      {children}
//               </>
//        )
// }

// export default AppInit


"use client";
import React, { useEffect } from "react";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import { useSelector } from "react-redux";
import { socketConnection } from "./lib/socketConnection";

const AppInit = ({ children }) => {
       const userId = useSelector((state) => state.user.userData?._id);

       useEffect(() => {
              if (!userId) return;

              const socket = socketConnection();

              const handleConnect = () => {
                     socket.emit("userId", userId);
              };

              socket.on("connect", handleConnect);

              if (socket.connected) {
                     handleConnect();
              }

              return () => {
                     socket.off("connect", handleConnect);
              };
       }, [userId]);

       return (
              <>
                     <GetCurrentUser />
                     {children}
              </>
       );
};

export default AppInit;