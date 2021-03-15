import "ol/ol.css";
import "./styles/app.scss";
import React, { useState, useEffect } from "react";

import MapWrapper from "./Map/MapWrapper";
import { GeoJSON } from "ol/format";
import Input from "./Components/Input";
import SideBar from "./Components/SideBar";

function App() {
  const [woonplaats, setWoonplaats] = useState("");
  const [features, setFeatures] = useState("");

  let api =
    "https://geodata.nationaalgeoregister.nl/bag/wfs/v1_1?service=WFS&version=2.0.0&request=GetFeature&typename=bag:woonplaats&count=5&outputFormat=json&count-5";

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

  // const handleInput = (e) => {
  //   let val = e.target.value.trim();

  //   // We're only interested in top 10 matches
  //   let placeMatches = places.filter((place) => {
  //     const regex = new RegExp(`^${val}`, "gi");
  //     return place.match(regex);
  //   }).slice(0,10);
  //   setMatches(placeMatches);
  // };

  return (
    <div className="App">
      <SideBar submitHandler={handleSubmit} />
      <MapWrapper features={features} />
    </div>
  );
}

export default App;
