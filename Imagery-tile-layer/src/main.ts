import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@esri/calcite-components/components/calcite-shell";
import "@esri/calcite-components/components/calcite-shell-panel";
import "@esri/calcite-components/components/calcite-block";
import "@esri/calcite-components/components/calcite-label";
import "@esri/calcite-components/components/calcite-select";
import "@esri/calcite-components/components/calcite-option";
import "@esri/calcite-components/components/calcite-slider";
import "@esri/calcite-components/components/calcite-checkbox";

import * as colorRamps from "@arcgis/core/smartMapping/raster/support/colorRamps";
import ImageryTileLayer from "@arcgis/core/layers/ImageryTileLayer";
import RasterShadedReliefRenderer from "@arcgis/core/renderers/RasterShadedReliefRenderer";

let colorRamp = changeColorRamp("Elevation #1");
const renderer = new RasterShadedReliefRenderer({
  altitude: 45,
  azimuth: 315,
  hillshadeType: "traditional",
  zFactor: 1,
  scalingType: "adjusted",
  colorRamp,
});

const url = "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";
const layer = new ImageryTileLayer({
  url,
  renderer,
});

const map = document.querySelector("arcgis-map");
if (!map) {
  throw new Error("Map not found");
}
map.addEventListener("arcgisViewReadyChange", () => {
  if (!map.map) {
    throw new Error("Map not found");
  }
  map.map.add(layer);
});

// Calcite components
// Color Ramp Select
const colorRampSelect: HTMLCalciteSelectElement | null =
  document.querySelector("#colorRampSelect");
if (!colorRampSelect) {
  throw new Error("Color ramp select not found");
}
colorRamps.names().forEach((name) => {
  const colorItem = document.createElement("calcite-option");
  colorItem.setAttribute("label", name);
  colorItem.setAttribute("value", name);
  if (name === "Elevation #1") {
    colorItem.selected = true;
  }
  colorRampSelect.appendChild(colorItem);
});
colorRampSelect.addEventListener("calciteSelectChange", () => {
  colorRamp = changeColorRamp(colorRampSelect.value);
  updateRenderer();
});

// Sun Altitude Slider
const altitudeSlider: HTMLCalciteSliderElement | null =
  document.querySelector("#altitudeSlider");
if (!altitudeSlider) {
  throw new Error("Altitude slider not found");
}
altitudeSlider.addEventListener("calciteSliderInput", updateRenderer);

// Sun Azimuth Slider
const azimuthSlider: HTMLCalciteSliderElement | null =
  document.querySelector("#azimuthSlider");
if (!azimuthSlider) {
  throw new Error("Azimuth slider not found");
}
azimuthSlider.addEventListener("calciteSliderInput", updateRenderer);

// Exaggeration Factor Slider
const zFactorSlider: HTMLCalciteSliderElement | null =
  document.querySelector("#zFactorSlider");
if (!zFactorSlider) {
  throw new Error("Z factor slider not found");
}
zFactorSlider.addEventListener("calciteSliderInput", updateRenderer);

// Tinted hillshade checkbox
const tintedCheckBox: HTMLCalciteCheckboxElement | null =
  document.querySelector("#tinted");
if (!tintedCheckBox) {
  throw new Error("Tinted checkbox not found");
}
tintedCheckBox.addEventListener("calciteCheckboxChange", updateRenderer);

// Adjust for large scale checkbox
const adjustCheckBox: HTMLCalciteCheckboxElement | null =
  document.querySelector("#adjust");
if (!adjustCheckBox) {
  throw new Error("Adjust checkbox not found");
}
adjustCheckBox.addEventListener("calciteCheckboxChange", updateRenderer);

// Hillshade Type Select
const hillshadeTypeSelect: HTMLCalciteSelectElement | null = document.querySelector("#hillshadeTypeSelect");
if (!hillshadeTypeSelect) {
  throw new Error("Hillshade type select not found");
}
hillshadeTypeSelect.addEventListener("calciteSelectChange", () => {
  const hillshadeType: string = hillshadeTypeSelect.value;
  switch (hillshadeType) {
    case "traditional":
      altitudeSlider.setAttribute("disabled", "false");
      azimuthSlider.setAttribute("disabled", "false");
      break;
    case "multi-directional":
      altitudeSlider.setAttribute("disabled", "true");
      azimuthSlider.setAttribute("disabled", "true");
      break;
  }
  updateRenderer();
});

// Helper functions
function changeColorRamp(name: string) {
  const colors = colorRamps.byName(name);
  return colorRamps.createColorRamp(
    colors as __esri.colorRampsCreateColorRampOptions
  );
}

function updateRenderer() {
  if (!layer.loaded) {
    throw new Error("Layer not loaded");
  }

  const renderer: __esri.RasterShadedReliefRenderer =
    layer?.renderer?.clone() as __esri.RasterShadedReliefRenderer;
  if (!renderer) {
    throw new Error("Renderer not found");
  }
  renderer.scalingType = adjustCheckBox?.checked ? "adjusted" : "none";
  switch (hillshadeTypeSelect?.value) {
    case "traditional":
      renderer.zFactor = zFactorSlider?.value as number;
      renderer.altitude = altitudeSlider?.value as number;
      renderer.azimuth = azimuthSlider?.value as number;
      break;
    case "multi-directional":
      renderer.zFactor = zFactorSlider?.value as number;
      break;
  }
  renderer.colorRamp = tintedCheckBox?.checked ? colorRamp : null;
  layer.renderer = renderer;
}
