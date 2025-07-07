import React from 'react';

const Highlights = () => {
  const highlights = [
    {
      name: 'Aarav Sharma',
      country: 'India',
      testimonial: 'Summarizer saved me hours on my research paper! The summary was accurate and helped me focus on the key points.',
      rating: 5,
    },
    {
      name: 'Sofia R.',
      country: 'Spain',
      testimonial: 'I use this tool for every long blog I read. It gives me the gist in seconds!',
      rating: 4,
    },
    {
      name: 'Daniel K.',
      country: 'USA',
      testimonial: 'Perfect for summarizing client documents. Helps me get to the point quickly.',
      rating: 5,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Why People Love Our Summarizer</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {highlights.map((h, i) => (
          <div key={i} className="bg-white shadow-md p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold">{h.name}</p>
                <p className="text-sm text-gray-500">{h.country}</p>
              </div>
            </div>
            <div className="flex mb-2 text-yellow-400">
              {'★'.repeat(h.rating)}{'☆'.repeat(5 - h.rating)}
            </div>
            <p className="text-gray-700 text-sm">{h.testimonial}</p>
          </div>
        ))}
      </div>

      {/* Example card */}
      <div className="mt-12 grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Before & After Summary</h3>
          <p className="text-sm text-gray-600 mb-2"><strong>Original:</strong> "The Industrial Revolution was a period of major industrialization that took place during the late 1700s and early 1800s..."</p>
          <p className="text-sm text-gray-800"><strong>Summary:</strong> "The Industrial Revolution marked a shift to industrial economies in the 18th–19th centuries."</p>
        </div>
        <div className="bg-gray-200 h-48 rounded-lg flex justify-center items-center text-gray-500 text-sm">
          📽️ <span className="ml-2">Watch how it works</span>
        </div>
      </div>

      <div className="text-center mt-10">
        <button className="px-6 py-3 bg-[#8e7ab5] hover:bg-[#b784b7] text-white font-semibold rounded-md shadow-md transition">
          See More Highlights
        </button>
      </div>
    </section>
  );
};

export default Highlights;
