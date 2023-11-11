import Home from "./pages/Home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import Music from "./pages/Music.tsx";
import { FourOhFour } from "./pages/404.tsx";

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <FourOhFour /> },
  { path: "/music", element: <Music /> },
]);

function App() {
  return (
    <>
      <CssBaseline />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
