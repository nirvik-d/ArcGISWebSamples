import "./style.css";

import "@arcgis/map-components/components/arcgis-scene"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-navigation-toggle"
import "@arcgis/map-components/components/arcgis-compass"
import "@arcgis/map-components/components/arcgis-expand"
import "@arcgis/map-components/components/arcgis-weather"
import "@arcgis/map-components/components/arcgis-daylight"

import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";

const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  scene.environment.weather = {
    type: "cloudy",
    cloudCover: 0.3,
  };

  // Get if the flood selection is changed
  const floodSelection = document.getElementById("floodSelection");
  if (!floodSelection) {
    throw new Error("Flood selection not found");
  }

  // Get the Flood layer
  if (!scene.map) {
    throw new Error("Map not found");
  }
  let floodLevelLayer = scene.map.allLayers.find(
    (layer) => layer.title === "Flood Level"
  );
  if (!floodLevelLayer) {
    throw new Error("Flood level layer not found");
  }

  // Add event listener to the flood selection
  floodSelection.addEventListener("calciteSegmentedControlChange", (event: Event) => {
    if (!event.target) {
      throw new Error("Flood selection target not found");
    }
    switch ((event.target as HTMLInputElement).value) {
      // If no flooding is selected
      case "noFlooding":
        scene.environment.weather = {
          type: "cloudy",
          cloudCover: 0.3,
        };
        floodLevelLayer.visible = false;
        break;

      // If flooding is selected
      case "flooding":
        scene.environment.weather = {
          type: "rainy",
          cloudCover: 0.7,
          precipitation: 0.3,
        };
        floodLevelLayer.visible = true;
        break;
    }
  });
});
