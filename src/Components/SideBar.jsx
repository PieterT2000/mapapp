import "../styles/sidebar.scss";
import { ReactComponent as Smiley } from "../styles/icons/happiness.svg";

import React, { useEffect, useState } from "react";
import TypeAhead from "./TypeAhead";

const SideBar = ({ submitHandler }) => {
  const [places, setPlaces] = useState([]);

  // Load places on first render asynchrounsly
  useEffect(() => {
    async function fetchPlaces() {
      const res = await fetch("mapapp/places.txt");
      const places = await res.text();
      const placesArr = places.split("\n");
      setPlaces(placesArr);
    }
    fetchPlaces();
  }, []);

  return (
    <div className="sidebar">
      <div className="header">
        <h2>🗺️ Lie of the land</h2>
        <p>
          By typing in your placename, you can check out your town's/city's
          borders so you always know how far to go. {<Smiley />}
        </p>
      </div>
      <TypeAhead submitHandler={submitHandler} places={places} />
    </div>
  );
};

export default SideBar;
