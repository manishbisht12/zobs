import { useEffect, useState } from 'react';
import { Search, MapPin } from 'lucide-react';

export default function Home({
  onSearch,
  initialSearch = '',
  initialLocation = '',
}) {
  const [searchValue, setSearchValue] = useState(initialSearch);
  const [locationValue, setLocationValue] = useState(initialLocation);

  useEffect(() => {
    setSearchValue(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setLocationValue(initialLocation);
  }, [initialLocation]);

  const handleSubmit = () => {
    onSearch?.({
      search: searchValue.trim(),
      location: locationValue.trim(),
    });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <div className="bg-purple-800 rounded-2xl shadow-2xl mx-4 sm:mx-8 md:mx-12 lg:mx-16 w-full max-w-7xl px-8 py-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="flex flex-col items-center justify-center">
          {/* Heading Section */}
          <div className="text-center mb-7">
            <h1 className="text-white text-4xl sm:text-5xl font-bold mb-3">
              Over 5000+ Jobs to Apply
            </h1>
            <p className="text-white text-base opacity-90">
              Find the perfect job that matches your skills, passion, and career aspirations in one place.
            </p>
          </div>

          {/* Search Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-4xl">
            {/* Job Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search for jobs"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 text-base rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Location Input */}
            <div className="relative flex-1 w-full">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Location"
                value={locationValue}
                onChange={(event) => setLocationValue(event.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-3 text-base rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white text-gray-700 placeholder-gray-500"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white font-semibold text-base px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap shadow-md cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
