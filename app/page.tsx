import { Dock } from "@/components/Dock";
import { Hero } from "@/components/Hero";
import { Masters } from "@/components/Masters";
import { Nav } from "@/components/Nav";
import { Prices } from "@/components/Prices";
import { Reviews } from "@/components/Reviews";
import { Scanner } from "@/components/Scanner";
import { Story } from "@/components/Story";
import { Visit } from "@/components/Visit";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Story />
        <Masters />
        <Prices />
        <Scanner />
        <Reviews />
        <Visit />
      </main>
      <Dock />
    </>
  );
}
