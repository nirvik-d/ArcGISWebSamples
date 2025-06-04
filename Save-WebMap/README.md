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
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Save a web map</title>

    <!-- ArcGIS Maps SDK v4.32 -->
    <link
      rel="stylesheet"
      href="https://js.arcgis.com/4.32/esri/themes/light/main.css"
    />
    <script src="https://js.arcgis.com/4.32/"></script>

    <!-- ArcGIS Map Components v4.32 -->
    <script
      type="module"
      src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"
    ></script>

    <link rel="stylesheet" href="./src/style.css" />
  </head>

  <body>
    <div id="viewDiv">
      <arcgis-map item-id="06ca49d0ddb447e7817cfc343ca30df9">
        <arcgis-expand position="top-left">
          <arcgis-legend></arcgis-legend>
        </arcgis-expand>

        <arcgis-expand position="top-left">
          <arcgis-layer-list></arcgis-layer-list>
        </arcgis-expand>

        <arcgis-expand position="top-left" icon="basemap">
          <arcgis-basemap-gallery></arcgis-basemap-gallery>
        </arcgis-expand>

        <div id="sidebarDiv" class="esri-widget">
          <h4 class="esri-heading">Save WebMap</h4>
          <label class="esri-feature-form__label">Title</label>
          <input
            id="webMapTitle"
            type="text"
            class="esri-input"
            value="My WebMap"
          />
          <input
            id="saveWebMap"
            type="button"
            value="Save"
            disabled
            class="esri-button"
          />
        </div>
        <div id="overlayDiv" class="esri-widget">
          <h4 class="esri-heading" id="head"></h4>
          <label id="info"></label>
          <input type="button" value="OK" class="esri-button" />
        </div>
      </arcgis-map>
    </div>
    <script type="module" src="./src/saveWebMap.js"></script>
  </body>
</html>

```

## Step 2: Creating the JavaScript Logic

In the `src` directory, create a file called `saveWebMap.js` to implement the map saving functionality.

```javascript

const map = document.querySelector("arcgis-map");

map.addEventListener("arcgisViewReadyChange", () => {
  const view = map.view;
  view.when(() => {
    // When the webmap and view resolve, display the webmap's
    // new title in the Div
    const title = document.getElementById("webMapTitle");
    const save = document.getElementById("saveWebMap");
    save.disabled = false;
    save.addEventListener("click", () => {
      // item automatically casts to a PortalItem instance by saveAs
      const item = {
        title: title.value,
      };

      // Update properties of the WebMap related to the view.
      // This should be called just before saving a webmap.
      map.map.updateFrom(view).then(() => {
        map.map.saveAs(item)
          // Saved successfully
          .then((item) => {
            // link to the newly-created web scene item
            const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
            const link = `<a target="_blank" href="${itemPageUrl}">${title.value}</a>`;

            statusMessage(
              "Save WebMap",
              `<br> Successfully saved as <i>${link}</i>`
            );
          })
          // Save didn't work correctly
          .catch((error) => {
            if (error.name != "identity-manager:user-aborted") {
              statusMessage("Save WebMap", `<br> Error ${error}`);
            }
          });
      });
    });

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
  });
})
```

## Step 3: Adding Custom Styling

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

#sidebarDiv {
  z-index: 1;
  position: absolute;
  margin: auto auto;
  top: 1rem;
  right: 1rem;
  width: 240px;
  height: 200px;
  padding: 10px;
  background-color: white;
  border: 1px solid grey;
}

#overlayDiv {
  z-index: 1;
  position: absolute;
  margin: auto auto;
  top: 1rem;
  right: 1rem;
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
