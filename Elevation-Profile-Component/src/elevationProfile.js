const arcgisScene = document.querySelector("arcgis-scene");
const arcgisElevationProfile = document.querySelector("arcgis-elevation-profile");

arcgisScene.addEventListener("arcgisViewReadyChange", () => {
  arcgisElevationProfile.profiles = [
    {
      type: "ground" // first profile line samples the ground elevation
    },
    {
      type: "view" // second profile samples the view and shows building profiles
    }
  ];
});