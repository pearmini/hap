import {cls} from "../cls";

const Sidebar = ({algorithms, selectedAlgorithm, onSelect}) => {
  return (
    <div className="fixed left-0 top-0 h-full w-72 bg-white border-r border-gray-200 overflow-y-auto z-10">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
          Algorithms
        </h2>
        <div className="space-y-3">
          {algorithms.map((algo, index) => (
            <button
              key={index}
              onClick={() => onSelect(algo, index)}
              className={cls(
                "w-full text-left px-4 py-3 border border-gray-200 rounded-sm text-gray-900 cursor-pointer",
                selectedAlgorithm?.name === algo.name ? "bg-gray-200" : "hover:bg-gray-100"
              )}
            >
              <div className="font-medium text-sm">{algo.name}</div>
              {algo.info && <div className="text-xs opacity-80 mt-1">{algo.info}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
