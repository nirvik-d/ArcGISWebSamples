require([
    "esri/layers/support/RasterFunction",
    "esri/layers/support/rasterFunctionUtils",
    "esri/layers/ImageryTileLayer"
  ], (
    RasterFunction,
    rasterFunctionUtils,
    ImageryTileLayer
  ) => {

    const customAnalysisParams = {
      elevation: { min: 2000, max: 9000 },
      slope: { min: 10, max: 90 },
      aspects: { N: false, NE: false, E: false, SE: true, S: true, SW: true, W: false, NW: false }
    };

    let activeAnalysisMode = "Custom"; // "Custom" | "Elevation" | "Slope"

    /* ------------------------------ */
    /* -- Slope - Raster Functions -- */

    const slope = rasterFunctionUtils.slope({
      slopeType: "degree",
      zFactor: 1
    });

    // Remap slope values (degrees) to categorical ranges
    const remapSlope = rasterFunctionUtils.remap({
      rangeMaps: [
        { range: [30, 35], output: 30 },
        { range: [35, 40], output: 35 },
        { range: [40, 45], output: 40 },
        { range: [45, 90], output: 45 }
      ],
      outputPixelType: "u8",
      raster: slope
    });

    // Map categorical ranges to RGB colors
    const colorMapSlope = rasterFunctionUtils.colormap({
      colormap: [
        [30, 255, 255, 0],
        [35, 255, 165, 0],
        [40, 255, 0, 0],
        [45, 128, 0, 128]
      ],
      raster: remapSlope
    });

    /* --------------------------------- */
    /* -- Elevation - Raster Function -- */

    const colorMapElevation = rasterFunctionUtils.colormap({
      colorRampName: "elevation1"
    });

    /* -------------------------------------------- */
    /* ---- Custom Analysis - Raster Functions ---- */

    let customColor = [0, 122, 194]

    function createCustomAnalysis(color = customColor) {

      // Mask out elevation outside of parameter range
      const elevationMask = rasterFunctionUtils.mask({
        includedRanges: [[customAnalysisParams.elevation.min, customAnalysisParams.elevation.max]],
        noDataValues: [[-9999]],
        noDataInterpretation: "match-any"
      });

      // Compute slope on masked elevation
      const slopeFunction = rasterFunctionUtils.slope({
        slopeType: "degree",
        zFactor: 1,
        raster: elevationMask
      });

      // Mask out slopes outside of parameter range
      const slopeMask = rasterFunctionUtils.mask({
        includedRanges: [[customAnalysisParams.slope.min, customAnalysisParams.slope.max]],
        noDataValues: [[-9999]],
        noDataInterpretation: "match-any",
        raster: slopeFunction
      });

      // Map included slopes >= 0 to 1
      const greaterThanSlope0 = rasterFunctionUtils.greaterThanEqual({
        raster: slopeMask,
        raster2: 0
      });

      // Compute aspect on masked elevation
      const aspectFunction = rasterFunctionUtils.aspect({
        raster: elevationMask
      });

      // Map aspect as 1 (include) or 0 (exclude) according to parameters
      const remapAspectFunction = rasterFunctionUtils.remap({
        rangeMaps: [
          { range: [-Infinity, 0], output: 1 }, // Include flats
          { range: [360, Infinity], output: 1 }, // Include flats
          { range: [337.5, 360], output: +customAnalysisParams.aspects.N },
          { range: [0, 22.5], output: +customAnalysisParams.aspects.N },
          { range: [22.5, 67.5], output: +customAnalysisParams.aspects.NE },
          { range: [67.5, 112.5], output: +customAnalysisParams.aspects.E },
          { range: [112.5, 157.5], output: +customAnalysisParams.aspects.SE },
          { range: [157.5, 202.5], output: +customAnalysisParams.aspects.S },
          { range: [202.5, 247.5], output: +customAnalysisParams.aspects.SW },
          { range: [247.5, 292.5], output: +customAnalysisParams.aspects.W },
          { range: [292.5, 337.5], output: +customAnalysisParams.aspects.NW }
        ],
        raster: aspectFunction
      });

      // Combine slope and aspect rasters
      const combineAspectSlope = rasterFunctionUtils.booleanAnd({
        raster: greaterThanSlope0,
        raster2: remapAspectFunction
      });

      // Assign an RGB color to all raster cells with a value of 1
      const colorMapFinal = rasterFunctionUtils.colormap({
        colormap: [[1, ...color]],
        raster: combineAspectSlope
      });

      return colorMapFinal;
    }

    /* ------------------ */
    /* -- UI Functions -- */

    // Setup layer with initial raster function
    const analysisLayer = new ImageryTileLayer({
        url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
        title: "Custom Analysis",
        rasterFunction: createCustomAnalysis(customColor),
        opacity: 0.8
      });
      
    const opacitySlider = document.getElementById("opacitySlider");
    opacitySlider.addEventListener("calciteSliderInput", (event) => {
      analysisLayer.opacity = 1 - event.target.value / 100;
    });

    const elevationSlider = document.getElementById("elevationSlider");
    elevationSlider.addEventListener("calciteSliderChange", (event) => {
      customAnalysisParams.elevation = {
        min: event.target.minValue,
        max: event.target.maxValue
      };
      analysisLayer.rasterFunction = createCustomAnalysis(customColor);
    });

    const slopeSlider = document.getElementById("slopeSlider");
    slopeSlider.addEventListener("calciteSliderChange", (event) => {
      customAnalysisParams.slope = { min: event.target.minValue, max: event.target.maxValue };
      analysisLayer.rasterFunction = createCustomAnalysis(customColor);
    });

    const roseDirections = document.getElementsByClassName("roseDirection");
    for (const roseDirection of roseDirections) {
      roseDirection.addEventListener("click", () => {
        const active = roseDirection.classList.toggle("active");
        const aspect = roseDirection.getAttribute("data-aspect").toUpperCase();
        customAnalysisParams.aspects[aspect] = active;
        analysisLayer.rasterFunction = createCustomAnalysis(customColor);
      });
    }

    const colorPicker = document.getElementById("colorPicker");
    const colorButton = document.getElementById("colorButton");
    colorPicker.addEventListener("calciteColorPickerChange", (event) => {
      const color = event.target.value;
      colorButton.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      customColor = [color.r, color.g, color.b]
      analysisLayer.rasterFunction = createCustomAnalysis(customColor);
    });

    const customAnalysisDiv = document.getElementById("customAnalysisDiv");
    const aspectCompass = document.getElementById("compassRoseSvg");
    const analysisModeSegmentedControl = document.getElementById("analysisModeSegmentedControl");
    const legendExpand = document.querySelector("arcgis-expand");
    analysisModeSegmentedControl.addEventListener("calciteSegmentedControlChange", (event) => {
      activeAnalysisMode = event.target.value;

      if (activeAnalysisMode === "Custom") {
        customAnalysisDiv.style.display = "block";
        aspectCompass.style.display = "block";
        legendExpand.collapse();
      } else {
        customAnalysisDiv.style.display = "none";
        aspectCompass.style.display = "none";
        legendExpand.expand();
      }

      // Reset renderer
      analysisLayer.renderer = null;

      switch (activeAnalysisMode) {
        case "Slope":
          analysisLayer.title = activeAnalysisMode + " | °";
          analysisLayer.rasterFunction = colorMapSlope;
          break;
        case "Elevation":
          analysisLayer.title = activeAnalysisMode + " | m.a.s.l";
          analysisLayer.rasterFunction = colorMapElevation;
          break;
        case "Custom":
        default:
          analysisLayer.title = activeAnalysisMode + " Analysis";
          analysisLayer.rasterFunction = createCustomAnalysis(customColor);
          break;
      }
    });

    // Access arcgis-basemap-toggle component
    const arcgisBasemapToggle = document.querySelector("arcgis-basemap-toggle");
    arcgisBasemapToggle.nextBasemap = "hybrid";

    // Access arcgis-scene component
    const arcgisScene = document.querySelector("arcgis-scene");
    arcgisScene.addEventListener("arcgisViewReadyChange", () => {
      arcgisScene.map.add(analysisLayer);
    });
  });