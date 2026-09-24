import DayController from "@/components/DayController";
import StageLayer from "@/components/scene/StageLayer";
import Loader from "@/components/ui/Loader";
import Sundial from "@/components/ui/Sundial";
import Cursor from "@/components/ui/Cursor";
import Intro from "@/components/sections/Intro";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <DayController />
      <StageLayer />
      <Loader />
      <Sundial />
      <Cursor />
      <main className="relative z-10">
        <Intro />
        <About />
        <Works />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
