import "ol/ol.css";
import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { GeoJSON } from "ol/format";
import { Stroke, Fill, Style } from "ol/style";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";

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
          color: "rgba(0, 0, 255, 1.0)",
          width: 2,
        }),
        fill: new Fill({
          color: "rgba(0, 0, 255, 0.4)",
        }),
      }),
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
    });

    setMap(initialMap);
    // Save features to state so we can later edit the vector source if props.features changes
    setFeaturesLayer(vector);
  }, []);

  useEffect(() => {
    const { features } = props;

    // On first render or in case the API returned nothing, features will be an empty array
    if (features.length) {
      featuresLayer.setSource(
        new VectorSource({
          features,
        })
      );

      // Get Extent
      const extent = features[0].values_.geometry.extent_;
      // Zoom map to extent of vector layer
      map.getView().fit(extent, {
        padding: [100, 100, 100, 100],
      });
    }
  }, [props.features]);

  return <div ref={mapElement} className="map-container"></div>;
};

export default MapWrapper;
