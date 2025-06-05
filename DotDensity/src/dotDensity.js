// Initialize ArcGIS modules
require(["esri/layers/FeatureLayer", "esri/renderers/DotDensityRenderer"], (
  FeatureLayer,
  DotDensityRenderer
) => {
  // Create a dot density renderer for population visualization
  // Each dot represents 100 people
  // Reference scale is set to 1:577,790
  const dotDensityRenderer = new DotDensityRenderer({
    dotValue: 100, // Each dot represents 100 people
    outline: null, // No outline for dots
    referenceScale: 577790, // 1:577,790 view scale
    legendOptions: {
      unit: "people", // Legend will show "people" as unit
    },
    attributes: [
      // Define race/ethnicity categories with distinct colors
      {
        field: "B03002_003E",
        color: "#f23c3f", // Red for White (non-Hispanic)
        label: "White (non-Hispanic)",
      },
      {
        field: "B03002_012E",
        color: "#e8ca0d", // Yellow for Hispanic
        label: "Hispanic",
      },
      {
        field: "B03002_004E",
        color: "#00b6f1", // Blue for Black or African American
        label: "Black or African American",
      },
      {
        field: "B03002_006E",
        color: "#32ef94", // Green for Asian
        label: "Asian",
      },
      {
        field: "B03002_005E",
        color: "#ff7fe9", // Pink for American Indian/Alaskan Native
        label: "American Indian/Alaskan Native",
      },
      {
        field: "B03002_007E",
        color: "#e2c4a5", // Brown for Pacific Islander/Hawaiian Native
        label: "Pacific Islander/Hawaiian Native",
      },
      {
        field: "B03002_008E",
        color: "#ff6a00", // Orange for Other race
        label: "Other race",
      },
      {
        field: "B03002_009E",
        color: "#96f7ef", // Cyan for Two or more races
        label: "Two or more races",
      },
    ],
  });

  // Create a FeatureLayer to display ACS population data
  const url =
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2";
  const layer = new FeatureLayer({
    url: url, // ACS Population data source
    minScale: 20000000, // Layer visible at scales smaller than 1:20,000,000
    maxScale: 35000, // Layer visible at scales larger than 1:35,000
    title: "Current Population Estimates (ACS)",
    popupTemplate: {
      title: "{County}, {State}",
      content: [
        {
          type: "media",
          mediaInfos: [
            {
              title: "Current Population Estimates (ACS)",
              type: "bar-chart", // Show population data as a bar chart
              value: {
                fields: [
                  "B03002_003E",
                  "B03002_012E",
                  "B03002_004E",
                  "B03002_006E",
                  "B03002_005E",
                  "B03002_007E",
                  "B03002_008E",
                  "B03002_009E",
                ],
                tooltipField: "<field name>",
              },
            },
          ],
        },
        {
          type: "fields", // Show detailed field values
        },
      ],
      fieldInfos: [
        // Format population numbers with thousands separators
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
        {
          fieldName: "B03002_004E",
          label: "Black or African American",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "B03002_006E",
          label: "Asian",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "B03002_005E",
          label: "American Indian/Alaskan Native",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "B03002_007E",
          label: "Pacific Islander/Hawaiian Native",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "B03002_008E",
          label: "Other race",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
        {
          fieldName: "B03002_009E",
          label: "Two or more races",
          format: {
            digitSeparator: true,
            places: 0,
          },
        },
      ],
    },
    renderer: dotDensityRenderer,
  });

  // Configure the ArcGIS map component
  const arcgisMap = document.querySelector("arcgis-map");

  // Set map constraints
  // Limit maximum zoom level to 1:35,000 scale
  arcgisMap.constraints = {
    maxScale: 35000,
  };

  // Configure map popup
  // Enable docking in top-right corner
  arcgisMap.popup = {
    dockEnabled: true,
    dockOptions: {
      position: "top-right",
      breakpoint: false, // Prevent popup from undocking on mobile
    },
  };

  // Configure map highlights
  // Set default highlight style for popup selection
  arcgisMap.highlights = [
    {
      name: "default",
      fillOpacity: 0, // No fill
      color: [255, 255, 255], // White outline
    },
  ];

  // Initialize map when ready
  if (!arcgisMap.ready) {
    // Add event listener for map ready state
    arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
      once: true, // Remove listener after first use
    });
  } else {
    // Map is already ready, initialize immediately
    handleMapReady();
  }

  // Map initialization handler
  async function handleMapReady() {
    // Add the population layer to the map
    arcgisMap.map.add(layer);
  }
});
