import Hero from '@/components/public/Hero'
import FindMarketSection from '@/components/public/FindMarketSection'
import FeaturedProductsSection from '@/components/public/FeaturedProductsSection'
import ForFarmersSection from '@/components/public/ForFarmersSection'
import HowItWorksSection from '@/components/public/HowItWorksSection'
import StatsTestimonialSection from '@/components/public/StatsTestimonialSection'
import CtaBannerSection from '@/components/public/CtaBannerSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FindMarketSection />
      <FeaturedProductsSection />
      <ForFarmersSection />
      <HowItWorksSection />
      <StatsTestimonialSection />
      <CtaBannerSection />
    </>
  )
}