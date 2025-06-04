require([
    "esri/geometry/SpatialReference",
    "esri/layers/GeoJSONLayer",
    "esri/Map"
  ], (
    SpatialReference,
    GeoJSONLayer,
    Map
  ) => {
    // Initialize the map with client-side projection
    // This sample demonstrates how to project graphics on the client side
    // instead of the server side
    //
    // The map will use a custom spatial reference (WKID 8857) and display
    // forest area data from a GeoJSON service. The data will be projected
    // in the browser rather than on the server, which can improve performance
    // for certain use cases.

    // Set the initial spatial reference (WKID 8857)
    // This is a custom spatial reference that we'll use for our map
    // It's important to set this before creating any layers that will use it
    const initialWKID = 8857;

    const arcgisMap = document.querySelector("arcgis-map");
    const viewSpatialReference = new SpatialReference({
      wkid: initialWKID
    });
    arcgisMap.spatialReference = viewSpatialReference;

    // Create a GeoJSONLayer to display forest area data
    const countriesLayer = new GeoJSONLayer({
      // Layer title for display in the legend
      title: "Forest area by country",
      
      // URL to the GeoJSON service containing forest area data
      // This service provides country polygon data with forest coverage percentages
      url: "https://developers.arcgis.com/javascript/latest/sample-code/client-projection/live/percent-forest-area.json",
      
      // Configure the layer's fields
      objectIdField: "OBJECTID",
      fields: [
        {
          name: "OBJECTID",
          alias: "ObjectID",
          type: "oid"
        },
        {
          name: "Country",
          alias: "Country",
          type: "string"
        },
        {
          name: "y2015",
          alias: "% forest area (2015)",
          type: "double"
        }
      ],
      
      // Configure the popup template to show forest area information
      // When users click on a country, this popup will display
      popupTemplate: {
        title: "{Country}",
        content: "{expression/per-land-area}",
        expressionInfos: [
          {
            title: "per-land-area",
            name: "per-land-area",
            expression:
              "IIF(!IsEmpty($feature.y2015), Round($feature.y2015) + '% of the land area in this country is forest.', 'No data')"
          }
        ]
      },
      
      // Configure the renderer to show different colors based on forest area
      renderer: {
        type: "class-breaks",
        defaultLabel: "No data",
        defaultSymbol: {
          type: "simple-fill",
          color: "#fcedcd",
          outline: {
            color: [255, 255, 255, 0.1],
            width: 0.5
          }
        },
        field: "y2015",
        legendOptions: {
          title: " "
        },
        visualVariables: [
          {
            type: "color",
            field: "y2015",
            stops: [
              { value: 0, color: "#D0D0CB" },
              { value: 50, color: "#4F6704" }
            ]
          }
        ]
      },
      
      // Set the spatial reference to match our map's WKID
      spatialReference: new SpatialReference({
        wkid: initialWKID
      })
    });

    if (!arcgisMap.ready) {
      arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
        once: true
      });
    } else {
      handleMapReady();
    }


    // Handle WKID selection changes when user picks a new projection
    const wkidSelect = document.getElementById("projectWKID");
    wkidSelect.addEventListener("calciteSelectChange", (event) => {
      // Close any open popups before changing projection
      arcgisMap.closePopup();
      
      // Update the map's spatial reference to the selected WKID
      arcgisMap.spatialReference = new SpatialReference({
        wkid: Number(wkidSelect.value)
      });

      // Update the spatial reference display to show the new WKID
      document.getElementById("mapSRDiv").innerHTML = `SpatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
    });


    // Handle map ready event when the map is fully initialized
    async function handleMapReady() {
      // Create a new Map instance with our countries layer
      arcgisMap.map = new Map({
        layers: [countriesLayer]
      });

      // Configure highlight options
      // Set fill opacity to 0 to make highlights more subtle
      arcgisMap.highlights.forEach(highlightOption => {
        if (highlightOption.name === "default") {
          highlightOption.fillOpacity = 0;
        }
      });

      // Add a world extent outline to the map
      // This helps visualize the projection changes
      arcgisMap.graphics.add({
        symbol: {
          type: "simple-fill",
          color: null,
          outline: {
            width: 0.5,
            color: [208, 208, 203, 0.7]
          }
        },
        geometry: {
          type: "extent",
          xmin: -180,
          xmax: 180,
          ymin: -90,
          ymax: 90,
          // This geometry will automatically reproject when added to the view
          spatialReference: SpatialReference.WGS84
        }
      });

      // Update the spatial reference display
      document.getElementById("mapSRDiv").innerHTML = `SpatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
    }
  });