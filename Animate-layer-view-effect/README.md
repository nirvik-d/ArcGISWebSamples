# Animate Layer View Effect

A web application demonstrating animated visualization of election results using ArcGIS Maps SDK for JavaScript.

## Features

* **Animated Election Results:** Visualizes the 2008 Obama/McCain election results by voting districts, with an emphasis on the "gap" between candidates.
* **Interactive Slider Control:** A custom slider allows users to dynamically filter and highlight precincts based on the percentage gap between the two main candidates.
* **Play/Pause Animation:** Users can start a continuous animation that cycles through different "gap" percentages, providing an engaging way to explore the data.
* **Dynamic Feature Effects:** Utilizes the ArcGIS Maps SDK's `featureEffect` to apply visual filters (e.g., drop-shadow, grayscale, blur, opacity) to features based on the selected gap, highlighting features within the target range and de-emphasizing others.
* **Real-time Hover Tooltip:** On mouse hover, a custom tooltip appears, displaying a bar chart with the exact vote counts for Obama and McCain, as well as the calculated gap percentage for the hovered precinct.
* **Click-to-Animate:** Clicking on any precinct animates the slider to the specific gap percentage of that precinct, allowing for focused exploration.
* **Standard Map Widgets:** Includes essential map navigation widgets like Legend, Home, and Fullscreen for improved user experience.

## Screenshots

*Caption: Main application view showing the animated map and UI controls.*

<img width="959" alt="image" src="https://github.com/user-attachments/assets/a53343cd-43de-40df-be79-cd018e6792bf" />

## Project Setup

1.  **Initialize Project**

    ```bash
    # Create a new Vite project
    npm create vite@latest
    ```

    Follow the instructions on screen to initialize the project.

2.  **Install Dependencies**

    ```bash
    npm install
    ```

## Code Structure

1.  **HTML Structure (index.html)**

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1,maximum-scale=1,user-scalable=no"
        />
        <title>
          Animate layer view effect | Sample | ArcGIS Maps SDK for JavaScript 4.32
        </title>

        <link
          rel="stylesheet"
          href="[https://js.arcgis.com/4.32/esri/themes/light/main.css](https://js.arcgis.com/4.32/esri/themes/light/main.css)"
        />
        <script src="[https://js.arcgis.com/4.32/](https://js.arcgis.com/4.32/)"></script>

        <link rel="stylesheet" href="./src/style.css" />
      </head>

      <body>
        <div id="applicationDiv">
          <div id="viewDiv">
            <div id="titleDiv" class="esri-widget">
              Obama / McCain 2008 Election - voting districts gap
            </div>
          </div>
          <div id="sliderContainer" class="esri-widget">
            <span id="sliderValue"></span>
            <div id="sliderInnerContainer">
              <div id="slider"></div>
            </div>
            <div
              id="playButton"
              class="esri-widget esri-widget--button toggle-button"
            >
              <div>
                <span
                  class="toggle-button-icon esri-icon-play"
                  aria-label="play icon"
                ></span>
                Play
              </div>
              <div>
                <span
                  class="toggle-button-icon esri-icon-pause"
                  aria-label="pause icon"
                ></span>
                Pause
              </div>
            </div>
          </div>
        </div>

        <div id="tooltipContent" class="tooltip-content" style="visibility: hidden">
          <div id="chart" class="chart">
            <div class="row democrat">
              <div class="labels"><span>Obama:</span></div>
              <div class="data"><div class="bar"></div></div>
              <div class="value"><span></span></div>
            </div>
            <div class="row republican">
              <div class="labels"><span>McCain:</span></div>
              <div class="data"><div class="bar"></div></div>
              <div class="value"><span></span></div>
            </div>
            <div class="row gap">
              <div class="labels"><span>Gap:</span></div>
              <div class="data">
                <div class="bar"><div></div></div>
              </div>
              <div class="value"><span></span></div>
            </div>
          </div>
          <div class="tooltip-text">Click to view precincts with similar gap</div>
        </div>
        <script type="module" src="./src/main.js"></script>
      </body>
    </html>
    ```

2.  **CSS Styling (src/style.css)**

    ```css
    html,
    body {
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
    }

    #applicationDiv {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    #viewDiv {
      width: 100%;
      height: 100%;
      flex: 1 1 auto;
      order: 1;
    }

    #titleDiv {
      font-weight: 400;
      font-style: normal;
      font-size: 1.2019rem;
      padding: 10px;
    }

    #sliderContainer {
      flex: 0 0 80px;
      order: 2;

      display: flex;
      flex-flow: row;

      padding: 0 12px;
    }

    #sliderValue {
      flex: 0 0 150px;
      order: 1;

      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
    }

    #sliderInnerContainer {
      flex: 1 1 auto;
      order: 2;

      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 20px;
    }

    #slider {
      width: 100%;
    }
    /**
       * Play/Stop toggle button
       */

    #playButton {
      flex: 0 0 100px;
      order: 3;

      margin: 20px 0;
    }

    .toggle-button {
      display: flex;
    }

    .toggle-button.toggled .toggle-button-icon {
      color: #cc1b1b;
    }

    .toggle-button .toggle-button-icon {
      color: #1bcc1b;
    }

    .toggle-button > :nth-child(2) {
      display: none;
    }

    .toggle-button.toggled > :nth-child(1) {
      display: none;
    }

    .toggle-button.toggled > :nth-child(2) {
      display: block;
    }
    /**
       * Hover tooltip
       */

    .tooltip {
      position: absolute;
      pointer-events: none;
      transition: opacity 200ms;
    }

    .tooltip > div {
      margin: 0 auto;
      padding: 12px;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      transform: translate3d(-50%, -120%, 0);
      width: 300px;
      height: 185px;

      display: flex;
    }

    .tooltip-content {
      flex: 1 1 100%;
      align-items: stretch;
      flex-direction: column;
    }

    .tooltip-text {
      border-top: 1px solid lightgray;
      font-size: 75%;
      font-style: italic;
      margin-top: 12px;
      padding-top: 4px;
    }
    /**
       * Tooltip's chart
       */

    .chart {
      flex: 1 1 100%;
      display: flex;

      flex-direction: column;
      align-items: stretch;
    }

    .chart .row {
      flex: 1 1 auto;
      align-items: center;

      display: flex;
    }

    .chart .row .labels {
      flex: 0 0 60px;

      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: right;
    }

    .chart .row .labels > span {
      flex: 1 1 100%;
      text-align: right;
    }

    .chart .row .value {
      flex: 0 0 60px;

      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: right;
    }

    .chart .row .value > span {
      flex: 1 1 100%;
      text-align: right;
    }

    .chart .row .data {
      flex: 1 1 100%;

      position: relative;
      padding-left: 4px;
      padding-right: 4px;
    }

    .row.gap {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid lightgray;
    }

    .bar {
      text-align: right;
      height: 24px;

      display: flex;
      align-items: center;
      border-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

      transition: 300ms all;
    }

    .row.democrat .bar {
      background-color: rgb(0, 92, 230);
    }

    .row.republican .bar {
      background-color: rgb(255, 20, 20);
    }

    .row.gap .bar {
      position: relative;
      background: white
        url("[https://js.arcgis.com/4.32/esri/symbols/patterns/backward-diagonal.png](https://js.arcgis.com/4.32/esri/symbols/patterns/backward-diagonal.png)")
        repeat;
      border-radius: 0;
      border-bottom: 1px solid gray;
      border-top: 1px solid gray;
    }

    .row.gap .bar > div {
      position: absolute;
      z-index: -1;
      top: -110px;
      bottom: -18px;
      left: -1px;
      right: -1px;
      border-left: 1px dashed gray;
      border-right: 1px dashed gray;
      background: #ececec;
    }
    .esri-slider--horizontal .esri-slider__track {
      height: 2px;
      width: 95%;
    }
    ```

### JavaScript Implementation (src/main.js)

1.  Begin by creating a new layer, map and view.

    ```javascript
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
    ```

2.  Setup the UI necessary for playing and pausing the animation, including the slider.

    ```javascript
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
          // Add a legend widget
          view: view,
        }),
      }),
      "top-left"
    );
    view.ui.add(
      new Home({
        // Add a home widget
        view: view,
      }),
      "top-left"
    );
    view.ui.add(
      new Fullscreen({
        // Add a fullscreen widget
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
    ```

3.  Create a utility function to set the gap value.

    ```javascript
    // Set the gap value
    function setGapValue(value) {
      sliderValue.innerHTML =
        "<span style='font-weight:bold; font-size:150%'>" +
        (Math.round(value * 100) / 100).toFixed(2) +
        " %</span> of the votes separate the two candidates";
      slider.viewModel.setValue(0, value);
      layerView.featureEffect = createEffect(value);
    }
    ```

4.  Create a feature effect to highlight the features based on the gap value.

    ```javascript
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
    ```

5.  Create a utility function to generate a tool tip upon hovering over the map or clicking on a feature.

    ```javascript
    /**
     * Sets up a moving tooltip that displays voting statistics
     * Shows a bar chart with Democrat/Republican votes and gap percentage
     * Tooltip follows mouse movement and updates smoothly
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
    ```

6.  Create the utility functions necessary for animating.

    ```javascript
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
        }
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
        }
      }
    }
    ```

7.  Create a utility function to create a tool tip.

    ```javascript
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

      let x = 0, y = 0, targetX = 0, targetY = 0;
      let visible = false;
      let moveRaFTimer = null;

      // Move the tooltip to the target position
      function move(){
        function moveStep(){
          x += (targetX - x) * 0.5;
          y += (targetY - y) * 0.5;

          if(Math.abs(targetX - x) < 1 && Math.abs(targetY - y) < 1){
            x = targetX;
            y = targetY;
          }else{
            moveRaFTimer = requestAnimationFrame(moveStep);
          }

          style.transform = "translate3d(" + Math.round(x) + "px," + Math.round(y) + "px, 0)";
        }

        if(!moveRaFTimer){
          moveRaFTimer = requestAnimationFrame(moveStep);
        }
      }

      let dem = 0, rep = 0;
      let updateRaFTimer = null;

      // Update the tooltip content
      function updateContent(values){
        if(values.democrat === dem && values.republican === rep){
          return;
        }

        dem = values.democrat;
        rep = values.republican;
        cancelAnimationFrame(updateRaFTimer);
        let p_gap = ((Math.max(dem, rep) - Math.min(dem, rep)) / (dem + rep)) * 100; // Calculate the gap percentage
        let p_dem = (dem/(dem + rep)) * 100; // Calculate the Democrat percentage
        let p_rep = (rep/(dem + rep)) * 100; // Calculate the Republican percentage
        updateRaFTimer = requestAnimationFrame(() => {
          document.querySelector("#chart .row.democrat .bar").style.width = p_dem + "%"; // Update the Democrat bar width
          document.querySelector("#chart .row.democrat .value > span").innerHTML = dem; // Update the Democrat value

          document.querySelector("#chart .row.republican .bar").style.width = p_rep + "%"; // Update the Republican bar width
          document.querySelector("#chart .row.republican .value > span").innerHTML = rep; // Update the Republican value

          document.querySelector("#chart .row.gap .bar").style.width = p_gap + "%"; // Update the gap bar width
          document.querySelector("#chart .row.gap .bar").style.marginLeft = Math.min(p_dem, p_rep) + "%"; // Update the gap bar margin
          document.querySelector("#chart .row.gap .value > span").innerHTML = p_gap + "%"; // Update the gap value
        })
      }

      // Show the tooltip
      function show(point, values){
        if(!visible){
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
      function hide(){
        style.opacity = 0;
        visible = false;
      }

      return {
        show: show,
        hide: hide
      };
    }
    ```

8.  Initialize required ArcGIS modules for the application and place the above code inside the async function.

    ```javascript
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
        // Place the above code here.
      })();
    });
    ```

## Running the Application

1.  **Development Server**

    ```bash
    npm run dev
    ```

    This will start the development server at `http://localhost:5173`

2.  **Build for Production**

    ```bash
    npm run build
    ```

## Data Source

The election results data (2008 Obama / McCain election) is sourced from an ArcGIS Online [Portal Item](https://www.arcgis.com/home/item.html?id=359bc19d9bbb4f2ba1b2baec7e13e757). This dataset typically originates from Esri's Living Atlas or official election data releases.
