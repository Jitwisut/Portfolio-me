import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';

export default function Home() {
  return (
    <SmoothScroll>
      <Navbar />
      <main>
        {/* Scroll-over container: Hero stays sticky, dark content scrolls over it */}
        <div className="scroll-over-wrapper">
          {/* This section stays pinned at top */}
          <div className="sticky-hero">
            <Hero />
          </div>

          {/* This dark section scrolls UP over the hero */}
          <div className="overlay-content">
            <About />
            <Skills />
            <Projects />
            <Contact />
            <Footer />
          </div>
        </div>
      </main>
    </SmoothScroll>
  );
}
