# Swap Web Maps Tutorial

Welcome to the Swap Web Maps tutorial! This guide will help you build a web application that allows users to switch between different WebMaps using the ArcGIS Maps SDK for JavaScript.

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

Now, edit the main HTML file (`index.html`) in the root of your project to include a div for the map view and buttons to switch between maps:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Swap Web Maps</title>

    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <div class="btns">
      <button class="btn-switch active-map" data-id="0">Map 1</button>
      <button class="btn-switch" data-id="1">Map 2</button>
      <button class="btn-switch" data-id="2">Map 3</button>
    </div>
    <div id="viewDiv"></div>
    <script type="module" src="./src/swapWebMaps.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

In the `src` directory, create a file called `swapWebMaps.js` to implement the map switching functionality.

```javascript
require(["esri/views/MapView", "esri/WebMap"], (MapView, WebMap) => {
  const webmapids = [
    "ad5759bf407c4554b748356ebe1886e5",
    "71ba2a96c368452bb73d54eadbd59faa",
    "45ded9b3e0e145139cc433b503a8f5ab"
  ];

  // Create multiple WebMap instances
  const webmaps = webmapids.map((webmapid) => {
    return new WebMap({
      portalItem: {
        id: webmapid
      }
    });
  });

  // Initialize the View with the first WebMap
  const view = new MapView({
    map: webmaps[0],
    container: "viewDiv"
  });

  // Handle button clicks to switch maps
  document.querySelector(".btns").addEventListener("click", (event) => {
    const id = event.target.getAttribute("data-id");
    if (id) {
      const webmap = webmaps[id];
      view.map = webmap;
      
      // Update button styling
      const nodes = document.querySelectorAll(".btn-switch");
      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const mapIndex = node.getAttribute("data-id");
        if (mapIndex === id) {
          node.classList.add("active-map");
        } else {
          node.classList.remove("active-map");
        }
      }
    }
  });
});
```

## Step 3: Adding Custom Styling

In the `src` directory, create a `style.css` file to style the components:

```css
/* ./src/style.css */
html, body, #viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

.btns {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 1;
}

.btn-switch {
  margin-right: 10px;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.btn-switch.active-map {
  background-color: #0079c1;
  color: white;
  border-color: #0079c1;
}
```

## Step 4: Running the Application

1. Run the application using the Vite development server:
   ```bash
   npm run dev
   ```
2. Open the application in a web browser (usually at `http://localhost:5173`).

