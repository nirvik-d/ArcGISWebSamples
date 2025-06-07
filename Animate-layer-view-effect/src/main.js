/*
 * Initialize required ArcGIS modules for the application
 * This includes core map components, widgets, and utilities
 */
require([
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/views/MapView",
  "esri/core/promiseUtils",
  "esri/widgets/Legend",
  "esri/widgets/Home",
  "esri/widgets/Fullscreen",
  "esri/widgets/Slider",
  "esri/widgets/Expand",
], (
  Map,
  FeatureLayer,
  MapView,
  promiseUtils,
  Legend,
  Home,
  Fullscreen,
  Slider,
  Expand
) => {
  (async () => {
    /*
     * Create a feature layer with election results data
     * This layer contains county-level election results for 2008
     * Used to visualize voting patterns across different regions
     */
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
              outline: null,
            },
          },
          {
            value: "McCain", // McCain's precincts
            symbol: {
              type: "simple-marker",
              size: 9,
              color: "rgb(255, 20, 20)",
              outline: null,
            },
          },
          {
            value: "Tied",
            symbol: {
              type: "simple-marker",
              size: 9,
              color: "rgb(158, 85, 156)",
              outline: null,
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
          },
        ],
      },
    });

    /*
     * Create a map instance with vector basemap
     * Uses a modern vector basemap for better performance and visual quality
     */
    const map = new Map({
      basemap: {
        portalItem: {
          id: "3582b744bba84668b52a16b0b6942544",
        },
      },
      layers: [layer],
    });

    /*
     * Create a new MapView instance
     * Sets up the initial view parameters and container
     */
    const view = new MapView({
      map: map,
      container: "viewDiv",
      constraints: {
        snapToZoom: false,
      },
      extent: {
        xmin: -126.902,
        ymin: 23.848,
        xmax: -65.73,
        ymax: 50.15,
      },
    });

    // Setup the UI
    view.ui.empty("top-left");

    // Add widgets
    const applicationDiv = document.getElementById("applicationDiv");
    const sliderValue = document.getElementById("sliderValue");
    const playButton = document.getElementById("playButton");
    const titleDiv = document.getElementById("titleDiv");
    let animation = null;

    /*
     * Create a slider widget for visualizing voting gaps
     * Allows users to interactively explore different gap thresholds
     * Range is from 0 to 100 representing the voting gap percentage
     */
    const slider = new Slider({
      // Create a new slider
      container: "slider", // Set the container to the slider div
      min: 0, // Set the minimum value to 0
      max: 100, // Set the maximum value to 100
      values: [50], // Set the initial value to 50
      step: 0.25, // Set the step size to 0.25
      visibleElements: {
        rangeLabels: true, // Show range labels
      },
      labelFormatFunction: (value, type) => {
        // Format the labels
        if (type === "min") {
          return "Contested"; // Return "Contested" for the minimum value
        }
        if (type === "max") {
          return "Landslide"; // Return "Landslide" for the maximum value
        }
        return value; // Return the value as is
      },
    });

    // Handle slider input
    function inputHandler(event) {
      stopAnimation();
      setGapValue(parseInt(event.value));
    }
    slider.on("thumb-drag", inputHandler);

    // Handle play/pause button
    playButton.addEventListener("click", () => {
      if (playButton.classList.contains("toggled")) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    view.ui.add(titleDiv, "top-left");
    view.ui.add(
      new Expand({
        view: view,
        content: new Legend({
          view: view,
        }),
      }),
      "top-left"
    );
    view.ui.add(
      new Home({
        view: view,
      }),
      "top-left"
    );
    view.ui.add(
      new Fullscreen({
        view: view,
        element: applicationDiv,
      }),
      "top-right"
    );

    // When the layerview is available, setup hovering interactivity
    const layerView = await view.whenLayerView(layer);

    setupHoverTooltip(layerView);

    // Starts the application by visualizing a gap of 50% between the two candidates
    setGapValue(50);

    // Utility functions
    // Set the gap value
    function setGapValue(value) {
      sliderValue.innerHTML =
        "<span style='font-weight:bold; font-size:150%'>" +
        (Math.round(value * 100) / 100).toFixed(2) +
        " %</span> of the votes separate the two candidates";
      slider.viewModel.setValue(0, value);
      layerView.featureEffect = createEffect(value);
    }

    // Create a feature effect
    function createEffect(gap) {
      gap = Math.min(100, Math.max(0, gap));

      function roundToTheTenth(value) {
        return Math.round(value * 10) / 10;
      }

      return {
        filter: {
          where: `PERCENT_GAP > ${roundToTheTenth(
            gap - 1
          )} AND PERCENT_GAP < ${roundToTheTenth(gap + 1)}`,
        },
        includedEffect: "drop-shadow(0, 2px, 2px, black)",
        excludedEffect: "grayscale(25%) blur(5px) opacity(25%)",
      };
    }

    /**
     * Sets up a moving tooltip that displays voting statistics
     * Shows a bar chart with Democrat/Republican votes and gap percentage
     * Tooltip follows mouse movement and updates smoothly
     *
     * @param {Object} layerView - The layer view instance
     */
    function setupHoverTooltip(layerView) {
      let highlight = null;
      const toolTip = createToolTip(); // Create the tooltip element

      const hitTest = promiseUtils.debounce((point) => {
        // Debounce the hit test
        return view.hitTest(point).then((hit) => {
          // Hit test the view
          const results = hit.results.filter((result) => {
            // Filter the results
            return result.graphic.layer === layer;
          });

          if (results.length) {
            // If there are results
            const graphic = results[0].graphic; // Get the graphic
            const screenPoint = hit.screenPoint; // Get the screen point

            return {
              graphic: graphic,
              screenPoint: screenPoint,
              values: {
                democrat: Math.round(graphic.getAttribute("P2008_D")), // Get the Democrat vote count
                republican: Math.round(graphic.getAttribute("P2008_R")), // Get the Republican vote count
              },
            };
          } else {
            return null;
          }
        });
      });

      /**
       * Handles pointer move events to update tooltip position
       * Updates tooltip content and position when hovering over counties
       */
      view.on("pointer-move", (event) => {
        hitTest(event).then(
          function (result) {
            // Remove existing highlight if present
            if (highlight) {
              highlight.remove();
              highlight = null;
            }

            if (!result) {
              toolTip.hide();
              view.surface.style.cursor = "auto";
            } else {
              highlight = layerView.highlight(result.graphic);
              toolTip.show(result.screenPoint, result.values);
              view.surface.style.cursor = "pointer";
            }
          },
          () => {}
        );
      });

      /**
       * Handles click events to show tooltip
       * Shows detailed voting statistics when clicking on a county
       */
      view.on("click", (event) => {
        hitTest(event)
          .then((result) => {
            if (!result) {
              return;
            }

            stopAnimation();

            const dem = result.values.democrat;
            const rep = result.values.republican;
            const gap =
              ((Math.max(dem, rep) - Math.min(dem, rep)) / (dem + rep)) * 100;
            animation = animateTo(gap);
          })
          .catch((error) => {
            if (error.name != "AbortError") {
              console.error(error);
            }
          });
      });
    }

    /**
     * Stops the animation if it's running
     * Removes the animation object and resets UI state
     */
    function stopAnimation() {
      if (!animation) {
        return;
      }
      animation.remove();
      animation = null;
      playButton.classList.remove("toggled");
    }

    /**
     * Toggles the animation state
     * Stops any existing animation and starts a new one
     */
    function startAnimation() {
      stopAnimation();
      animation = animate(slider.values[0]);
      playButton.classList.add("toggled");
    }

    /**
     * Creates a continuous animation of the gap value
     * Animates between 0 and 100 with smooth oscillation
     * Uses requestAnimationFrame for smooth animation
     *
     * @param {number} value - The initial gap value
     * @returns {Object} An object with a remove method to stop the animation
     */
    function animate(value) {
      let animating = true;
      let sliderValue = value;
      let direction = 0.1;
      const frame = () => {
        if (!animating) {
          return;
        }

        // Increment the slider value with current direction
        sliderValue += direction;

        // Reverse direction at boundaries
        if (sliderValue > 100) {
          sliderValue = 100;
          direction = -direction;
        } else if (sliderValue < 0) {
          sliderValue = 0;
          direction = -direction;
        }

        // Update the map with new gap value
        setGapValue(sliderValue);
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);

      return {
        remove: () => {
          animating = false;
        },
      };
    }

    /**
     * Animates the gap value to a specific target
     * Uses smooth interpolation to reach the target value
     * Interpolates at 25% of the remaining distance each frame
     *
     * @param {number} value - The target gap value
     * @returns {Object} An object with a remove method to stop the animation
     */
    function animateTo(value) {
      let animating = true;
      const frame = () => {
        if (!animating) {
          return;
        }

        // Get current slider value
        let sliderValue = slider.values[0];

        // Check if we've reached the target value
        if (Math.abs(value - sliderValue) < 1) {
          animating = false;
          setGapValue(value);
        } else {
          // Interpolate towards target value
          setGapValue(sliderValue + (value - sliderValue) * 0.25);
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

    /**
     * Creates a tooltip element.
     * @returns {HTMLElement} The tooltip element.
     */
    function createToolTip() {
      const toolTip = document.createElement("div");
      const style = toolTip.style;
      style.opacity = 0;
      toolTip.setAttribute("role", "tooltip");
      toolTip.classList.add("tooltip");

      const content = document.getElementById("tooltipContent");
      content.style.visibility = "visible";
      content.classList.add("esri-widget");
      toolTip.appendChild(content);

      view.container.appendChild(toolTip);

      let x = 0,
        y = 0,
        targetX = 0,
        targetY = 0;
      let visible = false;
      let moveRaFTimer = null;

      // Move the tooltip to the target position
      function move() {
        function moveStep() {
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

      let dem = 0,
        rep = 0;
      let updateRaFTimer = null;

      // Update the tooltip content
      function updateContent(values) {
        if (values.democrat === dem && values.republican === rep) {
          return;
        }

        dem = values.democrat;
        rep = values.republican;
        cancelAnimationFrame(updateRaFTimer);
        let p_gap =
          ((Math.max(dem, rep) - Math.min(dem, rep)) / (dem + rep)) * 100; // Calculate the gap percentage
        let p_dem = (dem / (dem + rep)) * 100; // Calculate the Democrat percentage
        let p_rep = (rep / (dem + rep)) * 100; // Calculate the Republican percentage
        updateRaFTimer = requestAnimationFrame(() => {
          document.querySelector("#chart .row.democrat .bar").style.width =
            p_dem + "%"; // Update the Democrat bar width
          document.querySelector(
            "#chart .row.democrat .value > span"
          ).innerHTML = dem; // Update the Democrat value

          document.querySelector("#chart .row.republican .bar").style.width =
            p_rep + "%"; // Update the Republican bar width
          document.querySelector(
            "#chart .row.republican .value > span"
          ).innerHTML = rep; // Update the Republican value

          document.querySelector("#chart .row.gap .bar").style.width =
            p_gap + "%"; // Update the gap bar width
          document.querySelector("#chart .row.gap .bar").style.marginLeft =
            Math.min(p_dem, p_rep) + "%"; // Update the gap bar margin
          document.querySelector("#chart .row.gap .value > span").innerHTML =
            p_gap + "%"; // Update the gap value
        });
      }

      // Show the tooltip
      function show(point, values) {
        if (!visible) {
          x = point.x;
          y = point.y;
        }

        targetX = point.x;
        targetY = point.y;
        style.opacity = 1;
        visible = true;

        move();
        updateContent(values);
      }

      // Hide the tooltip
      function hide() {
        style.opacity = 0;
        visible = false;
      }

      return {
        show: show,
        hide: hide,
      };
    }
  })();
});
