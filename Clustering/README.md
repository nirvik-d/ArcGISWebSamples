# ArcGIS Clustering Sample

This sample demonstrates how to implement clustering in an ArcGIS Maps SDK for JavaScript application, showing renewable energy facilities with capacity-based clustering and labeling.

## Features

- **Capacity-based Clustering**: Automatically groups nearby renewable energy facilities based on their capacity
- **Interactive Capacity Filter**: Real-time filtering of power plants based on minimum capacity threshold
- **Dynamic Labeling**: Capacity-based labels for both individual facilities and clusters
- **Customizable UI**: Dark theme styling with intuitive controls
- **Responsive Design**: Optimized for both desktop and mobile viewing

## Project Setup

### Initialize Project

```bash
# Create a new Vite project
npm create vite@latest
```

Follow the instructions on screen to initialize the project.

### Install Dependencies

```bash
npm install @arcgis/map-components
```

## Code Structure

### HTML Structure

The HTML file sets up the basic structure for the ArcGIS web application:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />

    <title>Clustering - advanced configuration</title>
  </head>

  <body>
    <arcgis-map item-id="8d91bd39e873417ea21673e0fee87604">
      <div id="infoDiv" class="esri-widget">
        <div id="description">
          Show power plants with at least
          <span id="sliderValue">0</span> megawatts of capacity
        </div>
        <div id="sliderContainer">
          <div id="sliderDiv"></div>
        </div>
        <div id="legendDiv"></div>
      </div>
    </arcgis-map>
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

### CSS Styling

The CSS file provides styling for the map view and UI elements:

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/@arcgis/core/assets/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

#infoDiv {
  padding: 10px;
  width: 275px;
}

#sliderValue{
  font-weight: bolder;
}

#legendDiv{
  width: 260px;
}

#description{
  padding: 10px 0 10px 0;
}
```

### TypeScript Implementation

1. **Import the necessary headers**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-map";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import Slider from "@arcgis/core/widgets/Slider";
```

2. **Declare the global variables**

```typescript
const clusterLabelThreshold = 1500; // Threshold for cluster labels

const haloColor = "#373837"; // Halo color for cluster labels
const color = "#f0f0f0"; // Color for cluster labels
```

3. **Create the feature layer with clustering and capacity-based labeling**

```typescript
const layer = new FeatureLayer({
  portalItem: {
    id: "eb54b44c65b846cca12914b87b315169",
  },
  featureReduction: {
    type: "cluster",
    popupTemplate: {
      title: "Cluster summary",
      content: [
        {
          type: "text",
          text: `
      This cluster represents <b>{cluster_count}</b> power plants with an average capacity of <b>{cluster_avg_capacity_mw} megawatts</b>.
       The power plants in this cluster produce a total of <b>{expression/total-mw} megawatts</b> of power.`,
        },
        {
          type: "text",
          text: "Most power plants in this cluster generate power from <b>{cluster_type_fuel1}</b>.",
        },
      ],
      fieldInfos: [
        {
          fieldName: "cluster_count",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
        {
          fieldName: "cluster_avg_capacity_mw",
          format: {
            places: 2,
            digitSeparator: true,
          },
        },
        {
          fieldName: "expression/total-mw",
          format: {
            places: 0,
            digitSeparator: true,
          },
        },
      ],
      expressionInfos: [
        {
          name: "total-mw",
          title: "total megawatts",
          expression:
            "$feature.cluster_avg_capacity_mw * $feature.cluster_count",
        },
      ],
    },
    // larger radii look better with multiple label classes
    // smaller radii looks better visually
    clusterRadius: "120px",
    labelsVisible: true,
    labelingInfo: [
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            family: "Noto Sans",
            size: "11px",
          },
          xoffset: 0,
          yoffset: "-15px",
        },
        labelPlacement: "center-center",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,### plants')",
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}`,
      },
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "2px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "18px",
          },
          xoffset: 0,
          yoffset: 0,
        },
        labelPlacement: "center-center",
        labelExpressionInfo: {
          expression: "$feature.cluster_type_fuel1",
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}`,
      },
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px",
          },
          xoffset: 0,
          yoffset: "15px",
        },
        deconflictionStrategy: "none",
        labelPlacement: "center-center",
        labelExpressionInfo: {
          expression: `
            var value = $feature.cluster_avg_capacity_mw;
            var num = Count(Text(Round(value)));

            Decode(num,
              4, Text(value / Pow(10, 3), "##.0k"),
              5, Text(value / Pow(10, 3), "##k"),
              6, Text(value / Pow(10, 3), "##k"),
              7, Text(value / Pow(10, 6), "##.0m"),
              Text(value, "#,###")
            );
          `,
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}`,
      },
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            family: "Noto Sans",
            size: "11px",
          },
          xoffset: 0,
          yoffset: "-15px",
        },
        labelPlacement: "above-right",
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,### plants')",
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}`,
      },
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "2px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "18px",
          },
        },
        labelPlacement: "above-right",
        labelExpressionInfo: {
          expression: "$feature.cluster_type_fuel1",
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}`,
      },
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px",
          },
          xoffset: 0,
          yoffset: 0,
        },
        labelPlacement: "center-center",
        labelExpressionInfo: {
          expression: `
            var value = $feature.cluster_avg_capacity_mw;
            var num = Count(Text(Round(value)));

            Decode(num,
              4, Text(value / Pow(10, 3), "##.0k"),
              5, Text(value / Pow(10, 3), "##k"),
              6, Text(value / Pow(10, 3), "##k"),
              7, Text(value / Pow(10, 6), "##.0m"),
              Text(value, "#,###")
            );
          `,
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}`,
      },
    ],
  },
  popupEnabled: true,
  labelsVisible: true,
  labelingInfo: [
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          family: "Noto Sans",
          size: "11px",
        },
        xoffset: 0,
        yoffset: "-15px",
      },
      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: "$feature.name",
      },
      where: `capacity_mw > ${clusterLabelThreshold}`,
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "2px",
        color,
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "18px",
        },
        xoffset: 0,
        yoffset: 0,
      },
      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: "$feature.fuel1",
      },
      where: `capacity_mw > ${clusterLabelThreshold}`,
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "12px",
        },
        xoffset: 0,
        yoffset: "15px",
      },
      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: `
          var value = $feature.capacity_mw;
          var num = Count(Text(Round(value)));

          Decode(num,
            4, Text(value / Pow(10, 3), "##.0k"),
            5, Text(value / Pow(10, 3), "##k"),
            6, Text(value / Pow(10, 3), "##k"),
            7, Text(value / Pow(10, 6), "##.0m"),
            Text(value, "#,###")
          );
        `,
      },
      where: `capacity_mw > ${clusterLabelThreshold}`,
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          family: "Noto Sans",
          size: "11px",
        },
        xoffset: 0,
        yoffset: "-15px",
      },
      labelPlacement: "above-right",
      labelExpressionInfo: {
        expression: "$feature.name",
      },
      where: `capacity_mw <= ${clusterLabelThreshold}`,
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "2px",
        color,
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "18px",
        },
      },
      labelPlacement: "above-right",
      labelExpressionInfo: {
        expression: "$feature.fuel1",
      },
      where: `capacity_mw <= ${clusterLabelThreshold}`,
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          weight: "bold",
          family: "Noto Sans",
          size: "12px",
        },
        xoffset: 0,
        yoffset: 0,
      },
      labelPlacement: "center-center",
      labelExpressionInfo: {
        expression: `
          var value = $feature.capacity_mw;
          var num = Count(Text(Round(value)));

          Decode(num,
            4, Text(value / Pow(10, 3), "##.0k"),
            5, Text(value / Pow(10, 3), "##k"),
            6, Text(value / Pow(10, 3), "##k"),
            7, Text(value / Pow(10, 6), "##.0m"),
            Text(value, "#,###")
          );
        `,
      },
      where: `capacity_mw <= ${clusterLabelThreshold}`,
    },
  ],
});
```

4. **Get the map and check its ready state**

```typescript
// Get the map
const map = document.querySelector("arcgis-map");
if (!map) {
  throw new Error("Map not found");
}

// Check if the map is ready
map.addEventListener("arcgisViewReadyChange", async () => {
  if (!map.ready) {
    return;
  }
});
```

5. **Inside the map ready listener, update the renderer when the feature layer is loaded**

```typescript
// Add the layer to the map
map.map?.add(layer);

// Get the view and configure it to have the desrired extent and spatial reference
const view = map.view;

view.extent = {
  spatialReference: {
    wkid: 102100,
  },
  xmin: -42087672,
  ymin: 4108613,
  xmax: -36095009,
  ymax: 8340167,
};

const layerReady = await layer.load();
if (!layerReady) {
  throw new Error("Layer not ready");
}
if (!layer.renderer) {
  throw new Error("Renderer not found");
}
const renderer = layer.renderer.clone();
if (!renderer || renderer.type !== "unique-value") {
  throw new Error("Cloned renderer not found");
}
renderer.visualVariables = [
  {
    type: "size",
    field: "capacity_mw",
    legendOptions: {
      title: "Capacity (MW)",
    },
    minSize: "24px",
    maxSize: "100px",
    minDataValue: 1,
    maxDataValue: 5000,
  } as __esri.SizeVariableProperties,
];

layer.renderer = renderer;
```

6. **Inside the map ready listener, add an info div to the UI**

```typescript
const infoDiv = document.querySelector("#infoDiv");
if (!infoDiv) {
  throw new Error("Info div not found");
}
view.ui.add(
  new Expand({
    id: "expandDiv",
    view: view,
    content: infoDiv as HTMLElement,
    expandIcon: "list-bullet",
    expanded: true,
  }),
  "top-right"
);
const legend = new Legend();
legend.view = view;
legend.container = "legendDiv";
```

7. **Inside the map ready listener, add a slider to filter the features**

```typescript
const layerView = await view.whenLayerView(layer);
const field = "capacity_mw";
const slider = new Slider({
  min: 0,
  max: 2000,
  values: [0],
  container: document.getElementById("sliderDiv"),
  visibleElements: {
    rangeLabels: true,
  },
  precision: 0,
});

const sliderValue = document.getElementById("sliderValue");
if (!sliderValue) {
  throw new Error("Slider value not found");
}
slider.on("thumb-change", (event: __esri.SliderThumbChangeEvent) => {
  sliderValue.innerText = event.value.toString();
  layerView.filter = {
    where: field + " >= " + event.value.toString(),
  };
});
slider.on("thumb-drag", (event: __esri.SliderThumbDragEvent) => {
  sliderValue.innerText = event.value.toString();
  layerView.filter = {
    where: field + " >= " + event.value.toString(),
  };
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