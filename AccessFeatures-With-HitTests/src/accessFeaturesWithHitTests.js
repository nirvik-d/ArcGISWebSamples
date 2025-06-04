require([
  "esri/Map",
  "esri/layers/FeatureLayer"
  ],(
    Map,
    FeatureLayer
) => (async () => {
  // get the arcgis-map component element and wait for it to be ready
  const arcgisMap = document.querySelector("arcgis-map");

  // hurricanes featurelayer to the map
  const layer = new FeatureLayer({
    url: "https://sampleserver6.arcgisonline.com/arcgis/rest/services/Hurricanes/MapServer/1",
    outFields: ["NAME", "CAT", "WIND_KTS", "YEAR"]
  });

  arcgisMap.map = new Map({
    basemap: "dark-gray-vector",
    layers: [layer]
  });

  if (!arcgisMap.ready) {
    arcgisMap.addEventListener("arcgisViewReadyChange", handleMapReady, {
      once: true
    });
  } else {
    handleMapReady();
  }

  async function handleMapReady() {
    // change the default highlight option object's color to orange
    arcgisMap.highlights.forEach(highlightOption => {
      if (highlightOption.name === "default") {
        highlightOption.color = "orange"
      }
    });

    const layerView = await arcgisMap.whenLayerView(layer);

    // update layer's renderer
    const renderer = layer.renderer.clone();
    renderer.symbol.width = 4;
    renderer.symbol.color = [128, 128, 128, 0.8];
    layer.renderer = renderer;

    // Set up an event handler for pointer-down (mobile) and pointer-move events
    // and retrieve the screen x, y coordinates
    arcgisMap.addEventListener("arcgisViewPointerDown", eventHandler);

    let highlight, currentYear, currentName;

    async function eventHandler(event) {
      // only include graphics from hurricanes layer in the hitTest
      const opts = {
        include: layer
      }
      // the hitTest() checks to see if any graphics from the hurricanesLayer
      // intersect the x, y coordinates of the pointer
      const response = await arcgisMap.hitTest(event.detail, opts);
      if (!response.results.length) {
        // no results returned from hittest, remove previous highlights
        highlight?.remove();
        document.getElementById("info").innerHTML = `Name: <br> Category: <br> Speed:`;
        return;
      }

      // the topmost graphic from the hurricanes layer and display attribute
      // values from the graphic to the user
      const graphic = response.results[0].graphic;

      const attributes = graphic.attributes;
      const year = attributes.YEAR;
      const name = attributes.NAME;

      // update the hurricanes info div
      document.getElementById("info").innerHTML = setupHurricaneInfoDiv(attributes);

      // highlight all features belonging to the same hurricane as the feature
      // returned from the hitTest
      const query = layerView.createQuery();
      query.where = `YEAR = ${year} AND NAME = '${name}'`;
      layerView.queryObjectIds(query).then((ids) => {
        highlight?.remove();
        highlight = layerView.highlight(ids);
        currentYear = year;
        currentName = name;
      });
    }

    // update info div to show hurricanes info
    function setupHurricaneInfoDiv(attributes) {
      let isFirst = true;
      const htmls = Object.keys(hurricaneInfoFields).map(name => {
        if (attributes[name] != null) {
          const html = `${isFirst ? '' : '<br>'}${hurricaneInfoFields[name]}: <b><span>${attributes[name]}</span></b>`;
          isFirst = false;
          return html;
        }
        return '';
      }).filter(html => html !== '');
      return htmls.join('');
    }

    // fields used to display hurricanes info
    const hurricaneInfoFields = {
      NAME: "Name",
      CAT: "Category",
      WIND_KTS: "Speed"
    };
  }
})());