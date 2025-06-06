require([
  "esri/portal/Portal",
  "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
], (Portal, PortalBasemapsSource) => {
  // Get the map
  const map = document.querySelector("arcgis-map");

  // Wait for the map to be ready
  map.addEventListener("arcgisViewReadyChange", () => {
    if (map.ready) {
      // Get the basemap gallery
      const basemapGallery = document.querySelector("arcgis-basemap-gallery");

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
      document.getElementById(
        "srDiv"
      ).innerHTML = `map.spatialReference.wkid = <b>${map.spatialReference.wkid}</b>`;
    }
  });
});
