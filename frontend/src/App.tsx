import Navbar from './Components/Navbar'
import HeroSection from './Components/HeroSection'
import StatsBar from './Components/StatsBar'
import FeaturesGrid from './Components/FeaturesGrid'
import HowItWorks from './Components/HowItWorks'
import Testimonials from './Components/Testimonials'
import CtaBanner from './Components/CtaBanner'
import Footer from './Components/Footer'

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <main>
        <HeroSection />
        <StatsBar />
        <FeaturesGrid />
        <HowItWorks />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  )
}
