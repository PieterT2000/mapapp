import "../styles/sidebar.scss";
import { ReactComponent as Smiley } from "../styles/icons/happiness.svg";

import React, { useEffect, useState } from "react";
import TypeAhead from "./TypeAhead";

const SideBar = ({ submitHandler, renderComplete }) => {
  const [places, setPlaces] = useState([]);

  // Loads places on first render asynchrounsly and passed them as a prop to TypeAhead
  useEffect(() => {
    async function fetchPlaces() {
      // Use absolute URL path as places.txt is placed in public folder
      const res = await fetch(window.location.href + "/places.txt");
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
      <TypeAhead
        renderComplete={renderComplete}
        submitHandler={submitHandler}
        places={places}
      />
    </div>
  );
};

export default SideBar;
