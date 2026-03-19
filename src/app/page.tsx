import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import CoreFeaturesSection from '@/components/landing/CoreFeaturesSection';
import TrendingQuests from '@/components/landing/TrendingQuests';
import TopCollections from '@/components/landing/TopCollections';
import HowItWorks from '@/components/landing/HowItWorks';
import CtaSection from '@/components/landing/CtaSection';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: 'var(--hv-bg-base)',
        color: 'var(--hv-text-primary)',
      }}
    >
      <Navbar />
      <main>
        <HeroSection />
        <CoreFeaturesSection />
        <TrendingQuests />
        <TopCollections />
        <HowItWorks />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
