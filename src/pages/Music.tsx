import { Helmet } from "react-helmet-async";
import { Player } from "../components/Player.tsx";

function Music() {
  return (
    <>
      <Helmet title="Music - Pacific Ghost" />

      <section className="section py-16 md:py-24">
        <h1 className="heading-lg mb-4">Music</h1>
        <p className="body-text max-w-2xl mb-16">
          Stream our releases or grab them on Bandcamp to support independent music.
        </p>

        {/* Albums Grid */}
        <div className="grid gap-16">
          {/* The Hill */}
          <article className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
                2024 &middot; Album
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                The Hill
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our debut full-length. Five tracks that move from quiet
                introspection to walls of guitar, exploring memory, place, and
                the pull of somewhere else.
              </p>
              <a
                href="https://pacificghost8675.bandcamp.com/album/the-hill"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:text-red-dark transition-colors uppercase tracking-widest text-sm font-medium"
              >
                Buy on Bandcamp &rarr;
              </a>
            </div>
            <Player theme="light" style={{ height: 400 }} />
          </article>
        </div>
      </section>

      {/* Links Section */}
      <section className="section py-16 border-t border-gray-200">
        <h2 className="font-display text-2xl font-bold mb-8">Listen Everywhere</h2>
        <div className="flex flex-wrap gap-6">
          <a
            href="https://pacificghost8675.bandcamp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline"
          >
            Bandcamp
          </a>
          <a
            href="#"
            className="btn-outline opacity-50 cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            Spotify (Coming Soon)
          </a>
          <a
            href="#"
            className="btn-outline opacity-50 cursor-not-allowed"
            onClick={(e) => e.preventDefault()}
          >
            Apple Music (Coming Soon)
          </a>
        </div>
      </section>
    </>
  );
}

export default Music;
