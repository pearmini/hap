const Toolbar = ({algorithms, selectedAlgorithm, onSelect, onPlay}) => {
  const handleChange = (e) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < algorithms.length) {
      onSelect(algorithms[selectedIndex], selectedIndex);
    }
  };

  const handlePlay = () => {
    if (selectedAlgorithm && onPlay) {
      onPlay(selectedAlgorithm);
    }
  };

  const selectedIndex = selectedAlgorithm ? algorithms.findIndex((algo) => algo.name === selectedAlgorithm.name) : -1;

  if (!algorithms || algorithms.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#161b22] border-b border-dashed border-[#30363d] py-2">
      <div className="container px-4 py-1.5">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlay}
            disabled={!selectedAlgorithm}
            className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer hover:bg-[#161b22] hover:border-[#1f6feb] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#0d1117] disabled:hover:border-[#30363d] focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb] transition-colors flex items-center gap-1.5"
            title="Restart animation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm font-medium text-[#c9d1d9]">
              Algorithm:
            </label>
            <select
              id="algorithm-select"
              value={selectedIndex >= 0 ? selectedIndex : ""}
              onChange={handleChange}
              className="px-3 py-1 text-sm border border-[#30363d] rounded-sm text-[#c9d1d9] bg-[#0d1117] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1f6feb] focus:border-[#1f6feb]"
            >
              <option value="" disabled className="bg-[#0d1117] text-[#c9d1d9]">
                Select an algorithm...
              </option>
              {algorithms.map((algo, index) => (
                <option key={index} value={index} className="bg-[#0d1117] text-[#c9d1d9]">
                  {algo.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
