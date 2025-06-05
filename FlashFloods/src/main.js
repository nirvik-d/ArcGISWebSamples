require([
  "esri/layers/FeatureLayer",
  "esri/widgets/Expand",
  "esri/core/reactiveUtils",
], (FeatureLayer, Expand, reactiveUtils) => {

  // flash flood warnings layer
  const layer = new FeatureLayer({
    portalItem: {
      id: "f9e348953b3848ec8b69964d5bceae02",
    },
    outFields: ["SEASON"],
  });

  const map = document.querySelector("arcgis-map");

  // Initialize map when ready
  if (!map.ready) {
    // Add event listener for map ready state
    map.addEventListener("arcgisViewReadyChange", handleMapReady, {
      once: true, // Remove listener after first use
    });
  } else {
    // Map is already ready, initialize immediately
    handleMapReady();
  }

  // Map initialization handler
  async function handleMapReady() {
    // Add the flash flood warnings layer to the map
    map.map.add(layer);
  }

  // Get the map view
  const view = map.view;

  // Get the seasons filter element
  const seasonsElement = document.getElementById("seasons-filter");

  // Add click event listener to seasons filter element
  seasonsElement.addEventListener("click", filterBySeason);

  // Filter the flash flood warnings layer by season
  function filterBySeason(event) {
    const selectedSeason = event.target.getAttribute("data-season");
    layer.filter = {
      where: "Season = '" + selectedSeason + "'",
    };
  }

  // When the flash flood warnings layer is loaded
  view.when().then(() => {
    // Make the seasons filter visible
    seasonsElement.style.visibility = "visible";
    const seasonsExpand = new Expand({
      view: view,
      content: seasonsElement,
      expandIcon: "filter",
      group: "top-left",
    });
   
    // Clear the filter when the expand widget is closed
    reactiveUtils.when(
      () => !seasonsExpand.expanded,
      () => {
        layer.filter = null;
      }
    );
    
    // Add the seasons expand widget to the map
    view.ui.add(seasonsExpand, "top-left");
    
    // Add the title to the map
    view.ui.add("titleDiv", "top-right");
  });
});
