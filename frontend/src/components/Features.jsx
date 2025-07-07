import React from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Save Hours of Reading",
    description: "Summarize long articles, research papers, or essays into bite-sized summaries that deliver key points instantly.",
  },
  {
    title: "Smart Tone Matching",
    description: "Tailor your summaries to sound formal, casual, or even bullet-style — perfect for school, work, or fun!",
  },
  {
    title: "One-Click Translation",
    description: "Translate your summaries into multiple Indian languages instantly. Great for accessibility and diverse users.",
  },
];

const FeatureSection = () => {
  return (
    <section className="bg-[#8e7ab5] py-16 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Side: Text and CTA */}
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-pink-200 mb-4">Why Use Our Summarizer?</h2>
          <p className="text-gray-100 mb-6">
            Whether you're a student, professional, or a curious reader — our AI-powered summarizer helps you focus on what truly matters.
          </p>
          <Link to="/register">
            <button className="bg-gray-100 hover:bg-green-600 text-gray-600 font-semibold px-6 py-3 rounded shadow-md transition">
              ✨ Register Now
            </button>
          </Link>
        </div>

        {/* Right Side: Features */}
        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="bg-pink-200 rounded-full p-2">
                <svg className="w-5 h-5 text-green-800" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11l5 3-5 3V7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-md font-semibold text-pink-200">{feature.title}</h3>
                <p className="text-sm text-gray-100">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
