# Access Features with Hit Tests Tutorial

Welcome to the Access Features with Hit Tests tutorial! This guide will help you build a web application that uses hit tests to access and highlight features in a FeatureLayer using the ArcGIS Maps SDK for JavaScript.

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
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Access Features with Hit Tests</title>

    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <div id="viewDiv"></div>
    <script type="module" src="./src/accessFeaturesWithHitTests.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

In the `src` directory, create a file called `accessFeaturesWithHitTests.js` to implement the hit test functionality.

```javascript
// Get the arcgis-map component and wait for it to be ready
const arcgisMap = document.querySelector("arcgis-map");

if (!arcgisMap.ready) {
  arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
    once: true,
  });
} else {
  handleMapReady();
}

// Create the Feature Layer
const layer = new FeatureLayer({
  url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/1",
  outFields: ["NAME", "CAT", "WIND_KTS", "YEAR"],
});

// Configure the Map
arcgisMap.map = new Map({
  basemap: "dark-gray-vector",
  layers: [layer],
});

// Handle Map Ready Event
async function handleMapReady() {
  arcgisMap.highlights.forEach((highlightOption) => {
    if (highlightOption.name === "default") {
      highlightOption.color = "orange";
    }
  });
}

// Update Layer Renderer
const layerView = await arcgisMap.whenLayerView(layer);
const renderer = layer.renderer.clone();
renderer.symbol.width = 4;
renderer.symbol.color = [128, 128, 128, 0.8];
layer.renderer = renderer;

// Set Up Event Handlers
let highlight, currentYear, currentName;

// Add event listeners for pointer events
arcgisMap.addEventListener("arcgisViewPointerDown", eventHandler);

// Define Event Handler Function
async function eventHandler(event) {
  // Configure Hit Test Options
  const opts = {
    // Only include graphics from hurricanes layer
    include: [layer],
  };

  // Perform Hit Test
  const hitTestResult = await arcgisMap.hitTest(event);
  const graphics = hitTestResult.results;

  // Handle Hit Test Results
  if (graphics.length > 0) {
    const graphic = graphics[0].graphic;
    const attributes = graphic.attributes;

    // Clear previous highlight
    if (highlight) {
      highlight.remove();
    }

    // Create new highlight
    highlight = layerView.highlight(graphic);

    // Update current values
    currentYear = attributes.YEAR;
    currentName = attributes.NAME;

    // Update UI elements
    document.getElementById("year").textContent = currentYear;
    document.getElementById("name").textContent = currentName;
  }
}
```

### Step 3: Initialize the application

```javascript
require(["esri/Map", "esri/layers/FeatureLayer"], (Map, FeatureLayer) => {
  // Add the above code here
  // The code above will be executed when the modules are loaded
});
```

## Step 4: Adding Custom Styling

In the `src` directory, create a `style.css` file to style the components:

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

#infoPanel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  padding: 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#infoPanel h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

#infoPanel p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}
```

## Step 5: Running the Application

1. Run the application using the Vite development server:
   ```bash
   npm run dev
   ```
2. Open the application in a web browser (usually at `http://localhost:5173`).
