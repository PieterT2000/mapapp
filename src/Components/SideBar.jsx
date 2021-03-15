import "../styles/sidebar.scss";

import React, { useEffect, useState } from "react";
import Input from "./Input";

const SideBar = ({ submitHandler }) => {
  const [places, setPlaces] = useState([]);

  // Load places async
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
        <h2>Lie of the land</h2>
        <p>
          By typing in your placename, you can check out your town's/city's
          borders. (to make sure you will never cross the border!)
        </p>
      </div>
      <Input submitHandler={submitHandler} places={places} />
    </div>
  );
};

export default SideBar;
