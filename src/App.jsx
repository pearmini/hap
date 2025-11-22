import {useState, useRef, useEffect} from "react";
import {Github, Loader2} from "lucide-react";
import Toolbar from "./Toolbar";
import {sphere} from "./lib/sphere";
import {paintings, allPaintings} from "./paintings";
import {defaultScheme, allSchemes} from "./schemes";
import {defaultAlgorithm, allAlgorithms, algorithms} from "./algorithms";
import {examples} from "./examples";

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
  const [selectedImage, setSelectedImage] = useState({type: "painting", item: allPaintings[0]});
  const [uploadedImage, setUploadedImage] = useState(allPaintings[0].image);
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(defaultAlgorithm);
  const [selectedColorScheme, setSelectedColorScheme] = useState(defaultScheme);
  const filterRef = useRef(null);
  const canvasRef = useRef(null);
  const sphereRef = useRef(null);
  const shouldAutoPlayRef = useRef(false);
  const drawingAreaRef = useRef(null);

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
      setIsLoading(true);
      // Clear canvas while loading
      canvasRef.current.innerHTML = "";
      if (sphereRef.current) sphereRef.current.destroy();
      if (filterRef.current) filterRef.current.destroy();
      
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
        setIsLoading(false);
      }).catch((error) => {
        console.error("Error loading image:", error);
        setIsLoading(false);
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

  const handlePlay = async (selectedAlgorithm, colorSchemeOverride = null) => {
    if (!uploadedImage || !selectedAlgorithm || !canvasRef.current) return;
    canvasRef.current.innerHTML = "";
    if (sphereRef.current) sphereRef.current.destroy();
    if (filterRef.current) filterRef.current.destroy();

    const container = document.createElement("div");
    const planeContainer = document.createElement("div");
    const sphereContainer = document.createElement("div");
    container.appendChild(planeContainer);
    container.appendChild(sphereContainer);
    container.classList.add(
      "flex",
      "flex-col",
      "md:flex-row",
      "items-center",
      "justify-center",
      "gap-6",
      "md:gap-12",
      "w-full"
    );

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
    const colorSchemeToUse = colorSchemeOverride || selectedColorScheme;
    filterRef.current = visualizer({
      parent: planeContainer,
      width: ~~filterWidth,
      height: ~~filterHeight,
      image: imageData.img,
      onEnd: () => {},
      generator: generator,
      interpolate: colorSchemeToUse.value,
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

  const handleExampleClick = (example) => {
    // Find the algorithm by key
    const algorithm = allAlgorithms.find((algo) => algo.key === example.algorithmKey);
    if (!algorithm) return;

    // Find the color scheme by name
    const colorScheme = allSchemes.find((scheme) => scheme.name === example.paletteName);
    
    // Set both algorithm and color scheme
    setSelectedAlgorithm(algorithm);
    if (colorScheme) {
      setSelectedColorScheme(colorScheme);
    }

    // Scroll back to drawing area
    if (drawingAreaRef.current) {
      drawingAreaRef.current.scrollIntoView({behavior: "smooth", block: "start"});
    }

    // Auto-play when example is clicked (if imageData exists)
    if (imageData) {
      shouldAutoPlayRef.current = true;
      // Use the color scheme if found, otherwise use current one
      const schemeToUse = colorScheme || selectedColorScheme;
      handlePlay(algorithm, schemeToUse);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] transition-colors" style={{background: "black"}}>
      {/* Header */}
      <header className="bg-[#161b22] border-b border-[#30363d]">
        <div className="w-full px-4 py-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-[#c9d1d9] mb-1">HAP: Hackers and Painters</h1>
            <p className="text-sm text-[#8b949e]">Filter Images by Algorithm Visualizations with WebGL.</p>
          </div>
          <a
            href="https://github.com/pearmini/hap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8b949e] hover:text-[#c9d1d9] transition-colors"
            aria-label="GitHub repository"
          >
            <Github size={24} />
          </a>
        </div>
      </header>

      {/* Toolbar */}
      {uploadedImage && (
        <Toolbar
          paintings={paintings}
          allPaintings={allPaintings}
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
      <div ref={drawingAreaRef} className="container mx-auto h-full flex items-center justify-center my-6 md:my-12 px-4 max-w-full relative">
        <div ref={canvasRef} className="w-full max-w-full" />
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0d1117]/80 z-10">
            <Loader2 className="w-8 h-8 text-[#58a6ff] animate-spin mb-4" />
            <p className="text-[#8b949e] text-sm">Loading image...</p>
          </div>
        )}
      </div>

      {/* Examples Grid */}
      {examples.length > 0 && (
        <div className="container mx-auto px-4 pt-8 md:pt-12 pb-20 md:pb-32 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {examples.map((example, index) => {
              const algorithm = allAlgorithms.find((algo) => algo.key === example.algorithmKey);
              const algorithmName = algorithm?.name || example.algorithmKey;
              return (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="group relative overflow-hidden rounded-lg border border-[#30363d] hover:border-[#58a6ff] transition-all duration-200 bg-[#161b22] hover:bg-[#1c2128] cursor-pointer"
                >
                  <img
                    src={example.image}
                    alt={`Example: ${algorithmName} with ${example.paletteName}`}
                    className="w-full h-auto object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
                      <p className="text-xs text-white font-medium truncate">{algorithmName}</p>
                      <p className="text-xs text-white/80 truncate">{example.paletteName}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
