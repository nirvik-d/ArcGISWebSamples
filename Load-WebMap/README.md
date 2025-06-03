# Load a Basic WebMap Tutorial

Welcome to the Load a Basic WebMap tutorial! This guide will help you build a web application that loads and displays a WebMap using the ArcGIS Maps SDK for JavaScript.

## Prerequisites

Before you begin, make sure you have:
1. Basic knowledge of JavaScript
2. Understanding of HTML and CSS
3. Access to a web browser
4. A text editor or IDE
5. Node.js installed on your system

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

Now, edit the main HTML file (`index.html`) in the root of your project to include a div for the map view:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Load a basic WebMap</title>

    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <div id="viewDiv"></div>
    <script type="module" src="./src/loadWebMap.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

In the `src` directory, create a file called `loadWebMap.js` to load and display a WebMap.

```javascript
// ./src/loadWebMap.js

require([
  "esri/WebMap",
  "esri/views/MapView"
], function(WebMap, MapView) {
  // Create a new WebMap instance referencing a public webmap item
  const webmap = new WebMap({
    portalItem: {
      id: "f2e9b762544945f390ca4ac3671cfa72" // Sample webmap ID
    }
  });

  // Create a MapView instance (for 2D viewing) and set its container
  const view = new MapView({
    container: "viewDiv",
    map: webmap
  });
});
```

## Step 3: Adding Custom Styling

In the `src` directory, create a `style.css` file to ensure the map view fills the browser window:

```css
/* ./src/style.css */
html, body, #viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

## Step 4: Running the Application

1. Run the application using the Vite development server:
   ```bash
   npm run dev
   ```
2. Open the application in a web browser (usually at `http://localhost:5173`).