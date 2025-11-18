import {schemes} from "../schemes";

const Toolbar = ({paintings, uploadedImages, selectedImage, onImageSelect, onImageUpload, algorithms, allAlgorithms, selectedAlgorithm, onSelect, colorSchemes: schemesProp, selectedColorScheme, onColorSchemeSelect, onPlay}) => {
  const handleAlgorithmChange = (e) => {
    const selectedKey = e.target.value;
    if (allAlgorithms && onSelect) {
      const algo = allAlgorithms.find((a) => a.key === selectedKey);
      if (algo) {
        onSelect(algo);
      }
    }
  };

  const handleImageChange = (e) => {
    const value = e.target.value;
    if (value.startsWith("painting-")) {
      const index = parseInt(value.replace("painting-", ""));
      if (index >= 0 && index < paintings.length && onImageSelect) {
        onImageSelect({type: "painting", item: paintings[index]});
      }
    } else if (value.startsWith("uploaded-")) {
      const index = parseInt(value.replace("uploaded-", ""));
      if (index >= 0 && index < uploadedImages.length && onImageSelect) {
        onImageSelect({type: "uploaded", item: uploadedImages[index]});
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleColorSchemeChange = (e) => {
    const selectedName = e.target.value;
    if (schemesProp && onColorSchemeSelect) {
      const scheme = schemesProp.find((s) => s.name === selectedName);
      if (scheme) {
        onColorSchemeSelect(scheme);
      }
    }
  };

  const handlePlay = () => {
    if (selectedAlgorithm && onPlay) {
      onPlay(selectedAlgorithm);
    }
  };

  const selectedAlgorithmKey = selectedAlgorithm ? selectedAlgorithm.key : "";
  const selectedImageValue = selectedImage
    ? selectedImage.type === "painting"
      ? `painting-${paintings.findIndex((p) => p.name === selectedImage.item.name)}`
      : `uploaded-${uploadedImages.findIndex((u) => u.name === selectedImage.item.name)}`
    : "";
  const selectedColorSchemeName = selectedColorScheme ? selectedColorScheme.name : "";

  if (!algorithms || algorithms.length === 0 || !paintings || paintings.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#161b22] border-b border-dashed border-[#30363d] py-2">
      <div className="container px-4 py-1.5">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePlay}
            disabled={!selectedAlgorithm}
            className="px-5 py-2.5 text-base  rounded-md text-white bg-black cursor-pointer hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:ring-offset-2 focus:ring-offset-[#161b22] transition-all flex items-center gap-2 shadow-lg shadow-black/30"
            style={{border: '1px solid #30363d'}}
            title="Start/Restart animation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <div className="h-6 w-px bg-[#30363d]"></div>
          <div className="flex items-center gap-2">
            <label htmlFor="image-select" className="text-sm font-medium text-[#c9d1d9]">
              Image:
            </label>
            <div className="flex items-center gap-1">
              <select
                id="image-select"
                value={selectedImageValue}
                onChange={handleImageChange}
                className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
              >
                {uploadedImages.length > 0 && (
                  <optgroup label="Uploaded" className="bg-[#0d1117] text-[#c9d1d9]">
                    {uploadedImages.map((img, index) => (
                      <option key={`uploaded-${index}`} value={`uploaded-${index}`} className="bg-[#0d1117] text-[#c9d1d9]">
                        {img.name}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="Paintings" className="bg-[#0d1117] text-[#c9d1d9]">
                  {paintings.map((painting, index) => (
                    <option key={`painting-${index}`} value={`painting-${index}`} className="bg-[#0d1117] text-[#c9d1d9]">
                      {painting.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <input
                type="file"
                id="image-upload-input"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload-input"
                className="px-2 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer hover:bg-[#161b22] hover:border-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb] transition-colors flex items-center"
                title="Upload image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm font-medium text-[#c9d1d9]">
              Algorithm:
            </label>
            <select
              id="algorithm-select"
              value={selectedAlgorithmKey}
              onChange={handleAlgorithmChange}
              className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
            >
              {algorithms.map((category) => (
                <optgroup key={category.category} label={category.category} className="bg-[#0d1117] text-[#c9d1d9]">
                  {category.algorithms.map((algo) => (
                    <option key={algo.metadata.key} value={algo.metadata.key} className="bg-[#0d1117] text-[#c9d1d9]">
                      {algo.metadata.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="color-select" className="text-sm font-medium text-[#c9d1d9]">
              Palette:
            </label>
            <select
              id="color-select"
              value={selectedColorSchemeName}
              onChange={handleColorSchemeChange}
              className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
            >
              {schemes.map((category) => (
                <optgroup key={category.category} label={category.category} className="bg-[#0d1117] text-[#c9d1d9]">
                  {category.schemes.map((scheme) => (
                    <option key={scheme.name} value={scheme.name} className="bg-[#0d1117] text-[#c9d1d9]">
                      {scheme.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
