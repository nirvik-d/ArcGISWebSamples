# ArcGIS Imagery Tile Layer

A web application demonstrating the Imagery Tile Layer with Raster Shaded Relief rendering using ArcGIS Maps SDK for JavaScript. This component provides advanced imagery visualization with customizable shaded relief effects.

## Features

- **Imagery Visualization**: High-performance tile-based imagery display
- **Shaded Relief**: Advanced raster-based shaded relief rendering
- **Customizable Parameters**: Configurable hillshade types and color ramps
- **Interactive Controls**: Real-time parameter adjustments
- **Modern UI**: Calcite components for enhanced user experience
- **Performance Optimized**: Efficient rendering of large imagery datasets

## Screenshots

*Imagery visualization with shaded relief effects*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

### Project Setup

1. **Initialize Project**

   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```

   Follow the instructions on screen to initialize the project.

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Code Structure

### HTML Structure

The HTML file sets up the basic structure for the ArcGIS web application:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>ImageryTileLayer - shaded relief renderer | Sample | ArcGIS Maps SDK for JavaScript 4.32</title>

    <script type="module" src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"></script>
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>

    <link rel="stylesheet" href="./src/style.css" />
  </head>

  <body>
    <calcite-shell content-behind>
      <div id="viewDiv"></div>
      <calcite-shell-panel slot="panel-end" display-mode="float">
        <calcite-block open id="rendererPanel" heading="Shaded Relief Parameters">
          <calcite-label> Select Type:
            <calcite-select id="hillshadeTypeSelect">
              <calcite-option value="traditional">traditional</calcite-option>
              <calcite-option value="multi-directional">multi-directional</calcite-option>
            </calcite-select>
          </calcite-label>
          <calcite-label> Select Color Ramp:
            <calcite-select id="colorRampSelect"></calcite-select>
          </calcite-label>
          <calcite-label> Exaggeration Factor:
            <calcite-slider id="zFactorSlider" value="1" label-handles label-ticks max="10" min="1" ticks="1"></calcite-slider>
          </calcite-label>
          <calcite-label> Sun Altitude:
            <calcite-slider id="altitudeSlider" value="45" label-handles label-ticks max="90" min="0" max-label="90" min-label="0" ticks="90"></calcite-slider>
          </calcite-label>
          <calcite-label> Sun Azimuth:
            <calcite-slider id="azimuthSlider" value="315" label-handles max="360" min="0"></calcite-slider>
          </calcite-label>
          <calcite-label> Tinted Hillshade:
            <calcite-checkbox id="tinted" checked></calcite-checkbox>
          </calcite-label>
          <calcite-label> Adjust for Large Scale:
            <calcite-checkbox id="adjust" checked></calcite-checkbox>
          </calcite-label>
        </calcite-block>
      </calcite-shell-panel>
    </calcite-shell>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

### CSS Styling (src/style.css)

The CSS file provides styling for the map view and UI elements:

```css
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100vh;
  width: 100%;
}
```

### JavaScript Implementation (src/main.js)

The JavaScript file implements the ArcGIS web application:

1. Initialize the elevation layer

```javascript
const url =
  "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer";
```

2. Create color ramp

```javascript
function changeColorRamp(rampName) {
  const colors = colorRamps.byName(name);
  return colorRamps.createColorRamp(colors);
}

let colorRamp = changeColorRamp("Elevation #1");
```

3. Create renderer

```javascript
const renderer = new RasterShadedReliefRenderer({
  altitude: 45,
  azimuth: 315,
  hillShadeType: "traditional",
  zFactor: 1,
  scalingType: "adjusted",
  colorRamp,
});
```

4. Create layer and map

```javascript
const layer = new ImageryTileLayer({
  url,
  renderer,
});

const map = new Map({
  basemap: "gray-vector",
  layers: [layer],
});
```

5. Initialize view

```javascript
const view = new MapView({
  container: "viewDiv",
  map: map,
  center: [-111.819, 37.111],
  zoom: 7,
});
```

6. Add renderer update function

```javascript
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
```

7. Add color ramp selection

```javascript
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
```

8. Add hillshade type selection

```javascript
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
```

9. Add event listeners to the zFactorSlider, altitudeSlider, azimuthSlider, tintedCheckBox and adjustCheckBox.

```javascript
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
```

10.Wrap the above code with the required statement.

```javascript
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
  // Implementation code
});
```

## Running the Application

1. **Development Server**
   ```bash
   npm run dev
   ```
   This will start the development server at `http://localhost:5173`

2. **Build for Production**
   ```bash
   npm run build
   ```
   This will create a production-ready build in the `dist` directory

3. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Usage

1. **View Imagery**
   - Open the application to see the imagery visualization
   - The shaded relief effect enhances terrain visualization
   - Use standard map controls to navigate

2. **Adjust Shaded Relief**
   - Use the "Shaded Relief Parameters" panel to customize:
     - Hillshade type: traditional or multi-directional
     - Color ramp selection
   - Changes are applied in real-time

3. **Explore Imagery**
   - Use standard map navigation controls:
     - Zoom in/out to see different levels of detail
     - Pan to view different areas
     - Rotate to examine terrain from different angles

4. **Use Controls**
   - The Calcite shell provides floating panel controls
   - Parameters can be adjusted while viewing the map
   - Changes are immediately reflected in the visualization
