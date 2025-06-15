'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const MainPage = () => {
  const router = useRouter()
  useEffect(() => {
  router.push("/mainPage")
  }, [])
  
  return (
    <div>
      
    </div>
  )
}

export default MainPage
