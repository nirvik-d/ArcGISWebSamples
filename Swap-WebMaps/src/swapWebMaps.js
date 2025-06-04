require(["esri/views/MapView", "esri/WebMap"], (MapView, WebMap) => {
  const webmapids = [
    "ad5759bf407c4554b748356ebe1886e5",
    "71ba2a96c368452bb73d54eadbd59faa",
    "45ded9b3e0e145139cc433b503a8f5ab",
  ];

  /************************************************************
   * Create multiple WebMap instances
   ************************************************************/
  const webmaps = webmapids.map((webmapid) => {
    return new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: webmapid,
      },
    });
  });

  /************************************************************
   * Initialize the View with the first WebMap
   ************************************************************/
  const view = new MapView({
    map: webmaps[0],
    container: "viewDiv",
  });

  document.querySelector(".btns").addEventListener("click", (event) => {
    /************************************************************
     * On a button click, change the map of the View
     ************************************************************/
    const id = event.target.getAttribute("data-id");
    if (id) {
      const webmap = webmaps[id];
      view.map = webmap;
      const nodes = document.querySelectorAll(".btn-switch");
      for (let idx = 0; idx < nodes.length; idx++) {
        const node = nodes[idx];
        const mapIndex = node.getAttribute("data-id");
        if (mapIndex === id) {
          node.classList.add("active-map");
        } else {
          node.classList.remove("active-map");
        }
      }
    }
  });
});
