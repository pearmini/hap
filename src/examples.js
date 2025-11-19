// Map filename parts to algorithm keys and palette names
const algorithmMap = {
  "bfs": "graphBfs",
  "binary-search": "searchBinary",
  "bubble-sort": "sortBubble",
  "dfs": "graphDfs",
  "golden-search": "searchGolden",
  "insertion-sort": "sortInsertion",
  "normal-random": "randomNormal",
  "poisson-disc": "randomPoissonDisc",
  "prim": "graphPrim",
  "quick-sort": "sortQuick",
  "selection-sort": "sortSelection",
  "uniform-random": "randomUniform",
};

const paletteMap = {
  "sinebow": "Sinebow",
  "piyg": "PiYG",
  "viridis": "Viridis",
  "warm": "Warm",
  "rdylgn": "RdYlGn",
  "greens": "Greens",
  "rainbow": "Rainbow",
  "brbg": "BrBG",
  "cubehelix-default": "Cubehelix Default",
  "spectral": "Spectral",
  "purples": "Purples",
  "oranges": "Oranges",
};

function parseExampleFilename(filename) {
  // Remove "example-" prefix and ".png" suffix
  const name = filename.replace("example-", "").replace(".png", "");
  
  // Try to match algorithm and palette by checking all possible combinations
  // Start from the longest algorithm names and work backwards
  const algorithmKeys = Object.keys(algorithmMap).sort((a, b) => b.length - a.length);
  
  for (const algoKey of algorithmKeys) {
    if (name.startsWith(algoKey + "-")) {
      const palettePart = name.substring(algoKey.length + 1);
      const paletteName = paletteMap[palettePart];
      
      if (paletteName) {
        return {
          algorithmKey: algorithmMap[algoKey],
          paletteName: paletteName,
          image: `/example-${name}.png`,
        };
      }
    }
  }
  
  // Fallback: split by last hyphen (for cases not covered above)
  const lastHyphenIndex = name.lastIndexOf("-");
  if (lastHyphenIndex === -1) return null;
  
  const algorithmPart = name.substring(0, lastHyphenIndex);
  const palettePart = name.substring(lastHyphenIndex + 1);
  
  return {
    algorithmKey: algorithmMap[algorithmPart],
    paletteName: paletteMap[palettePart],
    image: `/example-${name}.png`,
  };
}

export const examples = [
  "example-bfs-oranges.png",
  "example-binary-search-sinebow.png",
  "example-bubble-sort-piyg.png",
  "example-dfs-viridis.png",
  "example-golden-search-warm.png",
  "example-insertion-sort-rdylgn.png",
  "example-normal-random-greens.png",
  "example-poisson-disc-rainbow.png",
  "example-prim-brbg.png",
  "example-quick-sort-cubehelix-default.png",
  "example-selection-sort-spectral.png",
  "example-uniform-random-purples.png",
].map((filename) => {
  const parsed = parseExampleFilename(filename);
  return {
    image: parsed.image,
    algorithmKey: parsed.algorithmKey,
    paletteName: parsed.paletteName,
  };
});
