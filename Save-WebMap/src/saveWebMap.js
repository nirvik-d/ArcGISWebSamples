
const map = document.querySelector("arcgis-map");

map.addEventListener("arcgisViewReadyChange", () => {
  const view = map.view;
  view.when(() => {
    // When the webmap and view resolve, display the webmap's
    // new title in the Div
    const title = document.getElementById("webMapTitle");
    const save = document.getElementById("saveWebMap");
    save.disabled = false;
    save.addEventListener("click", () => {
      // item automatically casts to a PortalItem instance by saveAs
      const item = {
        title: title.value,
      };

      // Update properties of the WebMap related to the view.
      // This should be called just before saving a webmap.
      map.map.updateFrom(view).then(() => {
        map.map.saveAs(item)
          // Saved successfully
          .then((item) => {
            // link to the newly-created web scene item
            const itemPageUrl = `${item.portal.url}/home/item.html?id=${item.id}`;
            const link = `<a target="_blank" href="${itemPageUrl}">${title.value}</a>`;

            statusMessage(
              "Save WebMap",
              `<br> Successfully saved as <i>${link}</i>`
            );
          })
          // Save didn't work correctly
          .catch((error) => {
            if (error.name != "identity-manager:user-aborted") {
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
  });
})

