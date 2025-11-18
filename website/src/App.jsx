import {useState, useRef, useEffect} from "react";
import Toolbar from "./Toolbar";
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
    container.classList.add("flex", "items-center", "justify-center", "pt-6", "w-full");
    const imgElement = document.createElement("img");
    imgElement.src = img.src;
    imgElement.style.objectFit = "contain";
    // Use CSS classes for responsive sizing, only set explicit size on larger screens
    const isSmallScreen = window.innerWidth < 768;
    if (isSmallScreen) {
      imgElement.classList.add("w-full", "h-auto");
    } else {
      imgElement.style.width = `${width}px`;
      imgElement.style.height = `${height}px`;
      imgElement.classList.add("h-auto");
    }
    container.appendChild(imgElement);
    canvasRef.current.appendChild(container);
  };

  useEffect(() => {
    if (canvasRef.current && selectedImage) {
      const loadPromises =
        selectedImage.type === "painting"
          ? [loadImage(selectedImage.item.image), loadImage(selectedImage.item.bumps)]
          : [loadImage(selectedImage.item.image), Promise.resolve(null)];

      Promise.all(loadPromises).then(([img, bumps]) => {
        const t = img.width / img.height;
        // Calculate responsive sizes
        const isSmallScreen = window.innerWidth < 768; // md breakpoint
        const maxWidth = isSmallScreen ? window.innerWidth - 32 : 600; // Account for padding
        const maxHeight = isSmallScreen ? window.innerHeight * 0.4 : 600;

        let width = Math.min(maxWidth, img.width);
        let height = width / t;
        if (t < 1) {
          height = Math.min(maxHeight, img.height);
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
    container.classList.add("flex", "flex-col", "md:flex-row", "items-center", "justify-center", "gap-6", "md:gap-12", "w-full");

    // Make containers full width on small screens
    planeContainer.classList.add("w-full", "md:w-auto");
    sphereContainer.classList.add("w-full", "md:w-auto");

    canvasRef.current.appendChild(container);

    // Calculate responsive sizes
    const isSmallScreen = window.innerWidth < 768; // md breakpoint
    const screenWidth = window.innerWidth - 32; // Account for padding
    const screenHeight = window.innerHeight * 0.4;

    const filterWidth = isSmallScreen ? screenWidth : imageData.width;
    const filterHeight = isSmallScreen
      ? Math.min(screenHeight, (filterWidth / imageData.width) * imageData.height)
      : imageData.height;

    const generator = selectedAlgorithm.filter;
    const visualizer = selectedAlgorithm.visualizer;
    filterRef.current = visualizer({
      parent: planeContainer,
      width: ~~filterWidth,
      height: ~~filterHeight,
      image: imageData.img,
      onEnd: () => {},
      generator: generator,
      interpolate: selectedColorScheme.value,
    });
    filterRef.current.start();

    const sphereSize = isSmallScreen
      ? Math.min(screenWidth, screenHeight)
      : Math.max(imageData.width, imageData.height);
    sphereRef.current = sphere({
      parent: sphereContainer,
      width: ~~sphereSize,
      height: ~~sphereSize,
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
      <div className="container mx-auto h-full flex items-center justify-center my-6 md:my-12 px-4 max-w-full">
        <div ref={canvasRef} className="w-full max-w-full" />
      </div>
    </div>
  );
}

export default App;
