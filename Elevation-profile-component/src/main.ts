import "./style.css";

import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-elevation-profile";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-navigation-toggle";
import "@arcgis/map-components/components/arcgis-compass";
import Collection from "@arcgis/core/core/Collection";

const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}
const elevationProfile = document.querySelector("arcgis-elevation-profile");
if (!elevationProfile) {
  throw new Error("Elevation profile not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  elevationProfile.profiles = new Collection([
    {
      type: "ground" // First profile line samples the ground elevation
    },
    {
      type: "view" // Second profile samples the view and shows building profiles
    }
  ]);
});