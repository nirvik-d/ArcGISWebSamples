# 2D Feature Editor

A web application demonstrating 2D feature editing using ArcGIS Maps SDK for JavaScript.

## Features

- **2D Feature Management**: Supports 2D feature editing and management
- **Interactive Editing**: Real-time editing through ArcGIS Editor widget
- **Visual Styling**: Symbol-based rendering for different feature types
- **Size Variables**: Configurable size variations for features
- **User Interface**: Tooltips and labels for better user experience
- **Map Management**: Proper initialization and layer management

## Screenshots

*2D feature editing interface*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

**Initialize the Project**
```bash
# Create a new Vite project
npm create vite@latest
```
Follow the instructions on screen to initialize the project.

**Install Dependencies**
```bash
npm install
```

**HTML Structure (index.html)**

The HTML file sets up the basic structure for the ArcGIS web application:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags and title -->
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Edit features in 2D with the Editor widget</title>

    <!-- Load required ArcGIS components -->
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    
    <!-- Custom styles -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <div id="viewDiv"></div>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

**CSS Styling (src/style.css)**

The CSS file provides styling for the map view and UI elements:

```css
html, body, #viewDiv {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}
```

**JavaScript Implementation (src/main.js)**

1. Initialize the map and view
```javascript
require([
  "esri/Map",
  "esri/views/MapView",
  "esri/widgets/Editor",
  "esri/layers/FeatureLayer",
  "esri/renderers/SimpleRenderer",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol"
], (Map, MapView, Editor, FeatureLayer, SimpleRenderer, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol) => {
  const map = new Map({
    basemap: "streets-navigation"
  });

  const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 12,
    center: [-118.24, 34.05]
  });

  // Create feature layer
  const featureLayer = new FeatureLayer({
    url: "your-feature-layer-url",
    renderer: new SimpleRenderer({
      symbol: new SimpleMarkerSymbol({
        color: [227, 119, 194, 0.7],
        size: 10,
        outline: {
          color: [0, 0, 0],
          width: 1
        }
      })
    })
  });

  map.add(featureLayer);

  // Add Editor widget
  const editor = new Editor({
    view: view,
    layerInfos: [{
      layer: featureLayer,
      fieldInfos: []
    }]
  });

  view.ui.add(editor, "top-right");
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

1. **View the Map**
   - Open the application to see the 2D map initialized
   - The map displays 2D features with proper styling

2. **Edit Features**
   - Use the Editor widget in the top-right corner to interact with features
   - Real-time updates as you modify features
   - Visual feedback during editing operations

3. **Explore Features**
   - Different feature types are styled with unique symbols
   - Size variations are visible
   - Tooltips provide additional information about features

4. **Map Navigation**
   - Use standard 2D navigation controls to explore the map
   - Zoom in/out to see different levels of detail
   - Pan the map to view different areas
