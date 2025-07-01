# Dot Density Visualization Component

A web application demonstrating population distribution using dot density visualization with ArcGIS Maps SDK for JavaScript.

## Features

- **Dot Density Visualization**: Visualizes data points using dot density rendering
- **Customizable Colors**: Configurable colors for different categories of data
- **Interactive Map**: Real-time updates and responsive interactions
- **ArcGIS Integration**: Built using ArcGIS Maps SDK for JavaScript
- **Modern UI**: Clean and intuitive user interface

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/6bb2d67f-5e39-45cf-b818-96c08de1f40f" />

*Map showing the different current population estimates*

## Pre-requisites

-NodeJS
-Vite

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

1. Create a dot density renderer with demographic attributes.

```javascript
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
```

2. Create a feature layer with ACS population data.

```javascript
// Create feature layer with ACS population data
const layer = new FeatureLayer({
  url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2",
  minScale: 20000000,
  renderer: dotDensityRenderer
});
```

3. Setup the map and a popup

```javascript
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
```

4. Check if the map is ready and add the layer to it.

```javascript
// Set up map initialization
  async function handleMapReady() {
    arcgisMap.map.add(layer);
  }

  if (!arcgisMap.ready) {
    arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, { once: true });
  } else {
    handleMapReady();
  }
```

5. Initialize required ArcGIS modules and put the above code inside it.

```javascript
require([
  "esri/layers/FeatureLayer",
  "esri/renderers/DotDensityRenderer"
], (FeatureLayer, DotDensityRenderer) => {
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

## Usage

1. **View the Map**
   - Open the application to see the map displaying dot density visualization
   - Each dot represents a data point in the visualization

2. **Explore Data**
   - Zoom in and out to explore different density levels
   - Pan the map to view different areas
   - Each dot represents a specific data point

3. **Customize Colors**
   - Refer to the legend to understand the color scheme
   - Colors represent different categories of data points
   - The color scheme helps distinguish between different data categories
