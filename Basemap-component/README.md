# ArcGIS Basemap Gallery Component

A web application demonstrating an interactive basemap gallery using ArcGIS Maps SDK for JavaScript.

## Detailed Implementation Guide

### Project Setup

1. **Initialize the Project**
   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```
   Follow the instructions on screen to initialize the project.

2. **HTML Structure (index.html)**

The HTML file sets up the basic structure of the application with the basemap gallery component:

```html
<!doctype html>
<html lang="en">

<head>
  <!-- Required meta tags -->
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no" />
  <title>Basemap Gallery component | Sample | ArcGIS Maps SDK for JavaScript 4.32</title>

  <!-- Load required ArcGIS components -->
  <!-- Calcite components for UI elements -->
  <script type="module" src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"></script>
  <!-- ArcGIS Maps SDK CSS -->
  <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
  <!-- Core ArcGIS Maps SDK -->
  <script src="https://js.arcgis.com/4.32/"></script>
  <!-- Map components for interactive features -->
  <script type="module" src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"></script>

  <!-- Custom styles -->
  <link rel="stylesheet" href="./src/style.css" />
</head>

<body>
  <!-- ArcGIS Scene -->
  <!-- Sets up the 3D scene with initial basemap and camera position -->
  <arcgis-scene basemap="topo-3d"
    camera-position="-74.034237, 40.691732, 1620" camera-tilt="57" camera-heading="57">
    <!-- ArcGIS Zoom -->
    <arcgis-zoom position="top-left"></arcgis-zoom>
    <!-- ArcGIS Basemap Gallery -->
    <arcgis-basemap-gallery position="top-right"></arcgis-basemap-gallery>
  </arcgis-scene>
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
```

4. **Running the Application**

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
   This will serve the production build locally

## Usage

1. Open the application in your web browser
2. Use the zoom control in the top-left corner to navigate
3. Click on the basemap gallery in the top-right corner
4. Select different basemaps from the gallery
5. The map will automatically update with the new basemap selection
