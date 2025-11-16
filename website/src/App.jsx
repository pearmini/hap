import {useState, useRef, useEffect} from "react";
import ImageUpload from "./components/ImageUpload";
import Toolbar from "./components/Toolbar";
import * as Filter from "./lib/index";

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return new Promise((resolve, reject) => {
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
  });
}

function App() {
  const [uploadedImage, setUploadedImage] = useState("starry-night.png");
  const [imageData, setImageData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const [algorithms, setAlgorithms] = useState([]);
  const filterRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    setAlgorithms(Object.values(Filter).map((filter) => filter.metadata));
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      loadImage(uploadedImage).then((img) => {
        const t = img.width / img.height;
        const width = Math.min(800, img.width);
        const height = width / t;
        setImageData({img, width: ~~width, height: ~~height});
      });
    }
  }, [uploadedImage]);

  const handleSelectAlgorithm = (algo, index) => {
    if (filterRef.current) {
      filterRef.current.destroy();
    }
    setSelectedAlgorithm(algo);
    handlePlay(algo);
  };

  const handlePlay = async (selectedAlgorithm) => {
    if (!uploadedImage || !selectedAlgorithm || !canvasRef.current) return;
    canvasRef.current.innerHTML = "";
    const generator = Filter[selectedAlgorithm.key];
    const visualizer = selectedAlgorithm.visualizer;
    filterRef.current = visualizer({
      parent: canvasRef.current,
      width: imageData.width,
      height: imageData.height,
      image: imageData.img,
      onEnd: () => {},
      generator: generator,
    });
    filterRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (filterRef.current) {
        filterRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] transition-colors">
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d]">
        <div className="container  px-4 py-2">
          <h1 className="text-xl font-bold text-[#c9d1d9] mb-1">HAP: Hackers and Painters</h1>
          <p className="text-sm text-[#8b949e]">
            Filter World-famous Paintings or Images by Algorithm Visualizations.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      {uploadedImage && (
        <Toolbar algorithms={algorithms} selectedAlgorithm={selectedAlgorithm} onSelect={handleSelectAlgorithm} />
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center pt-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {uploadedImage ? (
              <div className="relative group overflow-hidden max-w-4xl min-w-[300px] mx-auto">
                <div className="overflow-hidden flex items-center justify-center relative">
                  <div ref={canvasRef} />
                </div>
              </div>
            ) : (
              <ImageUpload onImageUpload={setUploadedImage} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
