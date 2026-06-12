import Navbar from '@/components/Navbar';
import Intro from '@/components/Intro';
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
        {/* Scroll-over container: the Intro statement stays pinned while the
            dark content scrolls up over it. On scroll the statement spins,
            its letters scatter apart and it fades away. */}
        <div className="scroll-over-wrapper">
          <div className="sticky-hero">
            <Intro />
          </div>

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
