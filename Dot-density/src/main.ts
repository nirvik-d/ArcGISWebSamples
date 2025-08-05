import "./style.css"

import "@arcgis/map-components/components/arcgis-map"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-expand"
import "@arcgis/map-components/components/arcgis-legend"
import "@arcgis/map-components/components/arcgis-bookmarks"

import DotDensityRenderer from "@arcgis/core/renderers/DotDensityRenderer"
import FeatureLayer from "@arcgis/core/layers/FeatureLayer"

// Create a dot density renderer for population visualization
// This renderer will display population distribution using dots
const dotDensityRenderer = new DotDensityRenderer({
  // Each dot represents 100 people
  // This value balances visual clarity with data representation
  dotValue: 100,

  // No outline for dots to keep visualization clean
  outline: undefined,

  // Reference scale for dot size
  // This ensures dots maintain consistent size across different zoom levels
  referenceScale: 577790,

  // Configure legend options
  legendOptions: {
    // Display population count in units of people
    unit: "people",
  },

  // Define demographic attributes to visualize
  // Each attribute represents a different population group
  attributes: [
    {
      // Field for White (non-Hispanic) population
      field: "B03002_003E",
      color: "#f23c3f", // Red color for this demographic group
      label: "White (non-Hispanic)",
    },
    {
      // Field for Hispanic population
      field: "B03002_012E",
      color: "#e8ca0d", // Yellow color for this demographic group
      label: "Hispanic",
    },
    {
      // Field for Black or African American population
      field: "B03002_004E",
      color: "#00b6f1", // Blue color for this demographic group
      label: "Black or African American",
    },
    {
      // Field for Asian population
      field: "B03002_006E",
      color: "#32ef94", // Green color for this demographic group
      label: "Asian",
    },
    {
      // Field for Other races population
      field: "B03002_005E",
      color: "#ff7fe9", // Purple color for this demographic group
      label: "American Indian/Alaskan Native",
    },
    {
      // Field for Pacific Islander/Hawaiian Native population
      field: "B03002_007E",
      color: "#e2c4a5", // Brown color for this demographic group
      label: "Pacific Islander/Hawaiian Native",
    },
    {
      // Field for Other race population
      field: "B03002_008E",
      color: "#ff6a00", // Orange color for this demographic group
      label: "Other race",
    },
    {
      // Field for Two or more races population
      field: "B03002_009E",
      color: "#96f7ef", // Light blue color for this demographic group
      label: "Two or more races",
    },
  ],
});

// URL for the feature layer
const url =
  "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/ACS_Population_by_Race_and_Hispanic_Origin_Boundaries/FeatureServer/2";

// Create a feature layer
const layer = new FeatureLayer({
  url: url,
  minScale: 20000000,
  maxScale: 35000,
  title: "Current Population Estimates (ACS)",
  popupTemplate: {
    title: "{County}, {State}",
    content: [
      {
        type: "media",
        mediaInfos: [
          // Media info for the popup
          {
            title: "Current Population Estimates (ACS)",
            type: "bar-chart",
            value: {
              fields: [
                "B03002_003E", // White (non-Hispanic)
                "B03002_012E", // Hispanic
                "B03002_004E", // Black or African American
                "B03002_006E", // Asian
                "B03002_005E", // American Indian/Alaskan Native
                "B03002_007E", // Pacific Islander/Hawaiian Native
                "B03002_008E", // Other race
                "B03002_009E", // Two or more races
              ],
              tooltipField: "<field name>",
            },
          },
        ],
        fieldInfos: [
          // Field info for the popup
          {
            fieldName: "B03002_003E", // White
            label: "White (non-Hispanic)",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_012E", // Hispanic
            label: "Hispanic",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_004E", // Black or African American
            label: "Black or African American",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_006E", // Asian
            label: "Asian",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_005E", // American Indian/Alaskan Native
            label: "American Indian/Alaskan Native",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_007E", // Pacific Islander/Hawaiian Native
            label: "Pacific Islander/Hawaiian Native",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_008E", // Other race
            label: "Other race",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
          {
            fieldName: "B03002_009E", // Two or more races
            label: "Two or more races",
            format: {
              digitSeparator: true,
              places: 0,
            },
          },
        ],
      },
      {
        type: "fields",
      },
    ],
  },
  renderer: dotDensityRenderer, // Apply the dot density renderer to the feature layer
});

// Get the map
const map: HTMLArcgisMapElement | null = document.querySelector("arcgis-map");
if (!map) {
  throw new Error("Map not found");
}

map.addEventListener("arcgisViewReadyChange", async () => {
  const view = map.view;
  if (!view) {
    throw new Error("View not found");
  }
  view.constraints = {
    maxScale: 35000,
  };
  view.popup = {
    dockEnabled: true,
    dockOptions: {
      position: "top-right",
      breakpoint: false,
    },
  };
  view.highlights = [
    {
      name: "default",
      fillOpacity: 0,
      color: [255, 255, 255],
    },
  ];

  map.map?.add(layer);
});