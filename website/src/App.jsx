import {useState, useRef, useEffect} from "react";
import ImageUpload from "./components/ImageUpload";
import Toolbar from "./components/Toolbar";
import * as Filter from "./lib/index";
import {sphere} from "./lib/sphere";

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
  const sphereRef = useRef(null);

  useEffect(() => {
    setAlgorithms(Object.values(Filter).map((filter) => filter.metadata));
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      loadImage(uploadedImage).then((img) => {
        const t = img.width / img.height;
        const width = Math.min(600, img.width);
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
    if (sphereRef.current) sphereRef.current.destroy();
    if (filterRef.current) filterRef.current.destroy();

    const container = document.createElement("div");
    const planeContainer = document.createElement("div");
    const sphereContainer = document.createElement("div");
    container.appendChild(planeContainer);
    container.appendChild(sphereContainer);
    container.classList.add("flex", "items-center", "gap-12");
    canvasRef.current.appendChild(container);

    const generator = Filter[selectedAlgorithm.key];
    const visualizer = selectedAlgorithm.visualizer;
    filterRef.current = visualizer({
      parent: planeContainer,
      width: imageData.width,
      height: imageData.height,
      image: imageData.img,
      onEnd: () => {},
      generator: generator,
    });
    filterRef.current.start();

    sphereRef.current = sphere({
      parent: sphereContainer,
      width: imageData.width,
      height: imageData.width,
      image: imageData.img,
    });
    sphereRef.current.start();
  };

  useEffect(() => {
    return () => {
      if (filterRef.current) filterRef.current.destroy();
      if (sphereRef.current) sphereRef.current.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1117] transition-colors" style={{background: "black"}}>
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d]">
        <div className="container  px-4 py-2">
          <h1 className="text-xl font-bold text-[#c9d1d9] mb-1">HAP: Hackers and Painters</h1>
          <p className="text-sm text-[#8b949e]">Filter Paintings or Images by Algorithm Visualizations with WebGL.</p>
        </div>
      </header>

      {/* Toolbar */}
      {uploadedImage && (
        <Toolbar algorithms={algorithms} selectedAlgorithm={selectedAlgorithm} onSelect={handleSelectAlgorithm} />
      )}

      {/* Main Content */}
      <div className="container mx-auto h-full flex items-center justify-center my-12">
        {uploadedImage ? <div ref={canvasRef} /> : <ImageUpload onImageUpload={setUploadedImage} />}
      </div>
    </div>
  );
}

export default App;
