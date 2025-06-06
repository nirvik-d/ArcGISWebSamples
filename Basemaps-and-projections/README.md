# Basemaps and Projections Component

A web application demonstrating different basemaps and projections using ArcGIS Maps SDK for JavaScript.

## Prerequisites

- ArcGIS Maps SDK v4.32
- ArcGIS Map Components v4.32

## Detailed Implementation Guide

1. **Initialize the Project**
   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```
   Follow the instructions on screen to initialize the project.

2. **HTML Structure (index.html)**

Edit the index.html file to include the following code:

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>Basemaps with different projections</title>

  <!-- Load Calcite components from CDN -->
  <script type="module" src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"></script>

  <!-- Load required ArcGIS components -->
  <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
  <script src="https://js.arcgis.com/4.32/"></script>

  <!-- Load Map components from CDN -->
  <script type="module" src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"></script>

  <!-- Custom styles -->
  <link rel="stylesheet" href="./src/style.css" />
</head>

<body>
  <!-- Main ArcGIS Map with initial position -->
  <arcgis-map item-id="8d91bd39e873417ea21673e0fee87604" center="-100, 35" zoom="2">
    <!-- Navigation Controls -->
    <arcgis-zoom position="top-left"></arcgis-zoom>
    
    <!-- Spatial Reference Display -->
    <arcgis-placement position="top-right">
      <div id="srDiv" class="esri-widget"></div>
    </arcgis-placement>
    
    <!-- Basemap Gallery -->
    <arcgis-expand position="top-right">
      <arcgis-basemap-gallery></arcgis-basemap-gallery>
    </arcgis-expand>
  </arcgis-map>
  
  <!-- Main application logic -->
  <script type="module" src="./src/main.js"></script>
</body>
</html>
```

3. **CSS Styling (src/style.css)**

Edit the style.css file to include the following code:

```css
/* Full viewport coverage */
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#srDiv {
  height: 40px;
  padding: 10px;
}
```

4. **JavaScript Implementation (src/main.js)**

Edit the main.js file to include the following code:

```javascript
// Initialize required ArcGIS modules
require([
  "esri/portal/Portal",
  "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
], (Portal, PortalBasemapsSource) => {
  // Get reference to the map component
  // Using querySelector to interact with the ArcGIS web component
  const map = document.querySelector("arcgis-map");

  // Wait for the map to be fully initialized
  // Ensures all components are ready before configuration
  map.addEventListener("arcgisViewReadyChange", () => {
    if (map.ready) {
      // Get reference to the basemap gallery widget
      // Using querySelector to interact with the ArcGIS web component
      const basemapGallery = document.querySelector("arcgis-basemap-gallery");

      // Create a portal instance
      // Portal is used to access ArcGIS Online services
      const portal = new Portal();

      // Create a source for basemaps from a portal group
      // This specific group ID contains basemaps with different projections
      // The group ID is from ArcGIS Online and contains curated basemaps
      const source = new PortalBasemapsSource({
        portal,
        query: {
          id: "bdb9d65e0b5c480c8dcc6916e7f4e099",
        },
      });

      // Set the source for the basemap gallery
      // This will populate the gallery with basemaps from the portal group
      basemapGallery.source = source;

      // Update the spatial reference information
      // Shows the current map projection's Well-Known ID (WKID)
      // This helps users understand the current map projection
      document.getElementById(
        "srDiv"
      ).innerHTML = `map.spatialReference.wkid = <b>${map.spatialReference.wkid}</b>`;
    }
  });
});
```

This implementation:
- Shows different projections through a portal group
- Displays the current spatial reference WKID
- Provides a clean interface for basemap switching

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
   This will serve the production build locally
