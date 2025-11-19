import * as d3 from "d3";

export const schemes = [
  {
    category: "Cyclical Schemes",
    schemes: [
      {name: "Rainbow", value: d3.interpolateRainbow},
      {name: "Sinebow", value: d3.interpolateSinebow},
    ],
  },
  {
    category: "Diverging Schemes",
    schemes: [
      {name: "BrBG", value: d3.interpolateBrBG},
      {name: "PRGn", value: d3.interpolatePRGn},
      {name: "PiYG", value: d3.interpolatePiYG},
      {name: "PuOr", value: d3.interpolatePuOr},
      {name: "RdBu", value: d3.interpolateRdBu},
      {name: "RdGy", value: d3.interpolateRdGy},
      {name: "RdYlBu", value: d3.interpolateRdYlBu},
      {name: "RdYlGn", value: d3.interpolateRdYlGn},
      {name: "Spectral", value: d3.interpolateSpectral},
    ],
  },
  {
    category: "Sequential Schemes",
    schemes: [
      {name: "Blues", value: d3.interpolateBlues},
      {name: "BuGn", value: d3.interpolateBuGn},
      {name: "BuPu", value: d3.interpolateBuPu},
      {name: "Cividis", value: d3.interpolateCividis},
      {name: "Cool", value: d3.interpolateCool},
      {name: "Cubehelix Default", value: d3.interpolateCubehelixDefault},
      {name: "GnBu", value: d3.interpolateGnBu},
      {name: "Greens", value: d3.interpolateGreens},
      {name: "Greys", value: d3.interpolateGreys},
      {name: "Inferno", value: d3.interpolateInferno},
      {name: "Magma", value: d3.interpolateMagma},
      {name: "Oranges", value: d3.interpolateOranges},
      {name: "OrRd", value: d3.interpolateOrRd},
      {name: "Plasma", value: d3.interpolatePlasma},
      {name: "PuBu", value: d3.interpolatePuBu},
      {name: "PuBuGn", value: d3.interpolatePuBuGn},
      {name: "PuRd", value: d3.interpolatePuRd},
      {name: "Purples", value: d3.interpolatePurples},
      {name: "RdPu", value: d3.interpolateRdPu},
      {name: "Reds", value: d3.interpolateReds},
      {name: "Turbo", value: d3.interpolateTurbo},
      {name: "Viridis", value: d3.interpolateViridis},
      {name: "Warm", value: d3.interpolateWarm},
      {name: "YlGn", value: d3.interpolateYlGn},
      {name: "YlGnBu", value: d3.interpolateYlGnBu},
      {name: "YlOrBr", value: d3.interpolateYlOrBr},
    ],
  },
];

// Flatten all schemes for easier access
export const allSchemes = schemes.flatMap((category) =>
  category.schemes.map((scheme) => ({
    ...scheme,
    category: category.category,
  }))
);

// Default scheme
export const defaultScheme = allSchemes.find((s) => s.name === "Rainbow") || allSchemes[0];
