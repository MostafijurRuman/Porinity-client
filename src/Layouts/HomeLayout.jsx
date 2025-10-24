import React from 'react'
import Navbar from '../Components/Header/Navbar'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import Footer from '../Components/Footer/Footer'

export default function HomeLayout() {
  return (
    <>
      <Navbar/>
      {/* ✅ This resets scroll on every route change */}
      <ScrollRestoration />
      <Outlet/>
      <Footer/>
    </>
  )
}
