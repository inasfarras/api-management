'use client';

export default function ContactSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between">
      <div className="flex items-center">
        <span className="mr-2">📞</span>
        <p className="text-gray-800">Have any questions, feedback or need support? We'd love to hear from you!</p>
      </div>
      <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
        Contact us
      </button>
    </div>
  );
} 