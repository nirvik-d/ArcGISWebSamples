# Elevation Profile Component Tutorial

Welcome to the Elevation Profile Component tutorial! This guide will help you build a web application that showcases the ArcGIS Elevation Profile component using the ArcGIS Maps SDK for JavaScript.

## Prerequisites

Before we begin, make sure you have:

1.  Basic knowledge of JavaScript
2.  Understanding of HTML and CSS
3.  Access to a web browser
4.  A text editor or IDE
5.  Node.js installed on your system

## Step 1: Setting Up the Project Structure

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

Now, edit the main HTML file (`index.html`) in the root of your project to include the ArcGIS Scene and Elevation Profile components:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Elevation Profile Component</title>

    <!-- Load Calcite components from CDN -->
    <script
      type="module"
      src="https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js"
    ></script>

    <!-- Load the ArcGIS Maps SDK for JavaScript -->
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>

    <!-- Load Map components from CDN -->
    <script
      type="module"
      src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"
    ></script>

    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <arcgis-scene 
      item-id="aa1d3f868775475b9969088a28400474" 
      camera-position="6.954, 45.802, 4082" 
      camera-heading="315" 
      camera-tilt="74"
    >
      <arcgis-elevation-profile position="bottom-leading"></arcgis-elevation-profile>
    </arcgis-scene>
    <script type="module" src="./src/elevationProfile.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

Create a directory named `src` in your project root if it doesn't already exist. Inside the `src` directory, create a script called `elevationProfile.js`. This file will contain the logic to configure the elevation profile.

```javascript
// ./src/elevationProfile.js

const arcgisScene = document.querySelector("arcgis-scene");
const arcgisElevationProfile = document.querySelector("arcgis-elevation-profile");

arcgisScene.addEventListener("arcgisViewReadyChange", () => {
  if (arcgisScene.viewReady) {
    arcgisElevationProfile.view = arcgisScene.view;
    arcgisElevationProfile.profiles = [
      {
        type: "ground", // First profile line samples the ground elevation
        title: "Ground"
      },
      {
        type: "view", // Second profile samples the view and shows building profiles
        title: "View"
      }
    ];
  }
});
```

## Step 3: Adding Custom Styling

In the `src` directory, create a `style.css` file. Add the following basic styles to ensure the map fills the page:

```css
/* ./src/style.css */
html,
body,
arcgis-scene { /* Ensure arcgis-scene also takes full height */
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevent scrollbars */
}
```

## Step 4: Running the Application

1.  Run the application using the Vite development server:
    ```bash
    npm run dev
    ```
2.  Open the application in a web browser (usually at `http://localhost:5173`).