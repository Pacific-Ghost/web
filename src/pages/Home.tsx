import { Glitch } from "../components/Glitch.tsx";
import {Player} from "../components/Player.tsx";

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
              <Player style={{ width: 350, height: 555 }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
