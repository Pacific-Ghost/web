import Home from "./pages/Home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Music from "./pages/Music.tsx";
import { FourOhFour } from "./pages/404.tsx";
import { HelmetProvider } from "react-helmet-async";
import Bio from "./pages/Bio.tsx";
import { Layout } from "./components/Layout.tsx";

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <FourOhFour />,
    children: [
      { path: "/", index: true, element: <Home /> },
      { path: "/music", element: <Music /> },
      { path: "/bio", element: <Bio /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}

export default App;
