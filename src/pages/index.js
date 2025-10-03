import React from 'react';
import { Link } from 'gatsby';
import Header from '../components/Header';

export default function IndexPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Cost of Software Tools
          </h1>
            <p className="text-gray-600 text-lg">
                A set of tools to help you save on napkins for calculations. Have questions or want to connect? Find me on&nbsp;
                <a
                  href="https://www.linkedin.com/in/alex-mcclure-64514151/"
                  className="text-blue-600 font-semibold underline hover:text-blue-800 transition-colors duration-200 ml-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
            </p>
          <nav className="flex flex-col gap-4">
            <Link
              to="/roi-calculator"
              className="text-blue-600 hover:underline text-lg font-medium"
            >
              Process Optimization ROI Calculator
            </Link>
            <Link
              to="/weighted-scoring"
              className="text-blue-600 hover:underline text-lg font-medium"
            >
              Weighted Scoring Model
            </Link>
          </nav>
        </div>
      </main>
    </div>
  );
}
