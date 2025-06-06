require(["esri/layers/FeatureLayer", "esri/widgets/Editor"], function (
  FeatureLayer,
  Editor
) {
  // Create a recreation layer
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
        },
        {
          type: "rotation",
          field: "ROTATION",
        },
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

  // Wait for the scene to be ready
  scene.addEventListener("arcgisViewReadyChange", () => {
    if (scene.ready) {
      // Add the recreation layer to the scene
      scene.map.add(recLayer);

      // Get the scene view
      const view = scene.view;

      view.when(() => {
        view.popupEnabled = false;

        // Create the editor
        const editor = new Editor({
          view: view,
          tooltipOptions: {
            enabled: true,
          },
          labelOptions: {
            enabled: true,
          },
        });

        // Add the editor to the view
        view.ui.add(editor, "top-right");
      });
    }
  });
});
