# Geometry Operators Map Tutorial

This tutorial will guide you through creating an interactive map that demonstrates various geometric operations using ArcGIS Web Components and JavaScript API. The map visualizes different geometric properties of states when clicked.

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- ArcGIS API for JavaScript
- Modern web browser

## Step 1: Set up the Vite project

```bash
npm create vite@latest
```

Follow the prompts to create a new project.

Navigate to the project directory:
```bash
cd <project-name>
```

Install dependencies:
```bash
npm install
```

## Step 2: Update the HTML in `index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Geometry Operators</title>

    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>

    <script
      type="module"
      src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"
    ></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>

  <body>
    <arcgis-map 
      zoom="8" 
      center="-117, 33">
      <arcgis-zoom position="top-left"></arcgis-zoom>
    </arcgis-map>

    <div id="customLegend">
      <div id="labelPointDiv">Label Point</div>
      <div id="centroidDiv">Centroid</div>
      <div id="extentDiv">Extent</div>
      <div id="extentCenterDiv">Extent center</div>
    </div>

    <div id="instructionsDiv" class="esri-widget">
      <p>
        Click on a state to display the label point, centroid, extent, and
        extent center point.
      </p>
    </div>

    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

## Step 3: Update the CSS in `src/style.css`

```css
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#customLegend {
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}

#instructionsDiv {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
}
```

## Step 4: Configure the Map and Geometric Operations in `src/main.js`

```javascript
require([
  "esri/layers/FeatureLayer",
  "esri/Graphic",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/TextSymbol",
  "esri/symbols/support/jsonUtils",
  "esri/core/reactiveUtils"
], (FeatureLayer, Graphic, SimpleMarkerSymbol, SimpleFillSymbol, SimpleLineSymbol, TextSymbol, jsonUtils, reactiveUtils) => {
  // Create the states layer
  const statesLayer = new FeatureLayer({
    portalItem: {
      id: "e17068a595e94de48c091e919b11a8db"
    },
    outFields: ["*"],
    popupEnabled: false
  });

  // Add the states layer to the map
  const arcgisMap = document.querySelector("arcgis-map");
  arcgisMap.map.add(statesLayer);

  // Create symbols for different geometric elements
  const labelPointSymbol = new SimpleMarkerSymbol({
    color: [255, 0, 0],
    size: 10,
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  });

  const centroidMarkerSymbol = new SimpleMarkerSymbol({
    color: [0, 255, 0],
    size: 10,
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  });

  const extentFillSymbol = new SimpleFillSymbol({
    color: [0, 0, 255, 0.2],
    outline: {
      color: [0, 0, 255],
      width: 2
    }
  });

  const extentCenterSymbol = new SimpleMarkerSymbol({
    color: [0, 0, 255],
    size: 10,
    outline: {
      color: [255, 255, 255],
      width: 1
    }
  });

  // Handle state click event
  arcgisMap.view.whenLayerView(statesLayer).then((layerView) => {
    layerView.on("click", (event) => {
      const geometry = event.graphic.geometry;

      // Create graphics for different geometric elements
      const stateGraphic = new Graphic({
        geometry: geometry,
        symbol: new SimpleFillSymbol({
          color: [255, 255, 255, 0.5],
          outline: {
            color: [0, 0, 0],
            width: 2
          }
        })
      });

      const centroidGraphic = new Graphic({
        geometry: geometry.centroid,
        symbol: centroidMarkerSymbol
      });

      const labelPointGraphic = new Graphic({
        geometry: geometry.labelPoint,
        symbol: labelPointSymbol
      });

      const extentCenterGraphic = new Graphic({
        geometry: geometry.extent.center,
        symbol: extentCenterSymbol
      });

      const extentGraphic = new Graphic({
        geometry: geometry.extent,
        symbol: extentFillSymbol
      });

      // Add graphics to the map
      arcgisMap.graphics.addMany([
        extentGraphic,
        stateGraphic,
        centroidGraphic,
        labelPointGraphic,
        extentCenterGraphic
      ]);

      // Show the legend
      document.getElementById("customLegend").style.display = "block";
    });
  });
});
```

## Step 5: Run the Application

1. In a terminal, navigate to the project directory and run:
```bash
npm run dev
```

2. Open the project in a web browser and navigate to `http://localhost:5173`.

## Key Features

- Interactive map centered on the United States
- Clickable states layer
- Visualization of four geometric properties:
  - Label Point: The point where the state name is labeled (red dot)
  - Centroid: The mathematical center of the state's geometry (green dot)
  - Extent: The rectangular bounding box that contains the state (blue rectangle)
  - Extent Center: The center of the state's bounding box (blue dot)
- Custom legend explaining the symbology
- Responsive design
- Zoom control widget

## Dependencies

- ArcGIS API for JavaScript 4.32
- ArcGIS Web Components 4.32
- Calcite Components
