import Home from "./pages/Home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Music from "./pages/Music.tsx";
import { FourOhFour } from "./pages/404.tsx";
import { HelmetProvider } from "react-helmet-async";
import Bio from "./pages/Bio.tsx";
import News from "./pages/News.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <FourOhFour /> },
  { path: "/music", element: <Music /> },
  { path: "/bio", element: <Bio /> },
  { path: "/news", element: <News /> },
]);

function App() {
  return (
    <HelmetProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
