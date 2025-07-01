# 3D Feature Editor

A web application demonstrating 3D feature editing using ArcGIS Maps SDK for JavaScript.

## Features

- **3D Feature Management**: Supports 3D recreation features with elevation support
- **Interactive Editing**: Real-time editing through ArcGIS Editor widget
- **Visual Styling**: Unique value renderer for different feature types
- **Dynamic Sizing**: Size and rotation visual variables for 3D features
- **User Interface**: Tooltips and labels for better user experience
- **Scene Management**: Proper initialization and layer management

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/e45d85e5-8f62-48fe-a1f0-00764816ea74" />

*3D Scene view with a 3D editor component*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

**Initialize the Project**
```bash
# Create a new Vite project
npm create vite@latest
```
Follow the instructions on screen to initialize the project. This step sets up a new Vite project, which is a modern web development build tool that provides a fast and efficient way to build web applications.

**HTML Structure (index.html)**

Edit the index.html file to include the following code:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Required meta tags and title -->
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Edit features in 3D with the Editor widget</title>

    <!-- Load required ArcGIS components -->
    <!-- Core ArcGIS Maps SDK CSS and JavaScript -->
    <link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/light/main.css" />
    <script src="https://js.arcgis.com/4.32/"></script>
    <!-- Map components for modern UI elements -->
    <script type="module" src="https://js.arcgis.com/map-components/4.32/arcgis-map-components.esm.js"></script>
    
    <!-- Custom styles -->
    <link rel="stylesheet" href="./src/style.css" />
  </head>
  <body>
    <!-- Container for the entire application -->
    <div id="viewDiv">
      <!-- Main ArcGIS Scene component with base map -->
      <arcgis-scene item-id="206a6a13162c4d9a95ea6a87abad2437"></arcgis-scene>
      <!-- Main application logic -->
      <script type="module" src="./src/main.js"></script>
    </div>
  </body>
</html>
```

This structure:
- Sets up a responsive viewport
- Loads essential ArcGIS components
- Creates a container for the scene
- Initializes the main application logic

**CSS Styling (src/style.css)**

Edit the style.css file to include the following code:

```css
/* Full viewport coverage */
html,
body,
#viewDiv {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

This styling:
- Ensures full viewport coverage
- Removes default margins and padding
- Makes the scene fill the entire viewport
- Creates a responsive layout

**JavaScript Implementation (src/main.js)**

Edit the main.js file to include the following code:

1. Create a recreation layer configuration

```javascript
// This layer manages 3D recreation features with elevation support
  const recLayer = new FeatureLayer({
    title: "Recreation",
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/EditableFeatures3D/FeatureServer/1",
    elevationInfo: {
      mode: "absolute-height"
    },
    renderer: {
      type: "unique-value",
      field: "TYPE",
      // Visual variables control feature appearance
      visualVariables: [
        {
          type: "size",
          field: "SIZE",
          axis: "height",
          valueUnit: "meters"
        },
        {
          type: "rotation",
          field: "ROTATION"
        }
      ],
      // Unique value renderer assigns symbols based on feature type
      uniqueValueInfos: [
        {
          value: "1",
          label: "Slide",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: {
                  href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Slide.glb"
                }
              }
            ],
            styleOrigin: {
              styleName: "EsriRecreationStyle",
              name: "Slide"
            }
          }
        },
        {
          value: "2",
          label: "Swing",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: {
                  href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Swing.glb"
                }
              }
            ],
            styleOrigin: {
              styleName: "EsriRecreationStyle",
              name: "Swing"
            }
          }
        }
      ]
    }
  });
```

2. Initialize the scene, add the layer, and configure the editor widget.

```javascript
 const scene = document.querySelector("arcgis-scene");
  scene.addEventListener("arcgisViewReadyChange", () => {
    if (scene.ready) {
      // Add the recreation layer to the scene
      scene.map.add(recLayer);
      const view = scene.view;

      // Configure editor widget
      view.when(() => {
        // Disable default popup for custom editing experience
        view.popupEnabled = false;
        const editor = new Editor({
          view: view,
          // Enable tooltips for better user guidance
          tooltipOptions: {
            enabled: true
          },
          // Enable labels for feature identification
          labelOptions: {
            enabled: true
          }
        });

        // Add editor to UI in top-right position
        view.ui.add(editor, "top-right");
      });
    }
  });
```

3. Initialize required ArcGIS modules and add the above code inside the require function.

```javascript
require(["esri/layers/FeatureLayer", "esri/widgets/Editor"], function (
  FeatureLayer,
  Editor
) { 
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
