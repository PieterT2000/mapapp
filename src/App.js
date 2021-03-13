import "./App.scss";
import React, { useState } from "react";

import MapWrapper from "./Map/MapWrapper";
import { GeoJSON } from "ol/format";

function App() {
  const [woonplaats, setWoonplaats] = useState("");
  const [features, setFeatures] = useState("");

  let api =
    "https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?service=WFS&version=2.0.0&request=GetFeature&typename=bag:woonplaats&count=5&outputFormat=json&count-5";

  const handleInput = (e) => {
    let val = e.target.value;
    // Capitalize woonplaats
    val = val.charAt(0).toUpperCase() + val.slice(1);
    setWoonplaats(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!woonplaats) return;

    const queryParam = "&filter=";
    const filterStr = `<Filter><PropertyIsEqualTo><PropertyName>bag:woonplaats</PropertyName><Literal>${woonplaats}</Literal></PropertyIsEqualTo></Filter>`;
    api += queryParam + encodeURIComponent(filterStr);

    // Fetch new vector source
    fetch(api)
      .then((res) => res.json())
      .then((fetchedFeatures) => {
        // Parse Features from return JSON object
        const parsedFeatures = new GeoJSON().readFeatures(fetchedFeatures);

        // Pass features on to MapWrapper component (state value gets passed a prop)
        setFeatures(parsedFeatures);
      });
  };

  return (
    <div className="App">
      <h1>Test map!</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          onChange={(e) => handleInput(e)}
          type="text"
          autoComplete="off"
        />
        <button>Submit</button>
      </form>
      <MapWrapper features={features} />
    </div>
  );
}

export default App;
