# Dot Density Visualization Component

A web application demonstrating population distribution using dot density visualization with ArcGIS Maps SDK for JavaScript.

## Project Setup

**Initialize Project**
   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```
   Follow the instructions on screen to initialize the project.

## Code Structure

**HTML Structure (index.html)**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Dot Density Visualization</title>
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
  </head>
  <body>
    <arcgis-map id="viewDiv"></arcgis-map>
    <div id="popupDiv"></div>
  </body>
</html>
```

**CSS Styling (src/style.css)**

```css
#viewDiv {
  height: 100vh;
  width: 100vw;
}

#popupDiv {
  position: absolute;
  top: 10px;
  right: 10px;
}
```

**JavaScript Implementation (src/main.js)**

```javascript
// Initialize required ArcGIS modules
require([
  "esri/layers/FeatureLayer",
  "esri/renderers/DotDensityRenderer"
], (FeatureLayer, DotDensityRenderer) => {
  // Create dot density renderer with demographic attributes
  const dotDensityRenderer = new DotDensityRenderer({
    dotValue: 100, // Each dot represents 100 people
    outline: null,
    referenceScale: 577790,
    legendOptions: {
      unit: "people"
    },
    attributes: [
      {
        field: "B03002_003E",
        color: "#f23c3f",
        label: "White (non-Hispanic)"
      },
      {
        field: "B03002_012E",
        color: "#e8ca0d",
        label: "Hispanic"
      },
      {
        field: "B03002_004E",
        color: "#00b6f1",
        label: "Black or African American"
      }
      // ... additional demographic groups
    ]
  });

  // Create feature layer with ACS population data
  const layer = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2",
    minScale: 20000000,
    renderer: dotDensityRenderer
  });

  // Configure map with popup and constraints
  const arcgisMap = document.querySelector("arcgis-map");
  arcgisMap.constraints = {
    maxScale: 35000
  };

  arcgisMap.popup = {
    dockEnabled: true,
    dockOptions: {
      position: "top-right",
      breakpoint: false
    }
  };

  // Set up map initialization
  async function handleMapReady() {
    arcgisMap.map.add(layer);
  }

  if (!arcgisMap.ready) {
    arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, { once: true });
  } else {
    handleMapReady();
  }
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
