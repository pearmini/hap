import {useState} from 'react';
import ImageUpload from './components/ImageUpload';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (imageData) => {
    setUploadedImage(imageData);
  };

  const handleClearImage = () => {
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex items-center justify-center">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              HAP: Hackers and Painters
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Filter Your Images by Algorithm Visualizations.
            </p>
          </div>
          {uploadedImage ? (
            <div className="relative group bg-white dark:bg-gray-800 overflow-hidden shadow-2xl max-w-4xl min-w-[300px] mx-auto">
              <div className="overflow-hidden max-h-[80vh] min-h-[200px] flex items-center justify-center">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-auto object-contain max-h-[80vh]"
                />
              </div>
              <button
                onClick={handleClearImage}
                className="absolute top-3 right-3 z-10 bg-gray-800/80 hover:bg-gray-900 dark:bg-gray-700/80 dark:hover:bg-gray-600 text-white rounded-full p-2 shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                aria-label="Clear image"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <ImageUpload onImageUpload={handleImageUpload} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
