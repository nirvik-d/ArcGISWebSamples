# ArcGIS Dot Density Map Tutorial

This tutorial will guide you through creating a dot density map visualization using ArcGIS API for JavaScript. The map will show population distribution by race and ethnicity using ACS (American Community Survey) data.

## Prerequisites

- Basic knowledge of HTML, CSS, and JavaScript
- ArcGIS API for JavaScript
- Modern web browser

## Step 1: Set up the Vite project

```bash
npm create vite@latest
```

Follow the prompts to create a new project.

Navigate to the project directory:
```bash
cd <project-name>
```

Install dependencies:
```bash
npm install
```

## Step 2: Update the HTML in `index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dot Density Map</title>
    <link rel="stylesheet" href="https://js.arcgis.com/4.29/esri/themes/light/main.css">
    <link rel="stylesheet" href="src/style.css">
</head>
<body>
    <arcgis-map id="map">
        <arcgis-bookmarks></arcgis-bookmarks>
    </arcgis-map>
    <script type="module" src="src/dotDensity.js"></script>
</body>
</html>
```

## Step 3: Update the CSS in `src/style.css`
```css
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}
```

## Step 4: Configure the Dot Density Renderer in `src/dotDensity.js`

Create a dot density renderer for population visualization
```javascript
require(["esri/layers/FeatureLayer", "esri/renderers/DotDensityRenderer"], (FeatureLayer, DotDensityRenderer) => {
    const dotDensityRenderer = new DotDensityRenderer({
        dotValue: 100,              // Each dot represents 100 people
        outline: null,
        referenceScale: 577790,     // 1:577,790 view scale
        legendOptions: {
            unit: "people"
        },
        attributes: [
            {
                field: "B03002_003E",
                color: "#f23c3f",   // Red for White (non-Hispanic)
                label: "White (non-Hispanic)"
            },
            {
                field: "B03002_012E",
                color: "#e8ca0d",   // Yellow for Hispanic
                label: "Hispanic"
            },
            {
                field: "B03002_004E",
                color: "#00b6f1",   // Blue for Black or African American
                label: "Black or African American"
            },
            {
                field: "B03002_006E",
                color: "#32ef94",   // Green for Asian
                label: "Asian"
            },
            {
                field: "B03002_005E",
                color: "#ff7fe9",   // Pink for American Indian/Alaskan Native
                label: "American Indian/Alaskan Native"
            },
            {
                field: "B03002_007E",
                color: "#e2c4a5",   // Brown for Pacific Islander/Hawaiian Native
                label: "Pacific Islander/Hawaiian Native"
            },
            {
                field: "B03002_008E",
                color: "#ff6a00",   // Orange for Other race
                label: "Other race"
            },
            {
                field: "B03002_009E",
                color: "#96f7ef",   // Cyan for Two or more races
                label: "Two or more races"
            }
        ]
    });
});
```

## Step 5: Create the Feature Layer in `src/dotDensity.js` 

Add the ACS population data layer:
```javascript
const url = "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2";
const layer = new FeatureLayer({
    url: url,
    minScale: 20000000,        // Layer visible at scales smaller than 1:20,000,000
    maxScale: 35000,           // Layer visible at scales larger than 1:35,000
    title: "Current Population Estimates (ACS)",
    popupTemplate: {
        title: "{County}, {State}",
        content: [
            {
                type: "media",
                mediaInfos: [
                    {
                        title: "Current Population Estimates (ACS)",
                        type: "bar-chart",
                        value: {
                            fields: [
                                "B03002_003E",
                                "B03002_012E",
                                "B03002_004E",
                                "B03002_006E",
                                "B03002_005E",
                                "B03002_007E",
                                "B03002_008E",
                                "B03002_009E"
                            ],
                            tooltipField: "<field name>"
                        }
                    }
                ]
            },
            {
                type: "fields",
            }
        ],
        fieldInfos: [
            {
                fieldName: "B03002_003E",
                label: "White (non-Hispanic)",
                format: {
                    digitSeparator: true,
                    places: 0,
                },
            },
            {
                fieldName: "B03002_012E",
                label: "Hispanic",
                format: {
                    digitSeparator: true,
                    places: 0,
                },
            },
            // ... (add remaining fieldInfos)
        ]
    },
    renderer: dotDensityRenderer
});
```

## Step 6: Configure the Map in `src/dotDensity.js`

Set up the map with constraints and popup:
```javascript
const arcgisMap = document.querySelector("arcgis-map");
arcgisMap.constraints = {
    maxScale: 35000
};

arcgisMap.popup = {
    dockEnabled: true,
    dockOptions: {
        position: "top-right",
        breakpoint: false
    }
};

arcgisMap.highlights = [{
    name: "default",
    fillOpacity: 0,
    color: [255, 255, 255]
}];
```

## Step 7: Initialize the Map in `src/dotDensity.js`

Add the layer to the map when it's ready:
```javascript
if (!arcgisMap.ready) {
    arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
        once: true
    });
} else {
    handleMapReady();
}

async function handleMapReady() {
    arcgisMap.map.add(layer);
}
```

## Step 8: Run the Application

1. In a terminal, navigate to the project directory and run the following command:
```bash
npm run dev
```
2. Open the project in a web browser and navigate to `http://localhost:5173`.