import React from "react";
import { Link } from "gatsby";

const Header = () => (
  <header className="bg-gray-800 text-white shadow mb-6">
    <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
      <div className="font-bold text-xl">
        <Link to="/" className="hover:text-gray-300">Cost of Software</Link>
      </div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/roi-calculator" className="hover:text-gray-300">ROI Calculator</Link>
        </li>
        <li>
          <Link to="/weighted-scoring" className="hover:text-gray-300">Weighted Scoring</Link>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
