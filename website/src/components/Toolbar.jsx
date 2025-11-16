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
    <div className="bg-white dark:bg-gray-800 border-b border-dashed border-gray-200 dark:border-gray-700 py-2">
      <div className="container px-4 py-1.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="algorithm-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Algorithm:
            </label>
            <select
              id="algorithm-select"
              value={selectedIndex >= 0 ? selectedIndex : ""}
              onChange={handleChange}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            >
              <option value="" disabled>
                Select an algorithm...
              </option>
              {algorithms.map((algo, index) => (
                <option key={index} value={index}>
                  {algo.name}
                </option>
              ))}
            </select>
          </div>
          {selectedAlgorithm?.description && (
            <div className="text-sm text-gray-600 dark:text-gray-400">{selectedAlgorithm.description}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
