import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Stroke, Fill, Style } from "ol/style";
import { GeoJSON } from "ol/format";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import { defaults as defaultControls } from "ol/control";
import MousePosition from "ol/control/MousePosition";
import { createStringXY } from "ol/coordinate";

const MapWrapper = (props) => {
  const [map, setMap] = useState();
  const [featuresLayer, setFeaturesLayer] = useState(null);

  // Stores reference to element into which map should render
  const mapElement = useRef();

  // Initialize map on first render
  useEffect(() => {
    // Set Dutch projection definition that is to be used by the OSM baselayer
    proj4.defs(
      "EPSG:28992",
      "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs"
    );
    register(proj4);
    const dutchProjection = getProjection("EPSG:28992");

    // Initial Vector source -> Bommelerwaard Woonplaatsen
    const vectorSource = new VectorSource({
      format: new GeoJSON(),
      url:
        "https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?service=WFS&version=2.0.0&request=GetFeature&typename=bag:woonplaats&outputFormat=json&bbox=135182.04,421669.31,140942.71,425358.39",
    });

    const vector = new VectorLayer({
      source: vectorSource,
      style: new Style({
        stroke: new Stroke({
          color: "#282b9d",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(40, 43, 197, 0.45)",
        }),
      }),
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(1),
      undefinedHTML: "XY Coordinates",
    });

    const initialMap = new Map({
      target: mapElement.current,
      // set Open Street map as base map
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vector,
      ],
      view: new View({
        projection: dutchProjection,
        // Take Hilversum as center
        center: [142892.19, 470783.87],
        zoom: 9,
      }),
      controls: defaultControls().extend([mousePositionControl]),
    });

    setMap(initialMap);
    // Save features to state so we can later edit the vector source if props.features changes
    setFeaturesLayer(vector);
  }, []);

  // Update map directly whenever a new vector layer is passed down the props
  useEffect(() => {
    const { features } = props;

    // On first render or in case the API returned nothing, features will be an empty array
    if (features.length) {
      featuresLayer.setSource(
        new VectorSource({
          features,
        })
      );

      // Zoom in on the first instance of the selected place
      const extent = features[0].values_.geometry.extent_;
      map.getView().fit(extent, {
        padding: [150, 150, 150, 150],
      });
    }
  }, [props.features]);

  return <div ref={mapElement} className="map-container"></div>;
};

export default MapWrapper;
