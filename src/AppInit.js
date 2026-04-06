"use client"
import React from 'react'
import GetCurrentUser from './customHooks/GetCurrentUser'

const AppInit = ({ children }) => {
       return (
              <>
                     <GetCurrentUser />
                     {children}
              </>
       )
}

export default AppInit
