import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-legend";
import "@arcgis/map-components/components/arcgis-fullscreen";
import "@arcgis/map-components/components/arcgis-compass";

import TileLayer from "@arcgis/core/layers/TileLayer";
import MultipartColorRamp from "@arcgis/core/rest/support/MultipartColorRamp";
import AlgorithmicColorRamp from "@arcgis/core/rest/support/AlgorithmicColorRamp";
import Color from "@arcgis/core/Color";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import GroupLayer from "@arcgis/core/layers/GroupLayer";
import Basemap from "@arcgis/core/Basemap";
import Map from "@arcgis/core/Map";

// Create a Spilhaus basemap
const spilhausBasemap = new TileLayer({
  url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/Spilhaus_Vibrant_Basemap/MapServer",
  effect: "saturate(10%) brightness(0.3)", // dim brightness to create darker style basemap
});

// Create a color ramp
const colorRamp = new MultipartColorRamp({
  colorRamps: [
    new AlgorithmicColorRamp({
      fromColor: new Color([20, 100, 150, 255]),
      toColor: new Color([70, 0, 150, 255]),
    }),
    new AlgorithmicColorRamp({
      fromColor: new Color([70, 0, 150, 255]),
      toColor: new Color([170, 0, 120, 255]),
    }),
    new AlgorithmicColorRamp({
      fromColor: new Color([170, 0, 120, 255]),
      toColor: new Color([230, 100, 60, 255]),
    }),
    new AlgorithmicColorRamp({
      fromColor: new Color([230, 100, 60, 255]),
      toColor: new Color([255, 170, 0, 255]),
    }),
    new AlgorithmicColorRamp({
      fromColor: new Color([255, 170, 0, 255]),
      toColor: new Color([255, 255, 0, 255]),
    }),
  ],
});

// Create a sea surface temperature layer
const temperatureLayer = new ImageryTileLayer({
  url: "https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/HyCOM_Surface_Temperature___Spilhaus/ImageServer",
  renderer: {
    colorRamp,
    stretchType: "min-max",
    type: "raster-stretch",
  },
});

// Create a ocean currents layer
const currentsLayer = new ImageryTileLayer({
  url: "https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Spilhaus_UV_ocean_currents/ImageServer",
  renderer: {
    type: "flow", // autocasts to FlowRenderer
    density: 1,
    maxPathLength: 10, // max length of a streamline will be 10
    trailWidth: "2px",
  },
  blendMode: "destination-in", // temperature layer will only display on top of this layer
});

// Create a group layer
const groupLayer = new GroupLayer({
  effect: "bloom(2, 0.5px, 0.0)", // apply bloom effect to make the colors pop
  layers: [temperatureLayer, currentsLayer],
});

// Get the map
const map = document.querySelector("arcgis-map");
if (!map) {
  throw new Error("Map not found");
}

// Create a new map and assign the basemap and layers
const newMap = new Map({
  basemap: new Basemap({
    baseLayers: [spilhausBasemap],
  }),
  layers: [groupLayer],
});

// Set the map
map.map = newMap;

// Get the legend
const legend = document.querySelector("arcgis-legend");
if (!legend) {
  throw new Error("Legend not found");
}

// Set the legend
legend.layerInfos = [
  {
    layer: temperatureLayer,
    title: "Sea surface temperature",
  },
];
