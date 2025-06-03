require([
  "esri/portal/Portal",
  "esri/widgets/BasemapGallery/support/PortalBasemapsSource",
], (Portal, PortalBasemapsSource) => {
  const arcgisMap = document.querySelector("arcgis-map");

  // get the basemap gallery element
  const basemapGallery = document.querySelector("arcgis-basemap-gallery");
  // create a portal instance
  const portal = new Portal();

  // source for basemaps from a portal group
  // containing basemaps with different projections
  const source = new PortalBasemapsSource({
    portal,
    query: {
      id: "bdb9d65e0b5c480c8dcc6916e7f4e099",
    },
  });
  basemapGallery.source = source;

  const updateSRInfo = () => {
    if (arcgisMap.ready) {
      document.getElementById(
        "srDiv"
      ).innerHTML = `map.spatialReference.wkid = <b>${arcgisMap.spatialReference.wkid}</b>`;
    }
  };
  arcgisMap.addEventListener("arcgisViewChange", updateSRInfo);
});
