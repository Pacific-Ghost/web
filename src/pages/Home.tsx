import Brand from "../components/Brand.tsx";
import Link from "../components/Link.tsx";
import { Grid } from "@mui/material";

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
          <Brand />
        </Grid>
        <Grid item xs={3} spacing={3}>
          <Link to="/music">music</Link> <Link to="/bio">bio</Link>{" "}
          <Link to="/contact">contact</Link> <Link to="/news">news</Link>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
