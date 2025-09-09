import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />

      {/* outras seções da sua Landing Page
        no futuro, como:
        
        <AboutSection />
        <FeaturesSection />
        <ContactForm />
        <Footer />
      */}

    </main>
  );
}