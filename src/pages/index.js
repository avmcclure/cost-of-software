import React from 'react';
import { Link } from 'gatsby';

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-12">
      <div className="max-w-xl w-full bg-white shadow-md rounded-xl p-8 flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Cost of Software Tools
        </h1>
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
        <p className="mt-8 text-gray-600">Select a tool above to begin.</p>
      </div>
    </div>
  );
}
