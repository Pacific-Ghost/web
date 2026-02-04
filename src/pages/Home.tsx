import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Player } from "../components/Player.tsx";

function Home() {
  return (
    <>
      <Helmet title="Pacific Ghost" />

      {/* Hero Section */}
      <section className="section py-20 md:py-32">
        <div className="max-w-5xl">
          <h1 className="heading-display mb-8">
            Pacific<br />
            <span className="text-red">Ghost</span>
          </h1>
          <p className="body-text max-w-xl mb-10 text-balance">
            Indie rock from the edge of the coast. Melancholic melodies,
            driving guitars, and songs about the spaces between.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/music" className="btn">
              Listen Now
            </Link>
            <a
              href="https://pacificghost8675.bandcamp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              Bandcamp
            </a>
          </div>
        </div>
      </section>

      {/* Featured Album */}
      <section className="section py-16 bg-black text-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-400 mb-4">
              Latest Release
            </p>
            <h2 className="font-display text-display-lg text-white mb-6">
              The Hill
            </h2>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              Our debut album. Five tracks exploring memory, place, and the
              pull of somewhere else.
            </p>
            <Link to="/music" className="text-red hover:text-white transition-colors uppercase tracking-widest text-sm font-medium">
              View All Music &rarr;
            </Link>
          </div>
          <div className="flex justify-center md:justify-end">
            <Player style={{ width: 350, height: 470 }} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
