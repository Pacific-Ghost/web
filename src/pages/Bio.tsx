import { Helmet } from "react-helmet-async";

function Bio() {
  return (
    <>
      <Helmet title="Bio - Pacific Ghost" />

      <section className="section py-16 md:py-24">
        <div className="max-w-3xl">
          <h1 className="heading-lg mb-12">Bio</h1>

          <div className="space-y-6 body-text">
            <p>
              <strong className="font-display text-2xl text-black">Pacific Ghost</strong> is
              an indie rock project born from late-night recordings and the
              persistent hum of the Pacific coast.
            </p>

            <p>
              We make music that lives in the space between shoegaze walls and
              stripped-back folk, drawing from the isolation of empty beaches
              and the restlessness of late-night drives.
            </p>

            <p>
              Our sound is built on layers of guitar, intimate vocals, and
              melodies that stick around longer than they should. The songs are
              about memory, distance, and the places that stay with you even
              after you leave.
            </p>

            <p>
              We release music independently through Bandcamp because we believe
              in direct connection between artists and listeners, without the
              noise in between.
            </p>
          </div>

          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="font-display text-2xl font-bold mb-6">Contact</h2>
            <p className="text-gray-600 mb-4">
              For booking, press, or just to say hello:
            </p>
            <a
              href="mailto:hello@pacificghost.fm"
              className="text-red hover:text-red-dark transition-colors text-lg font-medium"
            >
              hello@pacificghost.fm
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Bio;
