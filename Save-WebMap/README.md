# Save a Web Map Tutorial

Welcome to the Save a Web Map tutorial! This guide will help you build a web application that saves a WebMap using the ArcGIS Maps SDK for JavaScript.

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

Now, edit the main HTML file (`index.html`) in the root of your project to include a div for the map view and a sidebar for controls:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Save a Web Map</title>

    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <div id="viewDiv"></div>
    <div id="sidebarDiv" class="esri-widget">
      <h4 class="esri-heading">Save WebMap</h4>
      <label class="esri-feature-form__label">Title</label>
      <input id="webMapTitle" type="text" class="esri-input" value="My WebMap" />
      <input id="saveWebMap" type="button" value="Save" disabled class="esri-button" />
    </div>
    <div id="overlayDiv" class="esri-widget">
      <h4 class="esri-heading" id="head"></h4>
      <label id="info"></label>
      <input type="button" value="OK" class="esri-button" />
    </div>
    <script type="module" src="./src/saveWebMap.js"></script>
  </body>
</html>
```

## Step 2: Creating the JavaScript Logic

In the `src` directory, create a file called `saveWebMap.js` to implement the map saving functionality.

```javascript
require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/LayerList",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], (
  MapView,
  WebMap,
  LayerList,
  BasemapGallery,
  Legend,
  Expand
) => {
  let webmapId = "06ca49d0ddb447e7817cfc343ca30df9";
  if (window.location.href.indexOf("?id=") > 0) {
    webmapId = window.location.href.split("?id=")[1];
  }

  const map = new WebMap({
    portalItem: {
      id: webmapId
    }
  });

  const view = new MapView({
    map: map,
    container: "viewDiv"
  });

  // Add widgets to the view
  view.ui.add([
    new Expand({
      content: new Legend({ view: view }),
      view: view,
      group: "top-left"
    }),
    new Expand({
      content: new LayerList({ view: view }),
      view: view,
      group: "top-left"
    }),
    new Expand({
      content: new BasemapGallery({ view: view }),
      view: view,
      expandIcon: "basemap",
      group: "top-left"
    })
  ], "top-left");

  // Save web map functionality
  view.when(() => {
    const title = document.getElementById("webMapTitle");
    const save = document.getElementById("saveWebMap");
    save.disabled = false;
    save.addEventListener("click", () => {
      const item = {
        title: title.value
      };

      map.updateFrom(view).then(() => {
        map.saveAs(item)
          .then((item) => {
            const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
            const link = `<a target="_blank" href="${itemPageUrl}">${title.value}</a>`;
            statusMessage("Save WebMap", `<br> Successfully saved as <i>${link}</i>`);
          })
          .catch((error) => {
            if (error.name !== "identity-manager:user-aborted") {
              statusMessage("Save WebMap", `<br> Error ${error}`);
            }
          });
      });
    });

    // Status message function
    const overlay = document.getElementById("overlayDiv");
    const ok = overlay.getElementsByTagName("input")[0];

    function statusMessage(head, info) {
      document.getElementById("head").innerHTML = head;
      document.getElementById("info").innerHTML = info;
      overlay.style.visibility = "visible";
    }

    ok.addEventListener("click", () => {
      overlay.style.visibility = "hidden";
    });

    view.ui.add("sidebarDiv", "top-right");
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

#sidebarDiv {
  width: 240px;
  padding: 10px;
  height: 200px;
}

#overlayDiv {
  z-index: 1;
  position: absolute;
  margin: auto auto;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 300px;
  height: 240px;
  padding: 10px;
  background-color: white;
  border: 1px solid grey;
  visibility: hidden;
}

input[type="text"] {
  width: 100%;
  margin-bottom: 20px;
}
```

## Step 4: Running the Application

1. Run the application using the Vite development server:
   ```bash
   npm run dev
   ```
2. Open the application in a web browser (usually at `http://localhost:5173`).
