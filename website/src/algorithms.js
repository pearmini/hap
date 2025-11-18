import * as Filter from "./lib/index";

export const algorithms = [
  {
    category: "Selected",
    algorithms: [
      {
        filter: Filter.randomPoissonDisc,
        metadata: Filter.randomPoissonDisc.metadata,
      },
    ],
  },
  {
    category: "Random",
    algorithms: [
      {
        filter: Filter.randomUniform,
        metadata: Filter.randomUniform.metadata,
      },

      {
        filter: Filter.randomNormal,
        metadata: Filter.randomNormal.metadata,
      },
    ],
  },
  {
    category: "Search",
    algorithms: [
      {
        filter: Filter.searchBinary,
        metadata: Filter.searchBinary.metadata,
      },
      {
        filter: Filter.searchGolden,
        metadata: Filter.searchGolden.metadata,
      },
    ],
  },
  {
    category: "Sorting",
    algorithms: [
      {
        filter: Filter.sortBubble,
        metadata: Filter.sortBubble.metadata,
      },
      {
        filter: Filter.sortInsertion,
        metadata: Filter.sortInsertion.metadata,
      },
      {
        filter: Filter.sortSelection,
        metadata: Filter.sortSelection.metadata,
      },
    ],
  },
];

// Flatten all algorithms for easier access
export const allAlgorithms = algorithms.flatMap((category) =>
  category.algorithms.map((algo) => ({
    ...algo.metadata,
    filter: algo.filter,
    category: category.category,
  }))
);

// Default algorithm
export const defaultAlgorithm = allAlgorithms.find((a) => a.key === "randomPoissonDisc") || allAlgorithms[0];
