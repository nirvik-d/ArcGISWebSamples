# Edit Features with Editor Component Tutorial

Welcome to the Edit Features with Editor Component tutorial! This guide will help you build a web application that demonstrates how to edit features using the ArcGIS Editor component.

## Prerequisites

Before we begin, make sure you have:

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

Follow the on-screen instructions to create a new Vite project.

```bash
cd <your-project-name>
npm install
```

Now, edit the main HTML file (`index.html`):

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Edit features with the Editor component</title>

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
    <arcgis-map item-id="4793230052ed498ebf1c7bed9966bd35">
      <arcgis-editor position="top-right"></arcgis-editor>
    </arcgis-map>
  </body>
</html>
```
## Step 2: Adding Custom Styling

Create a `style.css` file in the `src` directory to style the editor and map:

```css
/* Map and Editor Styles */
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

## Step 3: Running the Application

1. Run the application using `npm run dev`.
2. Open the application in a web browser and navigate to `http://localhost:5173`.
