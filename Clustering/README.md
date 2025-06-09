# ArcGIS Clustering Sample

This sample demonstrates how to implement clustering in an ArcGIS Maps SDK for JavaScript application, showing renewable energy facilities with capacity-based clustering and labeling.

## Project Setup

1. **Initialize Project**

   ```bash
   # Create a new Vite project
   npm create vite@latest
   ```

   Follow the instructions on screen to initialize the project.

2. **Install Dependencies**
   ```bash
   npm install
   ```

## Code Structure

### HTML Structure

The HTML file sets up the basic structure for the ArcGIS web application:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta
    name="viewport"
    content="initial-scale=1,maximum-scale=1,user-scalable=no"
  />

<title>Clustering - advanced configuration</title>

<link rel="stylesheet" href="https://js.arcgis.com/4.32/esri/themes/dark/main.css" />
<script src="https://js.arcgis.com/4.32/"></script>

<link rel="stylesheet" href="./src/style.css">

</head>

<body>
  <div id="viewDiv"></div>
  <div id="infoDiv" class="esri-widget">
    <div id="description">
      Show power plants with at least <span id="sliderValue">0</span> megawatts of capacity
    </div>
    <div id="sliderContainer">
      <div id="sliderDiv"></div>
    </div>
    <div id="legendDiv"></div>
  </div>
  <script type="module" src="./src/main.js"></script>
</body>

</html>
```

### CSS Styling

The CSS file provides styling for the map view and UI elements:

```css
html, body, #viewDiv {
  height: 100%;
  width: 100%;
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

### JavaScript Implementation

1. Declare the global variables.

```javascript
const clusterLabelThreshold = 1500; // Threshold for cluster labels

const haloColor = "#373837"; // Halo color for cluster labels
const color = "#f0f0f0"; // Color for cluster labels
```

2. Configure the cluster feature reduction.

```javascript
// Purpose: Configures the cluster feature reduction
// Implementation:
// - Sets the type of feature reduction to "cluster"
// - Configures the popup template for cluster features
// - Sets the title of the popup template to "Cluster summary"
// - Configures the content of the popup template
const clusterConfig = {
    type: "cluster", // Type of feature reduction
    popupTemplate: { // Popup template for cluster features
      title: "Cluster summary",
      /**
       * Popup content for cluster features
       * @type {Array}
       */
      content: [
        {
          type: "text",
          text: `
            This cluster represents <b>{cluster_count}</b> power plants with an average capacity of <b>{cluster_avg_capacity_mw} megawatts</b>.
             The power plants in this cluster produce a total of <b>{expression/total-mw} megawatts</b> of power.`
        },
        {
          type: "text",
          text: "Most power plants in this cluster generate power from <b>{cluster_type_fuel1}</b>."
        }
      ],
      /**
       * Field information for popup template
       * @type {Array}
       */
      fieldInfos: [{
        fieldName: "cluster_count",
        format: {
          places: 0,
          digitSeparator: true
        }
      }, {
        fieldName: "cluster_avg_capacity_mw",
        format: {
          places: 2,
          digitSeparator: true
        }
      }, {
        fieldName: "expression/total-mw",
        format: {
          places: 2,
          digitSeparator: true
        }
      }],
      /**
       * Expression information for popup template
       * @type {Array}
       */
      expressionInfos: [{
        name: "total-mw",
        title: "total megawatts",
        expression: "$feature.cluster_avg_capacity_mw * $feature.cluster_count" // Expression to calculate total megawatts
      }]
    },
    clusterRadius: "120px", // Cluster radius
    labelsVisible: true, // Enable labels
    /**
     * Labeling information for cluster features
     * @type {Array}
     */
    labelingInfo: [
      {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            family: "Noto Sans",
            size: "11px"
          },
          xoffset: 0,
          yoffset: "-15px",
        },
        labelPlacement: "center-center", // Label placement
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,### plants')" // Label expression to display cluster count
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}` // Label visibility condition
      }, {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "2px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "18px"
          },
          xoffset: 0,
          yoffset: 0
        },
        labelPlacement: "center-center", // Label placement
        labelExpressionInfo: {
          expression: "$feature.cluster_type_fuel1" // Label expression to display cluster type fuel
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}` // Label visibility condition
      }, {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          },
          xoffset: 0,
          yoffset: "15px"
        },
        deconflictionStrategy: "none", // Deconfliction strategy
        labelPlacement: "center-center", // Label placement
        /**
         * Label expression to display cluster average capacity
         * @type {string}
         */
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
          `
        },
        where: `cluster_avg_capacity_mw > ${clusterLabelThreshold}` // Label visibility condition
      }, {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            family: "Noto Sans",
            size: "11px"
          },
          xoffset: 0,
          yoffset: "-15px",
        },
        labelPlacement: "above-right", // Label placement
        labelExpressionInfo: {
          expression: "Text($feature.cluster_count, '#,### plants')" // Label expression to display cluster count
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
      }, {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "2px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "18px"
          }
        },
        labelPlacement: "above-right", // Label placement
        labelExpressionInfo: {
          expression: "$feature.cluster_type_fuel1" // Label expression to display cluster type fuel
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
      },  {
        symbol: {
          type: "text",
          haloColor,
          haloSize: "1px",
          color,
          font: {
            weight: "bold",
            family: "Noto Sans",
            size: "12px"
          },
          xoffset: 0,
          yoffset: 0
        },
        labelPlacement: "center-center", // Label placement
        /**
         * Label expression to display cluster average capacity
         * @type {string}
         */
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
          `
        },
        where: `cluster_avg_capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
      }
    ]
  };
```

3. Create the feature layer with clustering and capacity-based labeling.

```javascript
// Purpose: Creates a FeatureLayer with clustering and capacity-based labeling
// Implementation:
// - Uses unique-value renderer for different facility types
// - Implements clustering based on capacity threshold
// - Uses smart labeling with capacity formatting
const featureLayer = new FeatureLayer({
    portalItem: {
      id: "eb5652665c2b4165b5625f2c422d665d"
    },
    featureReduction: clusterConfig, // Feature reduction configuration
    popupEnabled: true, // Enable popup
    labelsVisible: true, // Enable labels
    /**
     * Labeling information for power plants
     * @type {Array}
     */
    labelingInfo:[{
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          family: "Noto Sans",
          size: "11px"
        },
        xoffset: 0,
        yoffset: "-15px",
      },
      labelPlacement: "center-center", // Label placement
      labelExpressionInfo: {
        expression: "$feature.name" // Label expression to display feature name
      },
      where: `capacity_mw > ${clusterLabelThreshold}` // Label visibility condition
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
          size: "12px"
        },
        xoffset: 0,
        yoffset: "15px"
      },
      labelPlacement: "center-center", // Label placement
      /**
       * Label expression to display capacity
       * @type {string}
       */
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
        `
      },
      where: `capacity_mw > ${clusterLabelThreshold}` // Label visibility condition
    },
    {
      symbol: {
        type: "text",
        haloColor,
        haloSize: "1px",
        color,
        font: {
          family: "Noto Sans",
          size: "11px"
        },
        xoffset: 0,
        yoffset: "-15px",
      },
      labelPlacement: "above-right", // Label placement
      labelExpressionInfo: {
        expression: "$feature.name" // Label expression to display feature name
      },
      where: `capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
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
          size: "18px"
        }
      },
      labelPlacement: "above-right", // Label placement
      labelExpressionInfo: {
        expression: "$feature.fuel1" // Label expression to display feature fuel type
      },
      where: `capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
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
          size: "12px"
        },
        xoffset: 0,
        yoffset: 0
      },
      labelPlacement: "center-center", // Label placement
      /**
       * Label expression to display capacity
       * @type {string}
       */
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
        `
      },
      where: `capacity_mw <= ${clusterLabelThreshold}` // Label visibility condition
    }
    ]
  });
```

4. Create the map and view with clustering enabled.

```javascript
// Purpose: Creates the map and view with clustering enabled
// Implementation:
// - Uses vector basemap for better performance
// - Configures clustering settings
// - Sets initial view extent
const map = new Map({
  basemap: {
    portalItem: {
      id: "6d5e85c9942f449594a987e97426881e"
    }
  },
  layers: [featureLayer]
});

const view = new MapView({
  container: "viewDiv",
  map: map,
  zoom: 4,
  center: [-98.5795, 39.8282]
});
```

5. Update the renderer when the feature layer is loaded.

```javascript
// Purpose: Updates the renderer when the feature layer is loaded
// Implementation:
// - Gets the renderer from the feature layer
// - Updates the renderer with a size visual variable
// - Sets the renderer on the feature layer
featureLayer.when(() => {
  const renderer = featureLayer.renderer.clone();
  renderer.visualVariables = [{
    type:"size",
    field:"capacity_mw",
    legendOptions:{
      title:"Capacity (MW)"
    },
    minSize:"24px",
    maxSize:"100px",
    minDataValue:1,
    maxDataValue:5000
  }];
  featureLayer.renderer = renderer;
});
```

6. Add an info div to the UI.

```javascript
// Purpose: Adds an info div to the UI
// Implementation:
// - Creates an info div element
// - Adds the info div to the UI
// - Sets the info div to be expanded by default
const infoDiv = document.getElementById("infoDiv");
view.ui.add(
  new Expand({
    view:view,
    content:infoDiv,
    expandIcon:"list-bullet",
    expanded:true
  }),
  "top-right"
);
```

7. Add a slider to filter the features.

```javascript
// Purpose: Adds a slider to filter the features
// Implementation:
// - Creates a slider widget
// - Sets the slider values
// - Adds the slider to the UI
// - Updates the feature layer view filter when the slider value changes
const slider = new Slider({
  min: 0,
  max: 2000,
  values: [0],
  container: document.getElementById("sliderDiv"),
  visibleElements:{ // Make the range labels visible
    rangeLabels: true
  },
  precision: 0
});

const sliderValue = document.getElementById("sliderValue");
slider.on(["thumb-change", "thumb-drag"], (event) => {
  sliderValue.innerText = event.value;
  layerView.filter = {
    where: field + " >= " + event.value
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