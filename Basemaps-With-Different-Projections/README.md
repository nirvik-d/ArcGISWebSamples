# Basemaps with Different Projections Tutorial

Welcome to the Basemaps with Different Projections tutorial! This guide will help you build a web application that demonstrates working with basemaps in various projections using the ArcGIS Maps SDK for JavaScript.

## Prerequisites

Before we begin, make sure you have:

1. Basic knowledge of JavaScript
2. Understanding of HTML and CSS
3. Access to a web browser
4. A text editor or IDE

## Step 1: Setting Up the Project Structure

Start by creating a Vite project.

```bash
npm create vite@latest
```

Follow the on-screen instructions to create a new vite project.

```bash
cd <your-project-name>
npm install
```

Now, edit the main HTML file (`index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Basemaps with Different Projections</title>

    <!-- Load Calcite components from CDN -->
    <script
      type="module"
      src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"
    ></script>

    <!-- Load ArcGIS Maps SDK for JavaScript from CDN -->
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/dark/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>

    <!-- Load Map components from CDN -->
    <script
      type="module"
      src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"
    ></script>

    <!-- Load custom styles -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <arcgis-map
      item-id="8d91bd39e873417ea21673e0fee87604"
      center="-100, 35"
      zoom="2"
    >
      <!-- Add zoom control -->
      <arcgis-zoom position="top-left"></arcgis-zoom>
      
      <!-- Add spatial reference display -->
      <arcgis-placement position="top-right">
        <div id="srDiv" class="esri-widget"></div>
      </arcgis-placement>
      
      <!-- Add basemap gallery -->
      <arcgis-expand position="top-right">
        <arcgis-basemap-gallery></arcgis-basemap-gallery>
      </arcgis-expand>
    </arcgis-map>
    <script type="module" src="./src/basemaps.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

Create a script called `basemaps.js` in the `src` directory. This file will contain the logic for managing basemaps with different projections.

```javascript
require([
  "esri/portal/Portal",
  "esri/widgets/BasemapGallery/support/PortalBasemapsSource"
], (Portal, PortalBasemapsSource) => {
  // Get the map element
  const arcgisMap = document.querySelector("arcgis-map");
  
  // Get the basemap gallery element
  const basemapGallery = document.querySelector("arcgis-basemap-gallery");
  
  // Create a portal instance
  const portal = new Portal();

  // Configure the basemap source
  const source = new PortalBasemapsSource({
    portal,
    query: {
      id: "bdb9d65e0b5c480c8dcc6916e7f4e099" // Portal group ID containing basemaps
    }
  });

  // Set the basemap gallery source
  basemapGallery.source = source;

  // Function to update spatial reference display
  const updateSRInfo = () => {
    if (arcgisMap.ready) {
      document.getElementById(
        "srDiv"
      ).innerHTML = `map.spatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
    }
  };

  // Listen for map view changes
  arcgisMap.addEventListener("arcgisViewChange", updateSRInfo);
});
```

## Step 3: Adding Custom Styling

Create a `style.css` file in the `src` directory to style the spatial reference display:

```css
/* Spatial Reference Display */
#srDiv {
  padding: 8px;
  background-color: var(--calcite-color-background);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Ensure the spatial reference display is visible */
.esri-widget {
  z-index: 1000;
}
```

## Step 4: Running the Application

1. Run the application using `npm run dev`.
2. Open the application in a web browser and navigate to `http://localhost:5173`.
