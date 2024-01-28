import { Glitch } from "../components/Glitch.tsx";

function Home() {
  return (
    <>
      <div className="flex flex-col justify-center h-screen mx-auto px-6 sm:px-12 md:px-20 lg:px-36 xl:px-64">
        <div className="flex flex-col items-center md:items-end justify-center">
          <div>
            <Glitch>Pacific Ghost</Glitch>
            <div className="z-50 relative">
              <div className="mb-3.5">
                <a
                  href="mailto:hello@pacificghost.fm"
                  className="cursor-pointer"
                >
                  contact
                </a>{" "}
              </div>
              <div style={{ width: 350, height: 555 }}>
                <iframe
                  style={{ border: 0, width: "100%", height: "100%" }}
                  src="https://bandcamp.com/EmbeddedPlayer/album=1184904375/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/transparent=true/"
                  seamless
                >
                  <a href="https://pacificghost8675.bandcamp.com/album/the-hill">
                    The Hill by Pacific Ghost
                  </a>
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
