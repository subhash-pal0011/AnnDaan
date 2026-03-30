"use client"
import RegisterForm from '@/component/RegisterForm'
import WelcomePage from '@/component/WelcomePage'
import React, { useState } from 'react'

const page = () => {
  const [step , setStep] = useState(1)
  return (
    <div>
      {step==1 ? <WelcomePage nextStep={setStep}/> : <RegisterForm/>}
    </div>
  )
}

export default page
