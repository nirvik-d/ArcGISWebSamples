require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/LayerList",
  "esri/widgets/BasemapGallery",
  "esri/widgets/Legend",
  "esri/widgets/Expand"
], (
  MapView,
  WebMap,
  LayerList,
  BasemapGallery,
  Legend,
  Expand
) => {

  let webmapId  = "06ca49d0ddb447e7817cfc343ca30df9";
  if (window.location.href.indexOf("?id=") > 0) {
    webmapId = window.location.href.split("?id=")[1];
  }

  /************************************************************
   * Creates a new webmap instance. A WebMap can reference
   * a PortalItem ID that represents a WebMap saved to
   * arcgis.com or an on-premise portal.
   * To load a WebMap from an on-premise portal, set the portal
   * url with esriConfig.portalUrl (see above).
   ************************************************************/
  const map = new WebMap({
    portalItem: {
      id: webmapId
    }
  });

  const view = new MapView({
    map: map,
    container: "viewDiv"
  });

  // add legend, layerlist and basemapGallery widgets
  view.ui.add(
    [
      new Expand({
        content: new Legend({
          view: view
        }),
        view: view,
        group: "top-left"
      }),
      new Expand({
        content: new LayerList({ view: view }),
        view: view,
        group: "top-left"
      }),
      new Expand({
        content: new BasemapGallery({
          view: view
        }),
        view: view,
        expandIcon: "basemap",
        group: "top-left"
      })
    ],
    "top-left"
  );

  view.when(() => {
    // When the webmap and view resolve, display the webmap's
    // new title in the Div
    const title = document.getElementById("webMapTitle");
    const save = document.getElementById("saveWebMap");
    save.disabled = false;
    save.addEventListener("click", () => {
      // item automatically casts to a PortalItem instance by saveAs
      const item = {
        title: title.value
      };

      // Update properties of the WebMap related to the view.
      // This should be called just before saving a webmap.
      map.updateFrom(view).then(() => {
        map.saveAs(item)
        // Saved successfully
        .then((item) => {
          // link to the newly-created web scene item
          const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
          const link = `<a target="_blank" href="${itemPageUrl}">${title.value}</a>`;

          statusMessage("Save WebMap",
            `<br> Successfully saved as <i>${link}</i>`
          );
        })
        // Save didn't work correctly
        .catch((error) => {
            if (error.name != "identity-manager:user-aborted"){
              statusMessage("Save WebMap", `<br> Error ${error}`);
            }
          });
      });
    });

    const overlay = document.getElementById("overlayDiv");
    const ok = overlay.getElementsByTagName("input")[0];

    function statusMessage(head, info) {
      document.getElementById("head").innerHTML = head;
      document.getElementById("info").innerHTML = info;
      overlay.style.visibility = "visible";
    }

    ok.addEventListener("click", () => {
      overlay.style.visibility = "hidden";
    });

    view.ui.add("sidebarDiv", "top-right");
  });
});