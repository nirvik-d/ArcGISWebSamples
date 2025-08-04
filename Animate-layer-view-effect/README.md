# Animate Layer View Effect

A web application demonstrating animated visualization of election results using ArcGIS Maps SDK for JavaScript.

## Features

* **Animated Election Results:** Visualizes the 2008 Obama/McCain election results by voting districts, with an emphasis on the "gap" between candidates.
* **Interactive Slider Control:** A custom slider allows users to dynamically filter and highlight precincts based on the percentage gap between the two main candidates.
* **Play/Pause Animation:** Users can start a continuous animation that cycles through different "gap" percentages, providing an engaging way to explore the data.
* **Dynamic Feature Effects:** Utilizes the ArcGIS Maps SDK's `featureEffect` to apply visual filters (e.g., drop-shadow, grayscale, blur, opacity) to features based on the selected gap, highlighting features within the target range and de-emphasizing others.
* **Real-time Hover Tooltip:** On mouse hover, a custom tooltip appears, displaying a bar chart with the exact vote counts for Obama and McCain, as well as the calculated gap percentage for the hovered precinct.
* **Click-to-Animate:** Clicking on any precinct animates the slider to the specific gap percentage of that precinct, allowing for focused exploration.

## Screenshots

<img width="959" alt="image" src="https://github.com/user-attachments/assets/0053a32e-5aff-4cd3-81db-126c6480fd33" />

*Main application view showing the animated map and UI controls.*

## Prerequisites

* NodeJS
* Vite

## Project Setup

### Initialize Project

```bash
# Create a new Vite project
npm create vite@latest
```

Follow the instructions on screen to initialize the project.

### Install Dependencies

```bash
npm install
npm install @arcgis/map-components
```

## Code Structure

### HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <title>Animate Layer View Effect</title>
  </head>

  <body>
    <div id="applicationDiv">
      <arcgis-map item-id="3582b744bba84668b52a16b0b6942544">
        <arcgis-placement position="top-left">
          <div id="titleDiv" class="esri-widget">
            Obama / McCain 2008 Election - voting districts gap
          </div>
        </arcgis-placement>
        <arcgis-placement position="top-left">
          <arcgis-expand>
            <arcgis-legend></arcgis-legend>
          </arcgis-expand>
        </arcgis-placement>
      </arcgis-map>
      
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
    
    <script type="module" src="./src/main.ts"></script>
  </body>
</html>
```

### CSS Styling (src/style.css)

```css
@import "https://js.arcgis.com/calcite-components/3.2.1/calcite.css";
@import "https://js.arcgis.com/4.33/@arcgis/core/assets/esri/themes/light/main.css";
@import "https://js.arcgis.com/4.33/map-components/main.css";

html,
body {
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
}

#applicationDiv {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
    url("https://js.arcgis.com/4.32/esri/symbols/patterns/backward-diagonal.png")
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

### TypeScript Implementation (src/main.ts)

1. **Begin by importing the necessary headers.**

```typescript
import "./style.css";

import "@arcgis/map-components/components/arcgis-map";
import "@arcgis/map-components/components/arcgis-placement";
import "@arcgis/map-components/components/arcgis-expand";
import "@arcgis/map-components/components/arcgis-legend";

import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Slider from "@arcgis/core/widgets/Slider";
import SizeVariable from "@arcgis/core/renderers/visualVariables/SizeVariable";

import * as promiseUtils from "@arcgis/core/core/promiseUtils";
```

2. **Fetch the necessary feature layers to display the data on the map.**

```typescript
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

// Wait for the map to be ready and add the layers to it.
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
});
```

3. **Inside the map ready event listener, setup the slider and the utility functions.**

```typescript
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
```

4. **Inside the map ready event listener, setup the animation UI and utility functions.**

```typescript
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
```

5. **Inside the map ready event listener, set the slider value.**

```typescript
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
```

6. **Inside the map ready event listener, create a feature effect to highlight the features based on the gap value.**

```typescript
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
```

7. **Inside the map ready event listener, create a utility function to generate a tool tip upon hovering over the map or clicking on a feature.**

```typescript
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
```

8. **Inside the map ready event listener, create the tooltip UI and utility functions.**

```typescript
// Create the tooltip
function createTooltip() {
  const tooltip = document.createElement("div");
  const style = tooltip.style;

  style.opacity = "0";
  tooltip.setAttribute("role", "tooltip");
  tooltip.classList.add("tooltip");

  const content: HTMLElement | null = document.querySelector("#tooltipContent");
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
```

## Running the Application

1. **Development Server**

```bash
npm run dev
```

This will start the development server at `http://localhost:5173`

2. **Build for Production**

```bash
npm run build
```
