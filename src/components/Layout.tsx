import { NavLink, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="section py-6 flex items-center justify-between">
        <NavLink to="/" className="font-display text-2xl font-bold text-black hover:text-red transition-colors">
          Pacific Ghost
        </NavLink>
        <nav className="flex gap-8">
          <NavLink to="/music" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Music
          </NavLink>
          <NavLink to="/bio" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Bio
          </NavLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="section py-8 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Pacific Ghost
          </p>
          <a
            href="mailto:hello@pacificghost.fm"
            className="text-sm text-gray-500 hover:text-red transition-colors"
          >
            hello@pacificghost.fm
          </a>
        </div>
      </footer>
    </div>
  );
}
