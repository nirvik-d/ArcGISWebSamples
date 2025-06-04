# Client-Side Projection Sample

This sample demonstrates how to perform client-side projection of geographic data using the ArcGIS Maps SDK for JavaScript. Instead of relying on server-side projection, this approach allows data to be reprojected directly in the browser, which can improve performance for certain use cases.

## Prerequisites

Before you begin, make sure you have:

1. Basic knowledge of JavaScript
2. Understanding of HTML and CSS
3. Access to a web browser
4. Node.js and npm installed
5. Familiarity with ArcGIS Maps SDK for JavaScript concepts

## Step 1: Setting Up the Project

Start by creating a Vite project.

```bash
npm create vite@latest
```

Follow the on-screen instructions to create a new Vite project (e.g., select 'Vanilla' and then 'JavaScript').

Navigate into your project directory and install dependencies:

```bash
cd <your-project-name>
npm install
```

## Step 2: Creating the HTML Structure

Now create an `index.html` file with the following structure:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Client-Side Projection Sample</title>
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>
    <link rel="stylesheet" href="src/style.css" />
  </head>
  <body>
    <div id="viewDiv"></div>
    <div id="mapSRDiv"></div>
    <select id="projectWKID">
      <option value="8857">Web Mercator</option>
      <option value="102100">Web Mercator Auxiliary Sphere</option>
      <option value="102113">WGS 1984 World Mercator</option>
      <option value="102100">WGS 1984 Web Mercator (auxiliary sphere)</option>
    </select>
    <script src="src/clientSideProjection.js"></script>
  </body>
</html>
```

## Step 3: Adding Custom Styling

Now create a `style.css` file to style the components:

```css
/* ./src/style.css */
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

#mapSRDiv {
  position: absolute;
  top: 10px;
  left: 10px;
  background: white;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#projectWKID {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
```

## Step 4: Implementing the JavaScript Code

Now create a `clientSideProjection.js` file with the following code:

## Step 5: Initialize the Map and Set the Initial Spatial Reference

```javascript
const arcgisMap = document.querySelector("arcgis-map");
const initialWKID = 8857;
arcgisMap.spatialReference = new SpatialReference({ wkid: initialWKID });
```

## Step 6: Create the GeoJSONLayer for Forest Data and configure it's

```javascript
const countriesLayer = new GeoJSONLayer({
  title: "Forest area by country",
  url: "https://developers.arcgis.com/javascript/latest/sample-code/client-projection/live/percent-forest-area.json",
  fields: [
    { name: "OBJECTID", type: "oid" },
    { name: "Country", type: "string" },
    { name: "y2015", type: "double" },
  ],
  popupTemplate: {
    title: "{Country}",
    content: "{expression/per-land-area}",
    expressionInfos: [
      {
        title: "per-land-area",
        name: "per-land-area",
        expression:
          "IIF(!IsEmpty($feature.y2015), Round($feature.y2015) + '% of the land area in this country is forest.', 'No data')",
      },
    ],
  },
  renderer: {
    type: "class-breaks",
    field: "y2015",
    visualVariables: [
      {
        type: "color",
        field: "y2015",
        stops: [
          { value: 0, color: "#D0D0CB" },
          { value: 50, color: "#4F6704" },
        ],
      },
    ],
  },
  spatialReference: new SpatialReference({ wkid: initialWKID }),
});
```

## Step 7: Handle WKID Selection Changes

```javascript
const wkidSelect = document.getElementById("projectWKID");
wkidSelect.addEventListener("calciteSelectChange", (event) => {
  arcgisMap.closePopup();
  arcgisMap.spatialReference = new SpatialReference({
    wkid: Number(wkidSelect.value),
  });
  document.getElementById(
    "mapSRDiv"
  ).innerHTML = `SpatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
});
```

## Step 8: Initialize Map When Ready

```javascript
async function handleMapReady() {
  arcgisMap.map = new Map({ layers: [countriesLayer] });
  arcgisMap.highlights.forEach((highlightOption) => {
    if (highlightOption.name === "default") {
      highlightOption.fillOpacity = 0;
    }
  });
  arcgisMap.graphics.add({
    symbol: {
      type: "simple-fill",
      color: null,
      outline: { width: 0.5, color: [208, 208, 203, 0.7] },
    },
    geometry: {
      type: "extent",
      xmin: -180,
      xmax: 180,
      ymin: -90,
      ymax: 90,
      spatialReference: SpatialReference.WGS84,
    },
  });
  document.getElementById(
    "mapSRDiv"
  ).innerHTML = `SpatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
}
```

## Step 9: Add Event Listeners

```javascript
if (!arcgisMap.ready) {
  arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
    once: true,
  });
} else {
  handleMapReady();
}
```

## Step 10: Import Required Modules

```javascript
require([
  "esri/geometry/SpatialReference",
  "esri/layers/GeoJSONLayer",
  "esri/Map",
], (SpatialReference, GeoJSONLayer, Map) => {
  // Insert the above code here.
});
```

## Step 11: Running the Application

1. Run the application using the Vite development server:
   ```bash
   npm run dev
   ```
2. Open the application in a web browser (usually at `http://localhost:5173`).
