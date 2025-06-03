# Terrain Analysis Web Application Tutorial

Welcome to the Terrain Analysis Web Application tutorial! This guide will help you build a powerful web application that performs various terrain analyses using the ArcGIS API for JavaScript.

## Prerequisites

Before we begin, make sure you have:

1. Basic knowledge of JavaScript
2. Understanding of HTML and CSS
3. Access to a web browser
4. A text editor or IDE

## Step 1: Setting Up the Project Structure

Start by creating a Vite project.

```bash
npm create vite@latest
```

Follow the on-screen instructions to create a new vite project.

```bash
cd <your-project-name>
npm install
```

Now, edit the main HTML file (`index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Terrain Analysis</title>

    <!-- Load styles -->
    <link rel="stylesheet" href="./src/style.css" />

    <!-- Load Calcite components from CDN -->
    <script
      type="module"
      src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"
    ></script>

    <!-- Load the ArcGIS Maps SDK for JavaScript from CDN -->
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/dark/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>

    <!-- Load Map components from CDN-->
    <script
      type="module"
      src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"
    ></script>
  </head>
  <body>
    <div id="app">
      <!-- Add ArcGIS Scene -->
      <arcgis-scene item-id="dac0b9b188e146baa504c9cfb6eb8d00">
        <!-- Add ArcGIS Scene Controls -->
        <arcgis-zoom position="top-left"></arcgis-zoom>
        <!-- Add ArcGIS Navigation Toggle -->
        <arcgis-navigation-toggle
          position="top-left"
        ></arcgis-navigation-toggle>
        <!-- Add ArcGIS Compass -->
        <arcgis-compass position="top-left"></arcgis-compass>
        <!-- Add ArcGIS Expand -->
        <arcgis-expand position="top-left">
          <arcgis-legend></arcgis-legend>
        </arcgis-expand>
        <!-- Add ArcGIS Basemap Toggle -->
        <arcgis-basemap-toggle position="bottom-left"></arcgis-basemap-toggle>
        <!-- Add ArcGIS Placement -->
        <arcgis-placement position="top-right">
          <div id="terrainAnalysisDiv">
            <!-- Add ArcGIS Segmented Control -->
            <calcite-segmented-control id="analysisModeSegmentedControl">
              <!-- Add ArcGIS Segmented Control Items -->
              <calcite-segmented-control-item
                icon-start="surface"
                value="Custom"
                checked
                >Custom</calcite-segmented-control-item
              >
              <calcite-segmented-control-item
                icon-start="altitude"
                value="Elevation"
                >Elevation</calcite-segmented-control-item
              >
              <calcite-segmented-control-item
                icon-start="take-pedestrian-ramp"
                value="Slope"
                >Slope</calcite-segmented-control-item
              >
            </calcite-segmented-control>
            <br />
            <calcite-label scale="s">
              <!-- Add ArcGIS Slider -->
              Transparency | %
              <calcite-slider
                id="opacitySlider"
                value="20"
                label-handles
                max-label="100"
                min-label="0"
                ticks="10"
              ></calcite-slider>
            </calcite-label>

            <div id="customAnalysisDiv">
              <!-- Add ArcGIS Label -->
              <calcite-label scale="s">
                Elevation | m.a.s.l
                <calcite-slider
                  id="elevationSlider"
                  min-value="2000"
                  max-value="9000"
                  min="-500"
                  max="9000"
                  ticks="500"
                  step="50"
                  snap
                  label-handles
                  max-label="Max Elevation"
                  min-label="Min Elevation"
                ></calcite-slider>
              </calcite-label>
              <!-- Add ArcGIS Label -->
              <calcite-label scale="s">
                Slope | °
                <calcite-slider
                  id="slopeSlider"
                  min-value="10"
                  max-value="90"
                  min="0"
                  max="90"
                  ticks="5"
                  step="1"
                  snap
                  label-handles
                  max-label="Max Slope"
                  min-label="Min Slope"
                ></calcite-slider>
              </calcite-label>
              <!-- Add ArcGIS Label -->
              <calcite-label scale="s">
                Aspect
                <div id="compassRoseDiv">
                  <svg
                    id="compassRoseSvg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="-50 -50 100 100"
                  >
                    <!-- North -->
                    <polygon
                      points="0,-40 5,-15 -5,-15"
                      data-aspect="n"
                      class="roseDirection"
                    />
                    <text x="0" y="-45" text-anchor="middle">N</text>

                    <!-- North-East -->
                    <polygon
                      points="22,-22 15,-5 5,-15"
                      data-aspect="ne"
                      class="roseDirection"
                    />
                    <text x="30" y="-30" text-anchor="middle">NE</text>

                    <!-- East -->
                    <polygon
                      points="40,0 15,5 15,-5"
                      data-aspect="e"
                      class="roseDirection"
                    />
                    <text x="45" y="2" text-anchor="middle">E</text>

                    <!-- South-East -->
                    <polygon
                      points="22,22 5,15 15,5"
                      data-aspect="se"
                      class="roseDirection active"
                    />
                    <text x="30" y="30" text-anchor="middle">SE</text>

                    <!-- South -->
                    <polygon
                      points="0,40 -5,15 5,15"
                      data-aspect="s"
                      class="roseDirection active"
                    />
                    <text x="0" y="48" text-anchor="middle">S</text>

                    <!-- South-West -->
                    <polygon
                      points="-22,22 -15,5 -5,15"
                      data-aspect="sw"
                      class="roseDirection active"
                    />
                    <text x="-30" y="30" text-anchor="middle">SW</text>

                    <!-- West -->
                    <polygon
                      points="-40,0 -15,-5 -15,5"
                      data-aspect="w"
                      class="roseDirection"
                    />
                    <text x="-45" y="2" text-anchor="middle">W</text>

                    <!-- North-West -->
                    <polygon
                      points="-22,-22 -5,-15 -15,-5"
                      data-aspect="nw"
                      class="roseDirection"
                    />
                    <text x="-30" y="-30" text-anchor="middle">NW</text>
                  </svg>
                </div>
              </calcite-label>
              <!-- Add ArcGIS Label -->
              <calcite-label scale="s">
                Color
                <!-- Add ArcGIS Popover -->
                <calcite-popover reference-element="colorButton" closable>
                  <!-- Add ArcGIS Color Picker -->
                  <calcite-color-picker
                    id="colorPicker"
                    format="rgb"
                    closable
                  ></calcite-color-picker>
                </calcite-popover>
                <button id="colorButton"></button>
              </calcite-label>
            </div>
          </div>
        </arcgis-placement>
      </arcgis-scene>
      <script type="module" src="/src/terrainAnalysis.js"></script>
    </div>
  </body>
</html>
```

## Step 2: Creating a javascript file and adding the custom analysis logic

Create a script called terrainAnalysis.js in the src directory. Start by importing the required modules.

```javascript
require([
  "esri/layers/support/RasterFunction",
  "esri/layers/support/rasterFunctionUtils",
  "esri/layers/ImageryTileLayer",
], (RasterFunction, rasterFunctionUtils, ImageryTileLayer) => {
  
});
```

## Step 3: Setting up the global variables.

Declare the global variables inside the require block.

```javascript
const customAnalysisParams = {
    elevation: { min: 2000, max: 9000 },
    slope: { min: 10, max: 90 },
    aspects: {
      N: false,
      NE: false,
      E: false,
      SE: true,
      S: true,
      SW: true,
      W: false,
      NW: false,
    },
  };

  let activeAnalysisMode = "Custom"; // "Custom" | "Elevation" | "Slope"
```

## Step 3.1: Setting Up Slope Raster Functions

Add the slope raster functions to the script:

```javascript
/* -- Slope - Raster Functions -- */

const slope = rasterFunctionUtils.slope({
  slopeType: "degree",
  zFactor: 1,
});

// Remap slope values (degrees) to categorical ranges
const remapSlope = rasterFunctionUtils.remap({
  rangeMaps: [
    { range: [30, 35], output: 30 },
    { range: [35, 40], output: 35 },
    { range: [40, 45], output: 40 },
    { range: [45, 90], output: 45 },
  ],
  outputPixelType: "u8",
  raster: slope,
});

// Map categorical ranges to RGB colors
const colorMapSlope = rasterFunctionUtils.colormap({
  colormap: [
    [30, 255, 255, 0],
    [35, 255, 165, 0],
    [40, 255, 0, 0],
    [45, 128, 0, 128],
  ],
  raster: remapSlope,
});
```

## Step 3.2: Setting Up Elevation Raster Functions

Add the elevation raster functions to the script:

```javascript
/* -- Elevation - Raster Function -- */

const elevation = rasterFunctionUtils.colormap({
  colorRampName: "elevation1",
});
```

## Step 3.3: Setting Up Custom Analysis Raster Functions

Add the custom analysis raster functions to the script:

```javascript
/* -- Custom Analysis - Raster Functions -- */

let customColor = [0, 122, 194];

function createCustomAnalysis(color = customColor) {
  // Mask out elevation outside of parameter range
  const elevationMask = rasterFunctionUtils.mask({
    includedRanges: [
      [customAnalysisParams.elevation.min, customAnalysisParams.elevation.max],
    ],
    noDataValues: [[-9999]],
    noDataInterpretation: "match-any",
  });

  // Compute slope on masked elevation
  const slopeFunction = rasterFunctionUtils.slope({
    slopeType: "degree",
    zFactor: 1,
    raster: elevationMask,
  });

  // Mask out slopes outside of parameter range
  const slopeMask = rasterFunctionUtils.mask({
    includedRanges: [
      [customAnalysisParams.slope.min, customAnalysisParams.slope.max],
    ],
    noDataValues: [[-9999]],
    noDataInterpretation: "match-any",
    raster: slopeFunction,
  });

  // Map included slopes >= 0 to 1
  const greaterThanSlope0 = rasterFunctionUtils.greaterThanEqual({
    raster: slopeMask,
    raster2: 0,
  });

  // Compute aspect on masked elevation
  const aspectFunction = rasterFunctionUtils.aspect({
    raster: elevationMask,
  });

  // Map aspect as 1 (include) or 0 (exclude) according to parameters
  const remapAspectFunction = rasterFunctionUtils.remap({
    rangeMaps: [
      { range: [-Infinity, 0], output: 1 }, // Include flats
      { range: [360, Infinity], output: 1 }, // Include flats
      { range: [337.5, 360], output: +customAnalysisParams.aspects.N },
      { range: [0, 22.5], output: +customAnalysisParams.aspects.N },
      { range: [22.5, 67.5], output: +customAnalysisParams.aspects.NE },
      { range: [67.5, 112.5], output: +customAnalysisParams.aspects.E },
      { range: [112.5, 157.5], output: +customAnalysisParams.aspects.SE },
      { range: [157.5, 202.5], output: +customAnalysisParams.aspects.S },
      { range: [202.5, 247.5], output: +customAnalysisParams.aspects.SW },
      { range: [247.5, 292.5], output: +customAnalysisParams.aspects.W },
      { range: [292.5, 337.5], output: +customAnalysisParams.aspects.NW },
    ],
    raster: aspectFunction,
  });

  // Combine slope and aspect rasters
  const combineAspectSlope = rasterFunctionUtils.booleanAnd({
    raster: greaterThanSlope0,
    raster2: remapAspectFunction,
  });

  // Assign an RGB color to all raster cells with a value of 1
  const colorMapFinal = rasterFunctionUtils.colormap({
    colormap: [[1, ...color]],
    raster: combineAspectSlope,
  });

  return colorMapFinal;
}
```

## Step 4: Building the UI

Now create a new imagery tile layer and add the UI functions to manage the UI elements using event listeners:

```javascript
// Create imagery layer with initial raster function
// This sets up the layer that will display our terrain analysis
const analysisLayer = new ImageryTileLayer({
  url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
  title: "Custom Analysis",
  rasterFunction: createCustomAnalysis(customColor),
  opacity: 0.8, // Start with 80% opacity
});

// Handle opacity slider changes
// This function updates the layer's opacity based on user input
const opacitySlider = document.getElementById("opacitySlider");
opacitySlider.addEventListener("calciteSliderInput", (event) => {
  analysisLayer.opacity = 1 - event.target.value / 100; // Invert slider value (100% = transparent)
});

// Handle elevation slider changes
// This function updates the elevation range and re-calculates the analysis
const elevationSlider = document.getElementById("elevationSlider");
elevationSlider.addEventListener("calciteSliderChange", (event) => {
  customAnalysisParams.elevation = {
    min: event.target.minValue,
    max: event.target.maxValue,
  };
  analysisLayer.rasterFunction = createCustomAnalysis(customColor);
});

// Handle slope slider changes
// This function updates the slope range and re-calculates the analysis
const slopeSlider = document.getElementById("slopeSlider");
slopeSlider.addEventListener("calciteSliderChange", (event) => {
  customAnalysisParams.slope = {
    min: event.target.minValue,
    max: event.target.maxValue,
  };
  analysisLayer.rasterFunction = createCustomAnalysis(customColor);
});

// Handle aspect direction clicks
// This function toggles aspect directions and re-calculates the analysis
const roseDirections = document.getElementsByClassName("roseDirection");
for (const roseDirection of roseDirections) {
  roseDirection.addEventListener("click", () => {
    const active = roseDirection.classList.toggle("active");
    const aspect = roseDirection.getAttribute("data-aspect").toUpperCase();
    customAnalysisParams.aspects[aspect] = active;
    analysisLayer.rasterFunction = createCustomAnalysis(customColor);
  });
}

// Handle color picker changes
// This function updates the visualization color based on user selection
const colorPicker = document.getElementById("colorPicker");
const colorButton = document.getElementById("colorButton");
colorPicker.addEventListener("calciteColorPickerChange", (event) => {
  const color = event.target.value;
  colorButton.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
  customColor = [color.r, color.g, color.b];
  analysisLayer.rasterFunction = createCustomAnalysis(customColor);
});

// Handle analysis mode changes
// This function manages switching between different analysis modes
const customAnalysisDiv = document.getElementById("customAnalysisDiv");
const aspectCompass = document.getElementById("compassRoseSvg");
const analysisModeSegmentedControl = document.getElementById(
  "analysisModeSegmentedControl"
);
const legendExpand = document.querySelector("arcgis-expand");

analysisModeSegmentedControl.addEventListener(
  "calciteSegmentedControlChange",
  (event) => {
    activeAnalysisMode = event.target.value;

    // Toggle visibility of custom analysis controls
    if (activeAnalysisMode === "Custom") {
      customAnalysisDiv.style.display = "block";
      aspectCompass.style.display = "block";
      legendExpand.collapse();
    } else {
      customAnalysisDiv.style.display = "none";
      aspectCompass.style.display = "none";
      legendExpand.expand();
    }

    // Reset renderer
    analysisLayer.renderer = null;

    // Update raster function based on selected mode
    switch (activeAnalysisMode) {
      case "Slope":
        analysisLayer.title = "Slope | °";
        analysisLayer.rasterFunction = colorMapSlope;
        break;
      case "Elevation":
        analysisLayer.title = "Elevation | m.a.s.l";
        analysisLayer.rasterFunction = colorMapElevation;
        break;
      case "Custom":
      default:
        analysisLayer.title = "Custom Analysis";
        analysisLayer.rasterFunction = createCustomAnalysis(customColor);
        break;
    }
  }
);
```

## Step 5: Adding a Basemap Toggle

Create a basemap toggle

```javascript
// Configure basemap toggle
// This sets up the basemap toggle control
const arcgisBasemapToggle = document.querySelector("arcgis-basemap-toggle");
arcgisBasemapToggle.nextBasemap = "hybrid"; // Set default basemap to hybrid
```

## Step 6: Adding the analysis layer to the scene

```javascript
// Add analysis layer to scene when view is ready
// This function initializes the scene with our analysis layer
const arcgisScene = document.querySelector("arcgis-scene");
arcgisScene.addEventListener("arcgisViewReadyChange", () => {
  arcgisScene.map.add(analysisLayer);
});
```

## Step 7: Adding the styling to the CSS

```css
html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#terrainAnalysisDiv {
  background-color: var(--calcite-color-background);
  padding: 10px;
  overflow-y: auto;
}

#compassRoseDiv {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

#compassRoseSvg {
  width: 130px;
}

#compassRoseSvg text {
  fill: var(--calcite-color-text-1);
  font-size: 6px;
}

.roseDirection {
  fill: none;
  stroke: var(--calcite-color-border-input);
  stroke-width: 1px;
  pointer-events: all;
  cursor: pointer;
}

.roseDirection.active {
  fill: var(--calcite-color-brand);
}

#colorButton {
  border: 1px solid var(--calcite-color-border-input);
  width: 35px;
  height: 25px;
  background-color: rgb(0, 122, 194);
  cursor: pointer;
}
```
## Step 8: Running the Application

1. Run the application using `npm run dev`.
2. Open the application in a web browser and navigate to `http://localhost:5173`.
