export const paintings = [
  {
    category: "Paintings",
    items: [
      {
        name: "Starry Night",
        image: "starry-night.png",
        bumps: "starry-night_bumps.png",
      },
      {
        name: "Mona Lisa",
        image: "mona-lisa.jpg",
        bumps: "mona-lisa_bumps.png",
      },
    ],
  },
  {
    category: "Photographs",
    items: [
      {
        name: "Audrey Hepburn",
        image: "audrey-hepburn.jpg",
        bumps: "audrey-hepburn_bumps.png",
      },
      {
        name: "Obama",
        image: "obama.png",
        bumps: "obama_bumps.png",
      },
    ],
  },
  {
    category: "Textures",
    items: [
      {
        name: "Polygons",
        image: "polygons_color.png",
        bumps: "polygons_bumps.png",
      },
      {
        name: "Woods",
        image: "wood_color.png",
        bumps: "wood_bumps.png",
      },
      {
        name: "Rocks",
        image: "rocks_color.png",
        bumps: "rocks_bumps.png",
      },
      {
        name: "Mosaic",
        image: "mosaic_color.png",
        bumps: "mosaic_bumps.png",
      },
    ],
  },
];

// Flatten all paintings for easier access
export const allPaintings = paintings.flatMap((category) =>
  category.items.map((item) => ({
    ...item,
    category: category.category,
  }))
);
