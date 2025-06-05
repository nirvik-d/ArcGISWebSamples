# Flash Floods by Season Map Tutorial

This tutorial will guide you through creating an interactive map that visualizes flash flood warnings by season using ArcGIS Web Components and JavaScript API.

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
    <title>Flash Floods by Season</title>

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
    <div id="seasons-filter" class="esri-widget">
      <div class="season-item visible-season" data-season="Winter">Winter</div>
      <div class="season-item visible-season" data-season="Spring">Spring</div>
      <div class="season-item visible-season" data-season="Summer">Summer</div>
      <div class="season-item visible-season" data-season="Fall">Fall</div>
    </div>
    <div id="viewDiv">
      <arcgis-map 
        basemap="gray-vector" 
        center="-117.9911, 33.6653" 
        zoom="9">
      </arcgis-map>
    </div>
    <div id="titleDiv" class="esri-widget">
      <div id="titleText">Flash Floods by Season</div>
      <div>Flash Flood Warnings (2002 - 2012)</div>
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

.season-item {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  margin: 4px;
}

.season-item:hover {
  background-color: #f0f0f0;
}
```

## Step 4: Configure the Feature Layer in `src/main.js`

```javascript
require([
  "esri/layers/FeatureLayer",
  "esri/widgets/Expand",
  "esri/core/reactiveUtils"
], (FeatureLayer, Expand, reactiveUtils) => {
  // Create flash flood warnings layer
  const layer = new FeatureLayer({
    portalItem: {
      id: "f9e348953b3848ec8b69964d5bceae02"
    },
    outFields: ["SEASON"]
  });

  // Get the map component
  const map = document.querySelector("arcgis-map");

  // Initialize map when ready
  if (!map.ready) {
    map.addEventListener("arcgisViewReadyChange", handleMapReady, {
      once: true
    });
  } else {
    handleMapReady();
  }

  // Map initialization handler
  async function handleMapReady() {
    // Add the flash flood warnings layer to the map
    map.map.add(layer);
  }

  // Get the seasons filter element
  const seasonsElement = document.getElementById("seasons-filter");

  // Add click event listener to seasons filter element
  seasonsElement.addEventListener("click", filterBySeason);

  // Filter the flash flood warnings layer by season
  function filterBySeason(event) {
    const selectedSeason = event.target.getAttribute("data-season");
    layer.filter = {
      where: "Season = '" + selectedSeason + "'"
    };
  }

  // When the map is ready
  map.view.when().then(() => {
    // Make the seasons filter visible
    seasonsElement.style.visibility = "visible";
    const seasonsExpand = new Expand({
      view: map.view,
      content: seasonsElement,
      expandIcon: "filter",
      group: "top-left"
    });

    // Clear the filter when the expand widget is closed
    reactiveUtils.when(
      () => !seasonsExpand.expanded,
      () => {
        layer.filter = null;
      }
    );

    // Add the seasons expand widget to the map
    map.view.ui.add(seasonsExpand, "top-left");
    map.view.ui.add("titleDiv", "top-right");
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

- Interactive map centered on Huntington Beach, CA
- Season-based filtering of flash flood warnings
- Expandable filter widget
- Clear filter functionality when closing the widget
- Responsive design
- Gray vector basemap for better data visualization

## Dependencies

- ArcGIS API for JavaScript 4.32
- ArcGIS Web Components 4.32
- Calcite Components
