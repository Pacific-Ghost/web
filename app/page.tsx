import Marquee from "react-fast-marquee";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between min-h-screen p-24">
      <Marquee className="min-h-screen text-9xl" direction="right">
        Coming very soon...
      </Marquee>
    </main>
  );
}
