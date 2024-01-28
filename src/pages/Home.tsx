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
          }}
        >
          <Box>
            <h1 className="glitch">Pacific Ghost</h1>
            <a href="mailto:hello@pacificghost.fm">contact</a>{" "}
             <a href="mailto:hello@pacificghost.fm">contact</a>
            <iframe
              style={{ border: 0, width: 350, height: 555 }}
              src="https://bandcamp.com/EmbeddedPlayer/album=1184904375/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/"
              seamless
            >
              <a href="https://pacificghost8675.bandcamp.com/album/the-hill">
                The Hill by Pacific Ghost
              </a>
            </iframe>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Home;
