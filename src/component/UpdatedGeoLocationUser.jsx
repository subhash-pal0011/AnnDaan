"use client"
import { socketConnection } from '@/lib/socketConnection'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const UpdatedGeoLocationUser = () => {

       const { userData } = useSelector((state) => state.user)
       const userId = userData?._id

       useEffect(() => {
              if (!userId) return

              const socket = socketConnection()

              socket.emit("userId", userId)

              if (!navigator.geolocation) {
                     console.error("Geolocation not supported")
                     return
              }

              // watchPosition HAR 2 ,5 M MEA LOCTION FIND KRTA RHATA HII
              const watcher = navigator.geolocation.watchPosition((pos) => {
                     socket.emit("updated-location", {
                            userId,
                            latitude: pos.coords.latitude,
                            longitude: pos.coords.longitude
                     })
              }, (error) => { console.error(error.message) },
                     { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
              )

              return () => {
                     navigator.geolocation.clearWatch(watcher)
              }

       }, [userId])

       return null
}

export default UpdatedGeoLocationUser

