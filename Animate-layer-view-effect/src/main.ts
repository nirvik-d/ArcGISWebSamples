import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Slider from "@arcgis/core/widgets/Slider";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable";

import * as promiseUtils from "@arcgis/core/core/promiseUtils";

// Load the feature layer
const layer = new FeatureLayer({
  portalItem: {
    id: "359bc19d9bbb4f2ba1b2baec7e13e757",
  },
  outFields: ["PERCENT_GAP"],
  definitionExpression: "(P2008_D > 0) AND (P2008_R > 0)",
  title: "Voting precincts",
  opacity: 1,
  renderer: {
    type: "unique-value", // Display unique values of a field
    field: "Majority",
    uniqueValueInfos: [
      {
        value: "Obama", // Obama's precincts
        symbol: {
          type: "simple-marker",
          size: 9,
          color: "rgb(0, 92, 230)",
        },
      },
      {
        value: "McCain", // McCain's precincts
        symbol: {
          type: "simple-marker",
          size: 9,
          color: "rgb(255, 20, 20)",
        },
      },
      {
        value: "Tied",
        symbol: {
          type: "simple-marker",
          size: 9,
          color: "rgb(158, 85, 156)",
        },
      },
    ],
    visualVariables: [
      {
        type: "size", // Size of the marker
        minDataValue: 600, // Minimum data value
        maxDataValue: 4562, // Maximum data value
        minSize: 3, // Minimum size of the marker
        maxSize: 20, // Maximum size of the marker
        valueExpression: "$feature.P2008_D + $feature.P2008_R", // Expression to calculate the size of the marker
        valueExpressionTitle: "Turnout", // Title of the expression
        valueUnit: "unknown",
      } as SizeVariable,
    ],
  },
});

// Add the feature layer to the map
const map = document.querySelector("arcgis-map");
map?.addEventListener("arcgisViewReadyChange", async () => {
  map?.map?.add(layer);

  // Set the view constraints
  const view = map?.view;
  if (!view) {
    return;
  }
  view.constraints = {
    snapToZoom: true,
  };
  view.extent = {
    xmin: -126.902,
    ymin: 23.848,
    xmax: -65.73,
    ymax: 50.15,
    spatialReference: {
      wkid: 4326,
    },
  };

  // Add the slider
  const slider = new Slider({
    container: "slider",
    min: 0,
    max: 100,
    values: [50],
    steps: 0.25,
    visibleElements: {
      rangeLabels: true,
    },
    labelFormatFunction: (value, type) => {
      if (type === "min") {
        return "Contested";
      }
      if (type === "max") {
        return "Landslide";
      }
      return value.toString();
    },
  });

  // Add the slider event listener
  slider.on("thumb-drag", (event) => {
    stopAnimation();
    setGapValue(event.value);
  });

  // Add the play button
  const playButton = document.querySelector("#playButton");
  playButton?.addEventListener("click", () => {
    playButton?.classList.contains("toggled")
      ? stopAnimation()
      : startAnimation();
  });

  // Initialize the animation
  let animation: __esri.Handle | null = null;

  // Animate the slider
  function animate(startValue: number) {
    let animating = true;
    let value = startValue;
    let direction = 0.1;

    const frame = () => {
      if (!animating) {
        return;
      }

      value += direction;
      if (value > 100) {
        value = 100;
        direction = -direction;
      } else if (value < 0) {
        value = 0;
        direction = -direction;
      }

      setGapValue(value);
      requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);

    return {
      remove: () => {
        animating = false;
      },
    };
  }

  // Animate the slider to a target value
  function animateTo(targetValue: number): __esri.Handle {
    let animating = true;

    const frame = () => {
      if (!animating) {
        return;
      }

      let value = slider?.values?.[0] ?? 50;

      if (Math.abs(targetValue - value) < 1) {
        animating = false;
        setGapValue(targetValue);
      } else {
        setGapValue(value + (targetValue - value) * 0.25);
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);

    return {
      remove: () => {
        animating = false;
      },
    };
  }

  // Stop the animation
  function stopAnimation() {
    if (!animation) {
      return;
    }

    animation.remove();
    animation = null;
    playButton?.classList.remove("toggled");
  }

  // Start the animation
  function startAnimation() {
    stopAnimation();
    animation = animate(slider?.values?.[0] ?? 50);
    playButton?.classList.add("toggled");
  }

  // Set the slider value
  function setGapValue(value: number) {
    if (sliderValue) {
      sliderValue.innerHTML =
        "<span style='font-weight:bold; font-size:150%'>" +
        (Math.round(value * 100) / 100).toFixed(2) +
        " %</span> of the votes separate the two candidates";
      slider.viewModel.setValue(0, value);
      layerView.featureEffect = createEffect(value);
    }
  }

  // Create the feature effect
  function createEffect(gapValue: number) {
    gapValue = Math.min(100, Math.max(0, gapValue));

    function roundToTheTenth(value: number) {
      return Math.round(value * 10) / 10;
    }

    return {
      filter: {
        where: `PERCENT_GAP > ${roundToTheTenth(
          gapValue - 1
        )} AND PERCENT_GAP < ${roundToTheTenth(gapValue + 1)}`,
      },
      includedEffect: "drop-shadow(0, 2px, 2px, black)",
      excludedEffect: "grayscale(25%) blur(5px) opacity(25%)",
    };
  }

  const layerView = await view.whenLayerView(layer);
  const sliderValue = document.querySelector("#sliderValue");
  setGapValue(50);

  // Setup the hover tooltip
  function setupHoverTooltip() {
    let highlight: __esri.Handle | null;

    const tooltip = createTooltip();

    const hitTest = promiseUtils.debounce(
      async (point: __esri.MapViewScreenPoint | MouseEvent) => {
        const hit = await view?.hitTest(point);
        const results = hit?.results.filter((result) => {
          return result.type === "graphic" && result.layer === layer;
        });
        if (results?.length) {
          if (results[0].type === "graphic") {
            const graphic = results[0].graphic;
            const screenPoint_1 = hit?.screenPoint;

            return {
              graphic: graphic,
              screenPoint: screenPoint_1,
              values: {
                democrat: Math.round(graphic.getAttribute("P2008_D")),
                republican: Math.round(graphic.getAttribute("P2008_R")),
              },
            };
          }
        } else {
          return null;
        }
      }
    );

    view.on("pointer-move", (event) => {
      hitTest(event).then(
        function (result) {
          if (highlight) {
            highlight.remove();
            highlight = null;
          }

          if (!result) {
            tooltip?.hide();
            if (map) {
              map.style.cursor = "auto";
            }
          } else {
            highlight = layerView?.highlight(result.graphic);
            tooltip?.show(result.screenPoint!, result.values);
            if (map) {
              map.style.cursor = "pointer";
            }
          }
        },
        () => {}
      );
    });

    view.on("click", (event) => {
      hitTest(event)
        .then((result) => {
          if (!result) {
            return;
          }

          stopAnimation();

          const dem = result.values.democrat;
          const rep = result.values.republican;
          const p_gap =
            ((Math.max(dem, rep) - Math.min(dem, rep)) / (dem + rep)) * 100;
          animation = animateTo(p_gap);
        })
        .catch((error) => {
          if (error.name != "AbortError") {
            console.error(error);
          }
        });
    });
  }

  // Call the setup Hover Tooltip function
  setupHoverTooltip();

  // Create the tooltip
  function createTooltip() {
    const tooltip = document.createElement("div");
    const style = tooltip.style;

    style.opacity = "0";
    tooltip.setAttribute("role", "tooltip");
    tooltip.classList.add("tooltip");

    const content: HTMLElement | null =
      document.querySelector("#tooltipContent");
    if (!content) {
      return;
    }
    content.style.visibility = "visible";
    content.classList.add("esri-widget");
    tooltip.appendChild(content);

    view.container?.appendChild(tooltip);

    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let visible = false;
    let moveRaFTimer: number | null = null;

    // Move the tooltip
    function move() {
      function moveStep() {
        moveRaFTimer = null;
        x += (targetX - x) * 0.5;
        y += (targetY - y) * 0.5;

        if (Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1) {
          x = targetX;
          y = targetY;
        } else {
          moveRaFTimer = requestAnimationFrame(moveStep);
        }

        style.transform =
          "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px, 0)";
      }

      if (!moveRaFTimer) {
        moveRaFTimer = requestAnimationFrame(moveStep);
      }
    }

    let dem: number;
    let rep: number;
    let updateRaFTimer: number | null = null;

    // Update the tooltip content
    function updateContent(values: { democrat: number; republican: number }) {
      if (dem === values.democrat && rep === values.republican) {
        return;
      }

      dem = values.democrat;
      rep = values.republican;
      if (updateRaFTimer) {
        cancelAnimationFrame(updateRaFTimer);
      }
      updateRaFTimer = requestAnimationFrame(() => {
        let p_gap = (Math.max(dem, rep) - Math.min(dem, rep)) / (dem + rep);
        p_gap = Math.round(p_gap * 10000) / 100;
        let p_dem = (dem / (dem + rep)) * 100;
        let p_rep = (rep / (dem + rep)) * 100;

        const chart = document.querySelector("#chart");
        if (!chart) {
          return;
        }
        const democratBar: HTMLElement | null =
          chart.querySelector(".row.democrat .bar");
        if (!democratBar) {
          return;
        }
        democratBar.style.width = p_dem + "%";
        const democratValue = chart.querySelector(
          ".row.democrat .value > span"
        );
        if (!democratValue) {
          return;
        }
        democratValue.innerHTML = dem.toString();

        const republicanBar: HTMLElement | null = chart.querySelector(
          ".row.republican .bar"
        );
        if (!republicanBar) {
          return;
        }
        republicanBar.style.width = p_rep + "%";
        const republicanValue: HTMLElement | null = chart.querySelector(
          ".row.republican .value > span"
        );
        if (!republicanValue) {
          return;
        }
        republicanValue.innerHTML = rep.toString();

        const gapBar: HTMLElement | null = chart.querySelector(
          "#chart .row.gap .bar"
        );
        if (!gapBar) {
          return;
        }
        gapBar.style.width = p_gap + "%";

        const gapBarLeft: HTMLElement | null = chart.querySelector(
          "#chart .row.gap .bar"
        );
        if (!gapBarLeft) {
          return;
        }
        gapBarLeft.style.marginLeft = Math.min(p_dem, p_rep) + "%";
        const gapValue: HTMLElement | null = chart.querySelector(
          "#chart .row.gap .value > span"
        );
        if (!gapValue) {
          return;
        }
        gapValue.innerHTML = p_gap.toString() + "%";
      });
    }

    return {
      show: (
        point: { x: number; y: number },
        values: { democrat: number; republican: number }
      ) => {
        if (!visible) {
          x = point.x;
          y = point.y;
        }

        targetX = point.x;
        targetY = point.y;
        style.opacity = "1";
        visible = true;

        move();
        updateContent(values);
      },

      hide: () => {
        style.opacity = "0";
        visible = false;
      },
    };
  }
});
