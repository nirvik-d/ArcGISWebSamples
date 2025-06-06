const scene = document.querySelector("arcgis-scene");
const elevationProfile = document.querySelector("arcgis-elevation-profile");

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  elevationProfile.profiles = [
    {
      type: "ground" // First profile line samples the ground elevation
    },
    {
      type: "view" // Second profile samples the view and shows building profiles
    }
  ];
});