import React from 'react'
import HeroSlider from '../../Components/Hero/HeroSlider'
import SixPremiumBiodat from '../../Components/SixPremiumBiodata/SixPremiumBiodat'

export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroSlider />
      <SixPremiumBiodat />
    </main>
  )
}
