# 2D Feature Editor

A web application demonstrating 2D feature editing using ArcGIS Maps SDK for JavaScript.

## Features

- **2D Feature Management**: Supports 2D feature editing and management
- **Interactive Editing**: Real-time editing through ArcGIS Editor widget
- **Visual Styling**: Symbol-based rendering for different feature types
- **Size Variables**: Configurable size variations for features
- **User Interface**: Tooltips and labels for better user experience
- **Map Management**: Proper initialization and layer management

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/84cc84db-aeb6-47b1-bf6c-64d4b7699c65" />

*2D Map view with the editor component*

## Prerequisites

- NodeJS
- Vite

## Detailed Implementation Guide

### Initialize the Project
```bash
# Create a new Vite project
npm create vite@latest
```
Follow the instructions on screen to initialize the project.

### Install Dependencies
```bash
npm install @arcgis/map-components
```

### HTML Structure (index.html)

The HTML file sets up the basic structure for the ArcGIS web application:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no" />
    <title>Edit features with the Editor component</title>
  </head>

  <body>
    <!-- ArcGIS Map -->
    <arcgis-map item-id="4793230052ed498ebf1c7bed9966bd35">
      <!-- ArcGIS Editor -->
      <arcgis-editor position="top-right"></arcgis-editor>
    </arcgis-map>
  </body>
</html>
```

### CSS Styling (src/style.css)

The CSS file provides styling for the map view and UI elements:

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

### TypeScript Implementation (src/main.ts)

1. **Add the headers to the main.ts file**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-editor";
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
