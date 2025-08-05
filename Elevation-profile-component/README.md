# Elevation Profile Component

A web application demonstrating elevation profile visualization using ArcGIS Maps SDK for JavaScript. This component allows users to visualize terrain elevation along a path in a 3D scene, showing both ground elevation and building profiles.

## Features

- **Elevation Visualization**: Displays terrain elevation profiles in real-time
- **3D Scene Integration**: Combines 3D visualization with elevation data
- **Path Analysis**: Shows elevation along user-defined paths
- **Building Profiles**: Includes building elevation data in profiles
- **Interactive Controls**: Modern UI with navigation and zoom controls
- **Customizable Views**: Configurable camera positions and angles

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/0fe60959-4e4e-4f40-96df-8fc238cdf414" />

*Elevation profile visualization in a 3D scene using the Elevation profile widget*

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

Edit the index.html file to include the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Elevation Profile component</title>
  </head>

  <body>
    <arcgis-scene
      item-id="9a542f6755274436985617a462ffdf44"
      camera-position="-74.006438, 40.6934417, 686"
      camera-tilt="66"
      camera-heading="353"
    >
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"> </arcgis-compass>
      <arcgis-elevation-profile position="top-right">
      </arcgis-elevation-profile>
    </arcgis-scene>
    <script type="module" src="./src/main.js"></script>
  </body>
</html>

```

### CSS Styling (src/style.css)

Edit the style.css file to include the following code:

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

.esri-elevation-profile.esri-component.esri-widget--panel {
  width: 350px !important;
}

```

### TypeScript Implementation (src/main.ts)

1. **Add the following code to the main.ts file**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-scene";
import "@arcgis/map-components/components/arcgis-elevation-profile";
import "@arcgis/map-components/components/arcgis-zoom";
import "@arcgis/map-components/components/arcgis-navigation-toggle";
import "@arcgis/map-components/components/arcgis-compass";
import Collection from "@arcgis/core/core/Collection";

const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}
const elevationProfile = document.querySelector("arcgis-elevation-profile");
if (!elevationProfile) {
  throw new Error("Elevation profile not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  elevationProfile.profiles = new Collection([
    {
      type: "ground" // First profile line samples the ground elevation
    },
    {
      type: "view" // Second profile samples the view and shows building profiles
    }
  ]);
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
This will serve the production build locally

