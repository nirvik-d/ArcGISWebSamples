require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/ImageryTileLayer",
  "esri/renderers/RasterShadedReliefRenderer",
  "esri/smartMapping/raster/support/colorRamps",
], function (
  Map,
  MapView,
  ImageryTileLayer,
  RasterShadedReliefRenderer,
  colorRamps
) {
  let hillShadeType = "traditional";
  const url =
    "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";

  let colorRamp = changeColorRamp("Elevation #1");

  const renderer = new RasterShadedReliefRenderer({
    altitude: 45,
    azimuth: 315,
    hillShadeType,
    zFactor: 1,
    scalingType: "adjusted",
    colorRamp,
  });

  const layer = new ImageryTileLayer({
    url,
    renderer,
  });

  const map = new Map({
    basemap: "gray-vector",
    layers: [layer],
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    center: [-111.819, 37.111],
    zoom: 7,
  });

  function updateRenderer() {
    if (!layer.loaded) {
      return;
    }

    const renderer = layer.renderer.clone();
    renderer.scalingType = adjustCheckBox.checked ? "adjusted" : "none";
    renderer.hillShadeType = hillShadeType;
    switch (hillShadeType) {
      case "traditional":
        renderer.zFactor = zFactorSlider.value;
        renderer.altitude = altitudeSlider.value;
        renderer.azimuth = azimuthSlider.value;
        break;
      case "multi-directional":
        renderer.zFactor = zFactorSlider.value;
        break;
    }
    renderer.colorRamp = tintedCheckBox.checked ? colorRamp : null;
    layer.renderer = renderer;
  }

  const colorRampSelect = document.getElementById("colorRampSelect");
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

  function changeColorRamp(name) {
    const colors = colorRamps.byName(name);
    return colorRamps.createColorRamp(colors);
  }

  const hillshadeTypeSelect = document.getElementById("hillshadeTypeSelect");
  hillshadeTypeSelect.addEventListener("calciteSelectChange", () => {
    hillShadeType = hillshadeTypeSelect.value;
    switch (hillshadeType) {
      case "traditional":
        altitudeSlider.disabled = false;
        azimuthSlider.disabled = false;
        break;
      case "multi-directional":
        altitudeSlider.disabled = true;
        azimuthSlider.disabled = true;
        break;
    }
    updateRenderer();
  });

  const zFactorSlider = document.getElementById("zFactorSlider");
  zFactorSlider.addEventListener("calciteSliderInput", updateRenderer);

  const altitudeSlider = document.getElementById("altitudeSlider");
  altitudeSlider.addEventListener("calciteSliderInput", updateRenderer);

  const azimuthSlider = document.getElementById("azimuthSlider");
  azimuthSlider.addEventListener("calciteSliderInput", updateRenderer);

  const tintedCheckBox = document.getElementById("tinted");
  tintedCheckBox.addEventListener("calciteCheckboxChange", updateRenderer);

  const adjustCheckBox = document.getElementById("adjust");
  adjustCheckBox.addEventListener("calciteCheckboxChange", updateRenderer);
});
