import {Grid, Typography} from "@mui/material";
import {Link} from "react-router-dom";

function Home() {
    return (
        <>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{minHeight: "100vh"}}
            >
                <Grid item xs={3}>
                    <Typography variant="h1" fontFamily={"Aerishhawk"}>Pacific Ghost</Typography>
                </Grid>
                <Grid item xs={3} spacing={3}>
                    <Link to="/music">music</Link> <Link to="/bio">bio</Link> <Link to="/contact">contact</Link>{" "}
                    <Link to="/news">news</Link>
                </Grid>
            </Grid>
        </>
    );
}

export default Home;
