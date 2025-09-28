import React from 'react'
import HeroSlider from '../../Components/Hero/HeroSlider'
import SixPremiumBiodat from '../../Components/SixPremiumBiodata/SixPremiumBiodat'
import HowItWorks from '../../Components/HowItWorks/HowItWorks'
import SuccessCounters from '../../Components/SuccessCounters/SuccessCounters'
import SuccessStories from '../../Components/SuccessStories/SuccessStories'

export default function Home() {
  return (
    <main className="flex flex-col">
    <HeroSlider />
    <SixPremiumBiodat />
    <HowItWorks />
    <SuccessCounters />
    <SuccessStories />

    </main>
  )
}
