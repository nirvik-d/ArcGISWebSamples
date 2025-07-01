# ArcGIS Weather Component

A web application demonstrating an interactive weather component using ArcGIS Maps SDK for JavaScript. This component provides real-time weather visualization and interactive controls.

## Features

- **Real-time Weather**: Displays current weather conditions
- **Interactive Controls**: Modern UI with expandable weather panel
- **3D Visualization**: Weather data displayed in a 3D scene
- **Navigation Tools**: Complete set of navigation controls
- **Calcite Integration**: Uses Calcite components for enhanced UI
- **Modern UI**: Clean and intuitive user interface

## Screenshots

*Interactive weather visualization in a 3D scene*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

### Project Setup

1. **Initialize the Project**
   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```
   Follow the instructions on screen to initialize the project.

2. **HTML Structure (index.html)**

The HTML file sets up the basic structure of the application:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags and title -->
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Weather component</title>

    <!-- Load required ArcGIS components -->
    <script type="module" src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"></script>
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    <script type="module" src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"></script>

    <!-- Custom styles -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>

  <body>
    <!-- Main ArcGIS Scene -->
    <arcgis-scene item-id="c56dab9e4d1a4b0c9d1ee7f589343516">
      <!-- Navigation Controls -->
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"></arcgis-compass>

      <!-- Expandable Controls -->
      <arcgis-expand position="top-right" group="top-right" expanded>
        <arcgis-weather></arcgis-weather>
      </arcgis-expand>
      <arcgis-expand position="top-right" group="top-right">
        <arcgis-daylight></arcgis-daylight>
      </arcgis-expand>
    </arcgis-scene>

    <!-- Flood Selection Control -->
    <calcite-segmented-control id="floodSelection" width="full">
      <calcite-segmented-control-item value="noFlooding" checked> No flooding </calcite-segmented-control-item>
      <calcite-segmented-control-item value="flooding"> Flooding </calcite-segmented-control-item>
    </calcite-segmented-control>
  </body>
</html>
```

3. **CSS Styling (src/style.css)**

The CSS file provides basic styling for the application:

```css
/* Full viewport coverage */
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

/* Positioning the flood selection control */
#floodSelection {
  position: absolute;
  bottom: 20px;
  left: 50px;
  right: 50px;
  display: flex;
  justify-content: center;
}
```

4. **JavaScript Implementation (src/main.js)**

The main JavaScript file handles all the interactive functionality:

```javascript
// Select the ArcGIS scene element
const scene = document.querySelector("arcgis-scene");

// Wait for the scene to be ready before initializing
scene.addEventListener("arcgisViewReadyChange", () => {
  // Set initial weather conditions
  // Cloudy weather with 30% cloud cover provides a neutral starting point
  scene.environment.weather = {
    type: "cloudy",
    cloudCover: 0.3,
  };

  // Get reference to the flood selection control
  const floodSelection = document.getElementById("floodSelection");

  // This layer contains the flood simulation data
  let floodLevelLayer = scene.map.allLayers.find(
    (layer) => layer.title === "Flood Level"
  );

  // Add event listener for flood selection changes
  floodSelection.addEventListener("calciteSegmentedControlChange", () => {
    // Handle flood/no-flood selection
    switch (floodSelection.selectedItem.value) {
      case "noFlooding":
        // When no flooding is selected:
        // - Set weather back to cloudy (30% cloud cover)
        // - Hide the flood layer
        scene.environment.weather = {
          type: "cloudy",
          cloudCover: 0.3,
        };
        floodLevelLayer.visible = false;
        break;

      case "flooding":
        // When flooding is selected:
        // - Set rainy weather (70% cloud cover, 30% precipitation)
        // - Show the flood layer
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

1. **View Weather Data**
   - Open the application to see the 3D scene with weather data
   - The weather component is expandable from the top-right corner
   - Current weather conditions are displayed in real-time

2. **Use Weather Controls**
   - Expand the weather panel to access detailed weather information
   - Interact with weather data directly in the 3D scene
   - Use the weather widget's built-in controls

3. **Navigate the Scene**
   - Use standard 3D navigation controls:
     - Zoom in/out with the zoom control (top-left)
     - Pan and rotate the view
     - Use the compass to orient yourself

4. **Use Navigation Tools**
   - Zoom: Use the zoom control in top-left
   - Navigation Toggle: Switch between navigation modes
   - Compass: Use the compass to orient the view
   - Expandable Weather Panel: Access detailed weather information