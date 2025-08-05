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

<img width="959" alt="image" src="https://github.com/user-attachments/assets/4d23666a-8a00-4094-bb3f-7a9bda81acf7" />

*Interactive weather visualization in a 3D scene*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

### Project Setup

### Initialize the Project
```bash
# Create a new Vite project
npm create vite@latest
```
Follow the instructions on screen to initialize the project.

### Install Dependencies
```bash
npm install @arcgis/map-components
```

### HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Weather component</title>
  </head>

  <body>
    <arcgis-scene item-id="c56dab9e4d1a4b0c9d1ee7f589343516">
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"> </arcgis-compass>
      <arcgis-expand position="top-right" group="top-right">
        <arcgis-weather> </arcgis-weather>
        <arcgis-daylight> </arcgis-daylight>
      </arcgis-expand>
    </arcgis-scene>

    <calcite-segmented-control id="floodSelection" width="full">
      <calcite-segmented-control-item value="noFlooding" checked=""
        >No flooding</calcite-segmented-control-item
      >
      <calcite-segmented-control-item value="flooding"
        >Flooding</calcite-segmented-control-item
      >
    </calcite-segmented-control>

    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

### CSS Styling (src/style.css)

The CSS file provides basic styling for the application:

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/@arcgis/core/assets/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#floodSelection {
  position: absolute;
  bottom: 20px;
  left: 50px;
  right: 50px;
  display: flex;
  justify-content: center;
}
```

### TypeScript Implementation (src/main.ts)

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-scene"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-navigation-toggle"
import "@arcgis/map-components/components/arcgis-compass"
import "@arcgis/map-components/components/arcgis-expand"
import "@arcgis/map-components/components/arcgis-weather"
import "@arcgis/map-components/components/arcgis-daylight"

import "@esri/calcite-components/components/calcite-segmented-control";
import "@esri/calcite-components/components/calcite-segmented-control-item";

const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  scene.environment.weather = {
    type: "cloudy",
    cloudCover: 0.3,
  };

  // Get if the flood selection is changed
  const floodSelection = document.getElementById("floodSelection");
  if (!floodSelection) {
    throw new Error("Flood selection not found");
  }

  // Get the Flood layer
  if (!scene.map) {
    throw new Error("Map not found");
  }
  let floodLevelLayer = scene.map.allLayers.find(
    (layer) => layer.title === "Flood Level"
  );
  if (!floodLevelLayer) {
    throw new Error("Flood level layer not found");
  }

  // Add event listener to the flood selection
  floodSelection.addEventListener("calciteSegmentedControlChange", (event: Event) => {
    if (!event.target) {
      throw new Error("Flood selection target not found");
    }
    switch ((event.target as HTMLInputElement).value) {
      // If no flooding is selected
      case "noFlooding":
        scene.environment.weather = {
          type: "cloudy",
          cloudCover: 0.3,
        };
        floodLevelLayer.visible = false;
        break;

      // If flooding is selected
      case "flooding":
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