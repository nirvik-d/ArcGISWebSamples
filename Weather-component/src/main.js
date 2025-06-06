const scene = document.querySelector("arcgis-scene");

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  scene.environment.weather = {
    type: "cloudy",
    cloudCover: 0.3,
  };

  // Get if the flood selection is changed
  const floodSelection = document.getElementById("floodSelection");

  // Get the Flood layer
  let floodLevelLayer = scene.map.allLayers.find(
    (layer) => layer.title === "Flood Level"
  );

  // Add event listener to the flood selection
  floodSelection.addEventListener("calciteSegmentedControlChange", () => {
    switch (floodSelection.selectedItem.value) {
      // If no flooding is selected
      case "noFlooding":
        scene.environment.weather = {
          type: "cloudy",
          cloudCover: 0.3,
        };
        floodLevelLayer.visible = false;
        break;

      // If flooding is selected
      case "flooding":
        scene.environment.weather = {
          type: "rainy",
          cloudCover: 0.7,
          precipitation: 0.3,
        };
        floodLevelLayer.visible = true;
        break;
    }
  });
});
