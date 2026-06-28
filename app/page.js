import Navbar from '@/components/Navbar';
import ScrollProgress from '@/components/ScrollProgress';
import SiloReveal from '@/components/SiloReveal';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <SiloReveal><About /></SiloReveal>
      <SiloReveal><Experience /></SiloReveal>
      <SiloReveal><Projects /></SiloReveal>
      <SiloReveal><Skills /></SiloReveal>
      <SiloReveal><Contact /></SiloReveal>
      <Footer />
    </main>
  );
}
