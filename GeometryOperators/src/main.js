require([
  "esri/Map",
  "esri/Graphic",
  "esri/layers/FeatureLayer",
  "esri/symbols/support/symbolUtils",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/geometry/operators/centroidOperator",
  "esri/geometry/operators/labelPointOperator",
], (
  Map,
  Graphic,
  FeatureLayer,
  symbolUtils,
  SimpleMarkerSymbol,
  SimpleFillSymbol,
  centroidOperator,
  labelPointOperator
) => {
  const arcgisMap = document.querySelector("arcgis-map");

  // Initialize the layer containing the state boundary polygons
  const stateBoundaryFeatureLayer = new FeatureLayer({
    url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/Cartographic_Boundary_Files_-_States_(500k)/FeatureServer/0",
  });

  arcgisMap.map = new Map({
    basemap: "hybrid",
    layers: [stateBoundaryFeatureLayer],
  });

  // Create a symbol for drawing the state polygons
  const stateFillSymbol = {
    type: "simple-fill",
    color: [227, 139, 79, 0.8],
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
  };

  // Create a symbol for drawing the extent
  const extentFillSymbol = new SimpleFillSymbol({
    color: [0, 0, 0, 0.1],
    outline: {
      color: "black",
      style: "dash-dot",
      width: 3,
    },
  });

  // Create a symbol for drawing the centroid
  const centroidMarkerSymbol = new SimpleMarkerSymbol({
    color: "red",
    size: "20px",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 1, // points
    },
  });

  // Create a symbol for drawing the label point
  const labelPointSymbol = new SimpleMarkerSymbol({
    style: "square",
    color: "blue",
    size: "14px",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [255, 255, 0],
      width: 1, // points
    },
  });

  // Create a symbol for drawing the extent center
  const extentCenterSymbol = new SimpleMarkerSymbol({
    style: "triangle",
    color: "yellow",
    size: "14px",
    outline: {
      color: "black",
      width: 1,
    },
  });

  arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
    once: true,
  });

  function handleMapReady(event) {
    let stateGraphic;

    // Listen for click events on the view
    arcgisMap.addEventListener("arcgisViewClick", (event) => {
      document.getElementById("instructionsDiv").style.display = "none";

      // Return hit test results from the feature layer
      // where it intersects the screen coordinates from the click event.
      // The result is a polygon representing the state that was clicked.
      arcgisMap.hitTest(event.detail).then((response) => {
        if (response.results.length) {
          const stateBoundaryPolygon = response.results.find((result) => {
            return result.graphic.layer === stateBoundaryFeatureLayer;
          }).graphic.geometry;

          processPolygon(stateBoundaryPolygon);
        }
      });
    });

    // Process the centroid and label point of the state polygon
    // and create graphics for the centroid, label point, extent center, and extent
    const processPolygon = (geometry) => {
      const stateCentroid = centroidOperator.execute(geometry);
      const stateLabelPoint = labelPointOperator.execute(geometry);

      // Clear the graphics layer on each click event
      arcgisMap.graphics.removeAll();

      // Create a graphic using the state boundary polygon
      const stateGraphic = new Graphic({
        geometry: geometry,
        symbol: stateFillSymbol,
      });

      // Create graphics for the centroid point from the centroidOperator
      const centroidGraphic = new Graphic({
        geometry: stateCentroid,
        symbol: centroidMarkerSymbol,
      });

      // Create a graphic for the label point from the labelPointOperator
      const labelPointGraphic = new Graphic({
        geometry: stateLabelPoint,
        symbol: labelPointSymbol,
      });

      // Create a graphic to represent the center of the state's extent
      // This point marks the exact center of the bounding box that contains the state
      const extentCenterGraphic = new Graphic({
        geometry: geometry.extent.center,
        symbol: extentCenterSymbol,
      });

      // Create a graphic to show the bounding box (extent) of the state
      // This represents the rectangular area that completely contains the state
      const extentGraphic = new Graphic({
        geometry: geometry.extent,
        symbol: extentFillSymbol,
      });

      // Add all geometric elements to the map's graphics layer
      // This includes the state boundary, centroid, label point, extent center, and extent rectangle
      arcgisMap.graphics.addMany([
        extentGraphic,
        stateGraphic,
        centroidGraphic,
        labelPointGraphic,
        extentCenterGraphic,
      ]);
    };

    // Create a custom legend to explain the symbology used in the map
    // This legend helps users understand what each symbol represents
    const displayLegend = () => {
      document.getElementById("customLegend").style.display = "block";

      // Render a preview of the extent center symbol
      // This symbol marks the center of the state's bounding box
      symbolUtils.renderPreviewHTML(extentCenterSymbol, {
        node: document.getElementById("extentCenterDiv"),
        size: { width: 20, height: 20 },
        symbolConfig: { isSquareFill: true },
      });

      // Render a preview of the label point symbol
      // This symbol marks the point where the state name is labeled
      symbolUtils.renderPreviewHTML(labelPointSymbol, {
        node: document.getElementById("labelPointDiv"),
        size: { width: 20, height: 20 },
        symbolConfig: { isSquareFill: true },
      });

      // Render a preview of the centroid symbol
      // This symbol marks the mathematical center of the state's geometry
      symbolUtils.renderPreviewHTML(centroidMarkerSymbol, {
        node: document.getElementById("centroidDiv"),
        size: { width: 20, height: 20 },
        symbolConfig: { isSquareFill: true },
      });

      // Render a preview of the extent symbol
      // This symbol represents the bounding box that contains the state
      symbolUtils.renderPreviewHTML(extentFillSymbol, {
        node: document.getElementById("extentDiv"),
        size: { width: 20, height: 20 },
        symbolConfig: { isSquareFill: true },
      });
    };
    displayLegend();
  }
});