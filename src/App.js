import "ol/ol.css";
import "./styles/app.scss";
import React, { useState } from "react";

import SideBar from "./Components/SideBar";
import MapWrapper from "./Components/MapWrapper";
import { GeoJSON } from "ol/format";

function App() {
  const [features, setFeatures] = useState("");
  const [renderComplete, setRenderComplete] = useState();

  let api =
    "https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?service=WFS&version=2.0.0&request=GetFeature&typename=bag:woonplaats&count=5&outputFormat=json&count-5";

  /**
   * Loads a new vector source, once user has selected a new placename to show
   * Triggered by: Selection of placename from suggestions
   * Notifies: MapWrapper -> should render a new vector
   */
  const handleSubmit = (placeName) => {
    if (!placeName) return;

    const queryParam = "&filter=";
    const filterStr = `<Filter><PropertyIsEqualTo><PropertyName>bag:woonplaats</PropertyName><Literal>${placeName}</Literal></PropertyIsEqualTo></Filter>`;
    api += queryParam + encodeURIComponent(filterStr);

    fetch(api)
      .then((res) => res.json())
      .then((fetchedFeatures) => {
        // Parse Features from returned JSON object
        const parsedFeatures = new GeoJSON().readFeatures(fetchedFeatures);
        setFeatures(parsedFeatures);

        // Start spinning
        setRenderComplete(false);
      });
  };

  return (
    <div className="App">
      <SideBar renderComplete={renderComplete} submitHandler={handleSubmit} />
      <MapWrapper
        renderCompleteListener={() => setRenderComplete(true)}
        features={features}
      />
    </div>
  );
}

export default App;
