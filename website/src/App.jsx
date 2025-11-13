import {useState, useRef, useEffect} from "react";
import ImageUpload from "./components/ImageUpload";
import Sidebar from "./components/Sidebar";
import * as cm from "charmingjs";
import * as ph from "./lib/index";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [algorithms, setAlgorithms] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    const hacker = ph.hacker();
    const styles = hacker.styles();
    setAlgorithms(styles);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      loadImage(uploadedImage).then((img) => {
        const t = img.width / img.height;
        const width = Math.min(800, img.width);
        const height = width / t;
        const ctx = cm.context2d({width: width, height: height});
        const canvas = ctx.canvas;
        ctx.drawImage(img, 0, 0, width, height);
        canvasRef.current.innerHTML = "";
        canvasRef.current.appendChild(canvas);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setImageData(imageData);
      });
    }
  }, [uploadedImage]);

  const handleSelectAlgorithm = (algo) => {
    if (!isProcessing) {
      setSelectedAlgorithm(algo);
      handlePlay(algo);
    }
  };

  const handlePlay = async (selectedAlgorithm) => {
    const canvasElement = canvasRef.current.children[0];
    if (!uploadedImage || !selectedAlgorithm || isProcessing || !canvasElement) return;
    setIsProcessing(true);
    try {
      const hacker = ph.hacker();
      hacker
        .canvas(canvasElement)
        .size([canvasElement.width, canvasElement.height])
        .imageData(imageData)
        .style(selectedAlgorithm.name)
        .end(() => {
          setIsProcessing(false);
        });
      hacker.start();
    } catch (error) {
      console.error("Error running visualization:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex">
      {uploadedImage && (
        <Sidebar algorithms={algorithms} selectedAlgorithm={selectedAlgorithm} onSelect={handleSelectAlgorithm} />
      )}
      <div className={`flex-1 flex items-center justify-center ${uploadedImage ? "ml-72" : ""}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">HAP: Hackers and Painters</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Filter World-famous Paintings by Algorithm Visualizations.
              </p>
            </div>
            {uploadedImage ? (
              <div className="relative group overflow-hidden  max-w-4xl min-w-[300px] mx-auto">
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
