require([
  "esri/Map",
  "esri/views/MapView",
  "esri/layers/ImageryTileLayer",
  "esri/layers/TileLayer",
  "esri/layers/GroupLayer",
  "esri/rest/support/MultipartColorRamp",
  "esri/rest/support/AlgorithmicColorRamp",
  "esri/Color",
  "esri/widgets/Legend",
  "esri/widgets/Fullscreen",
], function (
  Map,
  MapView,
  ImageryTileLayer,
  TileLayer,
  GroupLayer,
  MultipartColorRamp,
  AlgorithmicColorRamp,
  Color,
  Legend,
  Fullscreen
) {
  const spilhausBasemap = new TileLayer({
    url: "https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/Spilhaus_Vibrant_Basemap/MapServer",
    effect: "saturate(10%) brightness(0.3)", // dim brightness to create darker style basemap
  });

  const colorRamp = new MultipartColorRamp({
    colorRamps: [
      new AlgorithmicColorRamp({
        fromColor: new Color([20, 100, 150, 255]),
        toColor: new Color([70, 0, 150, 255]),
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([70, 0, 150, 255]),
        toColor: new Color([170, 0, 120, 255]),
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([170, 0, 120, 255]),
        toColor: new Color([230, 100, 60, 255]),
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([230, 100, 60, 255]),
        toColor: new Color([255, 170, 0, 255]),
      }),
      new AlgorithmicColorRamp({
        fromColor: new Color([255, 170, 0, 255]),
        toColor: new Color([255, 255, 0, 255]),
      }),
    ],
  });

  // sea surface temperature, visualized with raster stretch renderer
  const temperatureLayer = new ImageryTileLayer({
    url: "https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/HyCOM_Surface_Temperature___Spilhaus/ImageServer",
    renderer: {
      colorRamp,
      stretchType: "min-max",
      type: "raster-stretch",
    },
  });

  // ocean currents, visualized with flow renderer
  const currentsLayer = new ImageryTileLayer({
    url: "https://tiledimageservices.arcgis.com/jIL9msH9OI208GCb/arcgis/rest/services/Spilhaus_UV_ocean_currents/ImageServer",
    renderer: {
      type: "flow", // autocasts to FlowRenderer
      density: 1,
      maxPathLength: 10, // max length of a streamline will be 10
      trailWidth: "2px",
    },
    blendMode: "destination-in", // temperature layer will only display on top of this layer
  });

  // group layer to combine the two layers
  const groupLayer = new GroupLayer({
    effect: "bloom(2, 0.5px, 0.0)", // apply bloom effect to make the colors pop
    layers: [temperatureLayer, currentsLayer],
  });

  // create map
  const map = new Map({
    basemap: {
      baseLayers: [spilhausBasemap],
    },
    layers: [groupLayer],
  });

  // create map view
  const view = new MapView({
    container: "viewDiv",
    map: map,
    scale: 40000000,
    center: [-289666, -3085785],
    ui: {
      components: ["zoom", "compass", "attribution"],
    },
  });

  // add legend for temperature layer
  const legend = new Legend({
    view: view,
    layerInfos: [
      {
        layer: temperatureLayer,
        title: "Sea surface temperature",
      },
    ],
  });
  view.ui.add(legend, "top-right");

  // add fullscreen widget
  const fullscreen = new Fullscreen({
    view: view,
  });
  view.ui.add(fullscreen, "top-left");
});
