import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function FourOhFour() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center section">
      <Helmet title="Not Found - Pacific Ghost" />
      <h1 className="font-display text-8xl font-bold text-red mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">This page doesn't exist.</p>
      <Link to="/" className="btn">
        Back Home
      </Link>
    </div>
  );
}
