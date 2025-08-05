import "./style.css"

import "@arcgis/map-components/components/arcgis-scene"
import "@arcgis/map-components/components/arcgis-zoom"
import "@arcgis/map-components/components/arcgis-editor"
import "@arcgis/map-components/components/arcgis-expand"
import "@arcgis/map-components/components/arcgis-basemap-gallery"

import FeatureLayer from "@arcgis/core/layers/FeatureLayer"

const recLayer = new FeatureLayer({
  title: "Recreation",
  url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/EditableFeatures3D/FeatureServer/1",
  elevationInfo: {
    mode: "absolute-height",
  },
  renderer: {
    type: "unique-value",
    field: "TYPE",
    visualVariables: [
      {
        type: "size",
        field: "SIZE",
        axis: "height",
        valueUnit: "meters",
      } as __esri.SizeVariable,
      {
        type: "rotation",
        field: "ROTATION",
      } as __esri.RotationVariable,
    ],
    uniqueValueInfos: [
      {
        value: "1",
        label: "Slide",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: {
                href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Slide.glb",
              },
            },
          ],
          styleOrigin: {
            styleName: "EsriRecreationStyle",
            name: "Slide",
          },
        },
      },
      {
        value: "2",
        label: "Swing",
        symbol: {
          type: "point-3d",
          symbolLayers: [
            {
              type: "object",
              resource: {
                href: "https://static.arcgis.com/arcgis/styleItems/Recreation/gltf/resource/Swing.glb",
              },
            },
          ],
          styleOrigin: {
            styleName: "EsriRecreationStyle",
            name: "Swing",
          },
        },
      },
    ],
  },
});

// Get the web scene
const scene = document.querySelector("arcgis-scene");
if (!scene) {
  throw new Error("Scene not found");
}

// Wait for the scene to be ready
scene.addEventListener("arcgisViewReadyChange", () => {
  if (scene.ready) {

    // Add the recreation layer to the scene
    if(!scene.map){
      throw new Error("Map not found");
    }
    scene.map.add(recLayer);
  }
});