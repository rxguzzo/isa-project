import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/layout/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ContactForm } from "@/components/home/ContactForm";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AboutSection />
      <FeaturesSection />
      <ContactForm />
      <Footer />
    </main>
  );
}
