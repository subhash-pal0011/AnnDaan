"use client"
import { setUserData } from "@/redux/userSlice"
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

const GetCurrentUser = () => {

       const dispatch = useDispatch()

       useEffect(() => {
              const fetchUser = async () => {
                     try {
                            const res = await axios.get("/api/currentUser")

                            if (res.data.success) {
                                   dispatch(setUserData(res.data.data))
                            }
                     } catch (error) {
                            console.log("get current-user error:", error)
                     }
              }

              fetchUser()
       }, [dispatch]) 

       return null 
}

export default GetCurrentUser
