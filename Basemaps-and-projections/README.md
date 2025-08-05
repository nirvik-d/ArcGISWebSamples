# Basemaps and Projections Component

A web application demonstrating different basemaps and projections using ArcGIS Maps SDK for JavaScript.

## Features

* **Dynamic Basemap Switching:** Allows users to select and change basemaps from a curated gallery.
* **Multiple Projections:** Showcases basemaps with various spatial references, demonstrating how different projections affect the map display.
* **Spatial Reference Display:** Dynamically displays the Well-Known ID (WKID) of the currently active map projection.
* **Interactive Map Navigation:** Includes zoom controls for easy exploration of the map.
* **Custom Basemap Source:** Utilizes a specific ArcGIS Online portal group to provide a collection of basemaps with diverse projections.

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/d8f79986-fe57-43c5-b6f1-b3a6657a1ab2" />

*Nova Map with a projection id of 102100.*

<img width="959" alt="image" src="https://github.com/user-attachments/assets/e8904dd0-9dcc-4baa-be42-ad3ecc99c05b" />

*Colored Web Map with a projection id of 102100*

## Prerequisites

* NodeJS
* Vite

## Detailed Implementation Guide

### Initialize a new Vite Project

```bash
npm create vite@latest
```

Follow the instructions on screen to initialize the project.

### Install dependencies

```bash
npm install @arcgis/map-components
```

### HTML Structure (index.html)

```html
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
  <title>Basemaps with different projections</title>
</head>

<body>
  <arcgis-map item-id="8d91bd39e873417ea21673e0fee87604" center="-100, 35" zoom="2">
    <arcgis-zoom position="top-left"></arcgis-zoom>
    <arcgis-placement position="top-right">
      <div id="srDiv" class="esri-widget"></div>
    </arcgis-placement>
    <arcgis-expand position="top-right">
      <arcgis-basemap-gallery></arcgis-basemap-gallery>
    </arcgis-expand>
  </arcgis-map>
  <script type="module" src="./src/main.ts"></script>
</body>

</html>
```

### CSS Styling (src/style.css)

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/@arcgis/core/assets/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

#srDiv {
  height: 40px;
  padding: 10px;
}
```

### TypeScript Implementation (src/main.ts)

1. **Begin by importing the necessary headers.**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-zoom";

import Portal from "@arcgis/core/portal/Portal";
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource";
```

2. **Get the map and check if its ready**

```typescript
// Get the map
const map = document.querySelector("arcgis-map");
if (!map) {
  console.error("Map not found");
} 
```

3. **When the map is ready, get the basemap gallery, set the source and update the spatial reference information**

```typescript
else {
  // Wait for the map to be ready
  map.addEventListener("arcgisViewReadyChange", () => {
    if (map.ready) {
      // Get the basemap gallery
      const basemapGallery = document.querySelector("arcgis-basemap-gallery");
      if (!basemapGallery) {
        console.error("Basemap gallery not found");
        return;
      }

      // Create a portal instance
      const portal = new Portal();

      // Create a source for basemaps from a portal group
      // containing basemaps with different projections
      const source = new PortalBasemapsSource({
        portal,
        query: {
          id: "bdb9d65e0b5c480c8dcc6916e7f4e099",
        },
      });

      // Set the source for the basemap gallery
      basemapGallery.source = source;

      // Update the spatial reference information
      const srDiv = document.querySelector("#srDiv");
      if (!srDiv) {
        console.error("SR Div not found");
        return;
      } else {
        srDiv.innerHTML = `map.spatialReference.wkid = <b>${map.spatialReference.wkid}</b>`;
      }
    }
  });
}
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
