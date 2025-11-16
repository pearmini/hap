const Toolbar = ({algorithms, selectedAlgorithm, onSelect}) => {
  const handleChange = (e) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < algorithms.length) {
      onSelect(algorithms[selectedIndex], selectedIndex);
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
