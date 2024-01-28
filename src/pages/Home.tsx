import { Box, Container } from "@mui/material";

function Home() {
  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: 'center',
            height: '100vh'
          }}
        >
          <Box>
            <div className="glitch">
              <h1 className="glitch text-7xl" data-text="Pacific Ghost">
                Pacific Ghost
              </h1>
              <h1 className="glow text-7xl">Pacific Ghost</h1>
            </div>
            <div className="scanlines"></div>
            <div className="z-50 relative">
              <div className="mb-3.5">
                <a href="mailto:hello@pacificghost.fm" className="cursor-pointer">contact</a>{" "}
              </div>
              <iframe
                  style={{border: 0, width: 350, height: 555}}
                  src="https://bandcamp.com/EmbeddedPlayer/album=1184904375/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=true/transparent=true/"
                  seamless
              >
                <a href="https://pacificghost8675.bandcamp.com/album/the-hill">
                  The Hill by Pacific Ghost
                </a>
              </iframe>
            </div>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;
