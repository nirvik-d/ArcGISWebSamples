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

1. **Initialize the Project**
   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```
   Follow the instructions on screen to initialize the project.

2. **HTML Structure (index.html)**

Edit the index.html file to include the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags and title -->
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Elevation Profile Visualization</title>

    <!-- Load required ArcGIS components -->
    <!-- Core ArcGIS Maps SDK CSS and JavaScript -->
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    
    <!-- Modern UI components from ArcGIS -->
    <script type="module" src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"></script>
    
    <!-- Custom styles -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <!-- Main ArcGIS Scene with initial camera position -->
    <!-- Uses a base map of New York City -->
    <arcgis-scene item-id="9a542f6755274436985617a462ffdf44" 
                  camera-position="-74.006438, 40.6934417, 686"
                  camera-tilt="66" 
                  camera-heading="353">
      <!-- Navigation Controls -->
      <!-- Positioned in top-left for easy access -->
      <arcgis-zoom position="top-left"></arcgis-zoom>
      <arcgis-navigation-toggle position="top-left"></arcgis-navigation-toggle>
      <arcgis-compass position="top-left"></arcgis-compass>
      
      <!-- Elevation Profile Widget -->
      <!-- Positioned in top-right for easy access -->
      <arcgis-elevation-profile position="top-right"></arcgis-elevation-profile>
    </arcgis-scene>
    
    <!-- Main application logic -->
    <script type="module" src="./src/main.js"></script>
  </body>
</html>
```

2. **CSS Styling (src/style.css)**

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

.esri-elevation-profile.esri-component.esri-widget--panel {
  width: 350px !important;
}
```

3. **JavaScript Implementation (src/main.js)**

Edit the main.js file to include the following code:

```javascript
const scene = document.querySelector("arcgis-scene");
const elevationProfile = document.querySelector("arcgis-elevation-profile");

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  elevationProfile.profiles = [
    {
      type: "ground" // First profile line samples the ground elevation
    },
    {
      type: "view" // Second profile samples the view and shows building profiles
    }
  ];
});
```

This implementation:
- Creates an elevation profile visualization with two profiles:
  - Ground profile: Shows terrain elevation
  - View profile: Shows building profiles and other 3D features
- Uses event listeners to ensure proper initialization
- Configures the elevation profile widget with appropriate settings

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

## Usage

**Create Elevation Profiles**
- Use the elevation profile tool to draw paths
- View real-time elevation data along the path
- See both ground and building elevation profiles
