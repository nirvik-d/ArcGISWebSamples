require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Slider",
  "esri/widgets/Expand"
], (Map, MapView, FeatureLayer, Slider, Expand) => {
  const clusterLabelThreshold = 1500; // Threshold for cluster labels

  const haloColor = "#373837"; // Halo color for cluster labels
  const color = "#f0f0f0"; // Color for cluster labels

  /**
   * Configuration for cluster feature reduction
   * @type {Object}
   */
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

  /**
   * Feature layer for power plants
   * @type {FeatureLayer}
   */
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

  /**
   * Map object
   * @type {Map}
   */
  const map = new Map({
    basemap:{
      portalItem:{
        id:"8d91bd39e873417ea21673e0fee87604"
      }
    },
    layers:[featureLayer]
  });

  /**
   * Map view object
   * @type {MapView}
   */
  const view = new MapView({
    container:"viewDiv", // Container for the map view
    map:map, // Map object
    extent:{
      spatialReference:{
        latestWkid:3857,
        wkid:102100
      },
      xmin:-42087672,
      ymin:4108613,
      xmax:-36095009,
      ymax:8340167
    }
  });

  // When the feature layer is loaded, update the renderer
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

  /**
   * Info div element
   * @type {HTMLElement}
   */
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

  /**
   * When the feature layer view is loaded, add a slider to filter the features
   * @param {LayerView} layerView
   */
  view.whenLayerView(featureLayer).then((layerView) => {
    const field = "capacity_mw";

    /**
     * Slider widget for filtering features
     * @type {Slider}
     */
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

    /**
     * Slider value element
     * @type {HTMLElement}
     */
    const sliderValue = document.getElementById("sliderValue");
    slider.on(["thumb-change", "thumb-drag"], (event) => {
      sliderValue.innerText = event.value;
      layerView.filter = {
        where: field + " >= " + event.value
      };
    });
  });
});