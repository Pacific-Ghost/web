import Brand from "../components/Brand.tsx";
import Link from "../components/Link.tsx";
import { Grid } from "@mui/material";
import { PropsWithChildren } from "react";
import { LinkProps } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Home() {
  const handleContactClick = (e: any) => {
    e.preventDefault();
    window.location.href = "mailto:hello@pacificghost.fm";
  };

  return (
    <>
      <Helmet title="Pacific Ghost - Home" />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Brand>
            <HomeNavLink to="/music">music</HomeNavLink>
            <HomeNavLink to="/bio">bio</HomeNavLink>
            <HomeNavLink to="#" onClick={handleContactClick}>
              contact
            </HomeNavLink>
            <HomeNavLink to="/news">news</HomeNavLink>
          </Brand>
        </Grid>
      </Grid>
    </>
  );
}

function HomeNavLink({ children, ...rest }: PropsWithChildren<LinkProps>) {
  return (
    <Link className="mx-5 text-xl" {...rest}>
      {children}
    </Link>
  );
}

export default Home;
