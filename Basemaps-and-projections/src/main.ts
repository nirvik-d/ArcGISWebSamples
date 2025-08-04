import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-basemap-gallery";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-zoom";

import Portal from "@arcgis/core/portal/Portal";
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource";

// Get the map
const map = document.querySelector("arcgis-map");
if (!map) {
  console.error("Map not found");
} else {
  // Wait for the map to be ready
  map.addEventListener("arcgisViewReadyChange", () => {
    if (map.ready) {
      // Get the basemap gallery
      const basemapGallery = document.querySelector("arcgis-basemap-gallery");
      if (!basemapGallery) {
        console.error("Basemap gallery not found");
        return;
      }

      // Create a portal instance
      const portal = new Portal();

      // Create a source for basemaps from a portal group
      // containing basemaps with different projections
      const source = new PortalBasemapsSource({
        portal,
        query: {
          id: "bdb9d65e0b5c480c8dcc6916e7f4e099",
        },
      });

      // Set the source for the basemap gallery
      basemapGallery.source = source;

      // Update the spatial reference information
      const srDiv = document.querySelector("#srDiv");
      if (!srDiv) {
        console.error("SR Div not found");
        return;
      } else {
        srDiv.innerHTML = `map.spatialReference.wkid = <b>${map.spatialReference.wkid}</b>`;
      }
    }
  });
}
