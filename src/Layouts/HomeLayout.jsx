import React from 'react'
import Navbar from '../Components/Header/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../Components/Footer/Footer'

export default function HomeLayout() {
  return (
    <>
      <Navbar/>
      <Outlet/>
      <Footer/>
    </>
  )
}
