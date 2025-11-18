import {useState, useRef, useEffect} from "react";
import ImageUpload from "./components/ImageUpload";
import Toolbar from "./components/Toolbar";
import * as Filter from "./lib/index";
import {sphere} from "./lib/sphere";
import {paintings} from "./paintings";
import {defaultScheme, allSchemes} from "./schemes";
import {defaultAlgorithm, allAlgorithms, algorithms} from "./algorithms";

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
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState({type: "painting", item: paintings[0]});
  const [uploadedImage, setUploadedImage] = useState(paintings[0].image);
  const [imageData, setImageData] = useState(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(defaultAlgorithm);
  const [selectedColorScheme, setSelectedColorScheme] = useState(defaultScheme);
  const filterRef = useRef(null);
  const canvasRef = useRef(null);
  const sphereRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);

  const displayRawImage = (img, width, height) => {
    if (!canvasRef.current) return;
    canvasRef.current.innerHTML = "";
    if (sphereRef.current) sphereRef.current.destroy();
    if (filterRef.current) filterRef.current.destroy();

    const container = document.createElement("div");
    container.classList.add("flex", "items-center", "justify-center", "pt-6");
    const imgElement = document.createElement("img");
    imgElement.src = img.src;
    imgElement.style.width = `${width}px`;
    imgElement.style.height = `${height}px`;
    imgElement.style.objectFit = "contain";
    container.appendChild(imgElement);
    canvasRef.current.appendChild(container);
  };

  useEffect(() => {
    if (canvasRef.current && selectedImage) {
      const loadPromises = selectedImage.type === "painting"
        ? [loadImage(selectedImage.item.image), loadImage(selectedImage.item.bumps)]
        : [loadImage(selectedImage.item.image), Promise.resolve(null)];

      Promise.all(loadPromises).then(([img, bumps]) => {
        const t = img.width / img.height;
        let width = Math.min(600, img.width);
        let height = width / t;
        if (t < 1) {
          height = Math.min(600, img.height);
          width = height * t;
        }
        setImageData({img, width: ~~width, height: ~~height, bumps});
        setUploadedImage(selectedImage.item.image);
        // Display the raw image when image changes
        displayRawImage(img, ~~width, ~~height);
        // Don't auto-play when image changes - user needs to click play
        shouldAutoPlayRef.current = false;
      });
    }
  }, [selectedImage]);

  const handleSelectAlgorithm = (algo) => {
    if (filterRef.current) {
      filterRef.current.destroy();
    }
    setSelectedAlgorithm(algo);
    // Auto-play when algorithm changes
    shouldAutoPlayRef.current = true;
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

    const generator = selectedAlgorithm.filter;
    const visualizer = selectedAlgorithm.visualizer;
    filterRef.current = visualizer({
      parent: planeContainer,
      width: imageData.width,
      height: imageData.height,
      image: imageData.img,
      onEnd: () => {},
      generator: generator,
      interpolate: selectedColorScheme.value,
    });
    filterRef.current.start();

    const size = Math.max(imageData.width, imageData.height);
    sphereRef.current = sphere({
      parent: sphereContainer,
      width: size,
      height: size,
      filterFBO: filterRef.current.filter,
      bumps: imageData.bumps || null,
    });
    sphereRef.current.start();
  };

  // Restart animation when color scheme changes (if animation is already running)
  useEffect(() => {
    if (filterRef.current && selectedAlgorithm && imageData) {
      // Restart with new color scheme
      handlePlay(selectedAlgorithm);
    }
  }, [selectedColorScheme]);

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
          <p className="text-sm text-[#8b949e]">Filter Paintings by Algorithm Visualizations with WebGL.</p>
        </div>
      </header>

      {/* Toolbar */}
      {uploadedImage && (
        <Toolbar
          paintings={paintings}
          uploadedImages={uploadedImages}
          selectedImage={selectedImage}
          onImageSelect={(image) => {
            setSelectedImage(image);
            // Reset to show raw image, require play button click
            shouldAutoPlayRef.current = false;
          }}
          onImageUpload={(imageDataUrl) => {
            const newImage = {
              name: `Uploaded ${uploadedImages.length + 1}`,
              image: imageDataUrl,
              bumps: null,
            };
            setUploadedImages([...uploadedImages, newImage]);
            setSelectedImage({type: "uploaded", item: newImage});
          }}
          algorithms={algorithms}
          allAlgorithms={allAlgorithms}
          selectedAlgorithm={selectedAlgorithm}
          onSelect={handleSelectAlgorithm}
          colorSchemes={allSchemes}
          selectedColorScheme={selectedColorScheme}
          onColorSchemeSelect={setSelectedColorScheme}
          onPlay={(algo) => {
            shouldAutoPlayRef.current = true;
            handlePlay(algo || selectedAlgorithm);
          }}
        />
      )}

      {/* Main Content */}
      <div className="container mx-auto h-full flex items-center justify-center my-12">
        {uploadedImage ? <div ref={canvasRef} /> : <ImageUpload onImageUpload={setUploadedImage} />}
      </div>
    </div>
  );
}

export default App;
