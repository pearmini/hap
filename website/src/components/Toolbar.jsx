import {schemes} from "../schemes";

const Toolbar = ({paintings, selectedPainting, onPaintingSelect, algorithms, allAlgorithms, selectedAlgorithm, onSelect, colorSchemes: schemesProp, selectedColorScheme, onColorSchemeSelect, onPlay}) => {
  const handleAlgorithmChange = (e) => {
    const selectedKey = e.target.value;
    if (allAlgorithms && onSelect) {
      const algo = allAlgorithms.find((a) => a.key === selectedKey);
      if (algo) {
        onSelect(algo);
      }
    }
  };

  const handlePaintingChange = (e) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < paintings.length && onPaintingSelect) {
      onPaintingSelect(paintings[selectedIndex]);
    }
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
  const selectedPaintingIndex =
    selectedPainting && paintings ? paintings.findIndex((p) => p.name === selectedPainting.name) : -1;
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
            <label htmlFor="painting-select" className="text-sm font-medium text-[#c9d1d9]">
              Painting:
            </label>
            <select
              id="painting-select"
              value={selectedPaintingIndex >= 0 ? selectedPaintingIndex : ""}
              onChange={handlePaintingChange}
              className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
            >
              {paintings.map((painting, index) => (
                <option key={index} value={index} className="bg-[#0d1117] text-[#c9d1d9]">
                  {painting.name}
                </option>
              ))}
            </select>
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
