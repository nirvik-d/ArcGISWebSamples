# ArcGIS Basemap Gallery Component

A web application demonstrating an interactive basemap gallery using ArcGIS Maps SDK for JavaScript.

## Features

* **Interactive Basemap Gallery:** Provides a user interface to select and change the basemap of the scene.
* **3D Scene Visualization:** Displays a 3D globe using `arcgis-scene` with an initial basemap and camera position.
* **Zoom Control:** Includes an `arcgis-zoom` component for easy navigation and zooming within the 3D scene.
* **Seamless Integration:** Utilizes ArcGIS Maps SDK for JavaScript and Calcite components for a cohesive and modern user experience.

## Screenshot

<img width="959" alt="image" src="https://github.com/user-attachments/assets/7a2d580d-46ec-4d30-96a5-6295f2b81ffb" />

*3D Scene with topographic base map*

<img width="959" alt="image" src="https://github.com/user-attachments/assets/6ded23a9-85fb-4605-a241-f8ca1e0ed121" />

*3D Scene with street base map*

## Prerequisites

* NodeJS
* Vite

## Project Setup

1.  **Initialize the Project**

    ```bash
    # Create a new Vite project
    npm create vite@latest
    ```

    Follow the instructions on screen to initialize the project.

2.  **HTML Structure (index.html)**

    ```html
    <!doctype html>
    <html lang="en">

    <head>
        <meta charset="utf-8" />
      <meta name="viewport" content="initial-scale=1, maximum-scale=1,user-scalable=no" />
      <title>Basemap Gallery component | Sample | ArcGIS Maps SDK for JavaScript 4.32</title>

          <script type="module" src="[https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js](https://js.arcgis.com/calcite-components/3.0.3/calcite.esm.js)"></script>
        <link rel="stylesheet" href="[https://js.arcgis.com/4.32/esri/themes/light/main.css](https://js.arcgis.com/4.32/esri/themes/light/main.css)" />
        <script src="[https://js.arcgis.com/4.32/](https://js.arcgis.com/4.32/)"></script>
        <script type="module" src="[https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js](https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js)"></script>

        <link rel="stylesheet" href="./src/style.css" />
    </head>

    <body>
          <arcgis-scene basemap="topo-3d"
        camera-position="-74.034237, 40.691732, 1620" camera-tilt="57" camera-heading="57">
            <arcgis-zoom position="top-left"></arcgis-zoom>
            <arcgis-basemap-gallery position="top-right"></arcgis-basemap-gallery>
      </arcgis-scene>
    </body>
    </html>
    ```

3.  **CSS Styling (src/style.css)**

    ```css
    /* Full viewport coverage */
    html,
    body {
      padding: 0;
      margin: 0;
      height: 100%;
      width: 100%;
    }
    ```

## Running the Application

1.  **Development Server**

    ```bash
    npm run dev
    ```

    This will start the development server at `http://localhost:5173`

2.  **Build for Production**

    ```bash
    npm run build
    ```

    This will create a production-ready build in the `dist` directory

3.  **Preview Production Build**

    ```bash
    npm run preview
    ```

    This will serve the production build locally

## Usage

* **Basemap Selection:** Click on the basemap gallery in the top-right corner to open the gallery. Select different basemaps from the gallery to change the map's appearance.
* **Zoom Control:** Use the zoom control in the top-left corner to navigate and adjust the zoom level of the 3D scene.
* **Scene Interaction:** Interact with the 3D scene by panning, tilting, and rotating the camera to explore different perspectives.
