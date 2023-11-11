import { Grid, Link, Typography } from "@mui/material";

function Home() {
  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Typography variant="h1">Pacific Ghost</Typography>
        </Grid>
        <Grid item xs={3} spacing={3}>
          <Link>music</Link> <Link>bio</Link> <Link>contact</Link>{" "}
          <Link>news</Link>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
