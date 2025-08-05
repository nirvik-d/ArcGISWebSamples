# 3D Feature Editor

A web application demonstrating 3D feature editing using ArcGIS Maps SDK for JavaScript.

## Features

- **3D Feature Management**: Supports 3D recreation features with elevation support
- **Interactive Editing**: Real-time editing through ArcGIS Editor widget
- **Visual Styling**: Unique value renderer for different feature types
- **Dynamic Sizing**: Size and rotation visual variables for 3D features
- **User Interface**: Tooltips and labels for better user experience
- **Scene Management**: Proper initialization and layer management

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/e45d85e5-8f62-48fe-a1f0-00764816ea74" />

_3D Scene view with a 3D editor component_

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

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
    <title>Edit features in 3D with the Editor widget</title>
  </head>
  <body>
    <arcgis-scene item-id="206a6a13162c4d9a95ea6a87abad2437">
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-expand position="top-left">
        <arcgis-basemap-gallery></arcgis-basemap-gallery>
      </arcgis-expand>
      <arcgis-editor position="top-right"></arcgis-editor>
    </arcgis-scene>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

### CSS Styling (src/style.css)

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

### JavaScript Implementation (src/main.ts)

1. **Import the necessary headers**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-editor";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-basemap-gallery";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
```

2. **Create a recreation layer configuration**

```typescript
const recLayer = new FeatureLayer({
  title: "Recreation",
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/EditableFeatures3D/FeatureServer/1",
  elevationInfo: {
    mode: "absolute-height",
  },
  renderer: {
    type: "unique-value",
    field: "TYPE",
    visualVariables: [
      {
        type: "size",
        field: "SIZE",
        axis: "height",
        valueUnit: "meters",
      } as __esri.SizeVariable,
      {
        type: "rotation",
        field: "ROTATION",
      } as __esri.RotationVariable,
    ],
    uniqueValueInfos: [
      {
        value: "1",
        label: "Slide",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: {
                href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Slide.glb",
              },
            },
          ],
          styleOrigin: {
            styleName: "EsriRecreationStyle",
            name: "Slide",
          },
        },
      },
      {
        value: "2",
        label: "Swing",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: {
                href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Swing.glb",
              },
            },
          ],
          styleOrigin: {
            styleName: "EsriRecreationStyle",
            name: "Swing",
          },
        },
      },
    ],
  },
});
```

3. **Initialize the scene, add the layer.**

```typescript
// Get the web scene
const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  if (scene.ready) {

    // Add the recreation layer to the scene
    if(!scene.map){
      throw new Error("Map not found");
    }
    scene.map.add(recLayer);
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

This will create a production-ready build in the `dist` directory

3. **Preview Production Build**
```bash
npm run preview
```
