import {
  HeroSection,
  FeaturesSection,
  PricingSection,
  CtaSection,
  Footer,
} from '@/src/widgets/landing';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
